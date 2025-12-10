
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// @ts-nocheck

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADERS ---
const vertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform vec3 uLightPos; // Dynamic orbiting light
  uniform float uPixelRatio;
  uniform float uScrollProgress;
  
  attribute vec3 aRandom;
  
  varying float vAlpha;
  varying float vLightIntensity;

  void main() {
    vec3 pos = position;
    
    // Dynamic Movement (Noise)
    float noiseAmp = 0.2 + uScrollProgress * 0.3;
    pos.x += sin(uTime * 0.5 + aRandom.y * 10.0) * noiseAmp;
    pos.y += cos(uTime * 0.3 + aRandom.x * 10.0) * noiseAmp;
    pos.z += sin(uTime * 0.4 + aRandom.z * 10.0) * noiseAmp;

    // Mouse Repulsion Physics
    float dx = pos.x - uMouse.x;
    float dy = pos.y - uMouse.y;
    float dist = sqrt(dx*dx + dy*dy);
    float radius = 4.0; 

    if (dist < radius) {
        float force = (radius - dist) / radius;
        float angle = atan(dy, dx);
        pos.x += cos(angle) * force * 3.0;
        pos.y += sin(angle) * force * 3.0;
        pos.z += force * 2.0; 
    }

    // --- LIGHTING CALCULATIONS ---
    
    // 1. Orbiting Volumetric Light
    float dLight = distance(pos, uLightPos);
    // Inverse square-ish falloff for soft volume
    float lightIntensity = 1.0 - smoothstep(0.0, 18.0, dLight); 
    
    // 2. Mouse Glow (Interactive Light)
    // Estimate 2D distance for "cursor light" effect
    float dMouse = distance(vec2(pos.x, pos.y), vec2(uMouse.x, uMouse.y));
    float mouseGlow = 1.0 - smoothstep(0.0, 5.0, dMouse);
    
    // Combine lights
    vLightIntensity = lightIntensity * 0.5 + mouseGlow * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // --- SIZE CALCULATION ---
    float sizeMod = 1.0 + uScrollProgress * 0.5;
    // Lit particles bloom (get larger)
    float lightBloom = 1.0 + vLightIntensity * 0.8; 
    
    gl_PointSize = (4.0 * uPixelRatio * sizeMod * lightBloom) * (10.0 / -mvPosition.z);
    
    // --- ALPHA / FOG ---
    // Base twinkling
    float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aRandom.x * 20.0);
    
    // Atmospheric Fog: Fade out distant particles
    // Assuming camera is at z=10, particles range roughly z=-10 to z=10
    float distToCamera = -mvPosition.z;
    float fog = smoothstep(25.0, 5.0, distToCamera); 
    
    vAlpha = twinkle * fog;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uBloomStrength;
  varying float vAlpha;
  varying float vLightIntensity;

  void main() {
    // Circle shape
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft Bloom Gradient
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 2.0); // Sharpen curve
    
    // Hot Core
    float core = smoothstep(0.1, 0.0, r);
    
    // Final Alpha Composition
    // Base visibility + Light Boosting
    float brightness = 1.0 + vLightIntensity * uBloomStrength; 
    float finalAlpha = vAlpha * (glow * 0.6 + core * 0.4) * brightness;
    
    // Clamp
    finalAlpha = min(finalAlpha, 1.0);

    gl_FragColor = vec4(uColor, finalAlpha);
  }
`;

const ParticleField = ({ color, bloomStrength }) => {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const timeRef = useRef(0);
  
  // Generate particles
  const particlesCount = 4500; // Increased count for volume
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const randoms = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 30;     
        pos[i * 3 + 1] = (Math.random() - 0.5) * 20; 
        pos[i * 3 + 2] = (Math.random() - 0.5) * 15; 
        
        randoms[i * 3] = Math.random();
        randoms[i * 3 + 1] = Math.random();
        randoms[i * 3 + 2] = Math.random();
    }
    return { pos, randoms };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uLightPos: { value: new THREE.Vector3(0, 0, 0) },
    uColor: { value: new THREE.Color(color) },
    uBloomStrength: { value: bloomStrength },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uScrollProgress: { value: 0 }
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uBloomStrength.value = bloomStrength;
  }, [color, bloomStrength, uniforms]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 1. Scroll Physics
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(window.scrollY / (maxScroll || 1), 0), 1);
      
      meshRef.current.material.uniforms.uScrollProgress.value = scrollProgress;

      // 2. Time Logic
      const speedMultiplier = 1.0 + scrollProgress * 1.5;
      timeRef.current += delta * speedMultiplier;
      meshRef.current.material.uniforms.uTime.value = timeRef.current;
      
      // 3. Mouse Logic (Lerped)
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      
      const currentMouse = meshRef.current.material.uniforms.uMouse.value;
      currentMouse.x += (x - currentMouse.x) * 0.1;
      currentMouse.y += (y - currentMouse.y) * 0.1;

      // 4. Orbiting Light Source Logic
      // Moves in a wide Lissajous/Figure-8 pattern
      const lightX = Math.sin(timeRef.current * 0.5) * 10.0;
      const lightY = Math.cos(timeRef.current * 0.3) * 8.0;
      const lightZ = Math.sin(timeRef.current * 0.2) * 5.0;
      
      meshRef.current.material.uniforms.uLightPos.value.set(lightX, lightY, lightZ);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={particlesCount}
          array={positions.randoms}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const HeroScene: React.FC<{ particleColor?: string, bloomStrength?: number }> = ({ particleColor = "#FFFFFF", bloomStrength = 1.5 }) => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ParticleField color={particleColor} bloomStrength={bloomStrength} />
      </Canvas>
    </div>
  );
};

export const QuantumComputerScene: React.FC = () => <HeroScene />;
