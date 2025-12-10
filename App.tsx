/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { HeroScene } from './components/QuantumScene';
import { MarketTicker, SwapInterface, FeatureCard, StatCard } from './components/Diagrams';
import { Menu, X, ArrowRight, Shield, Zap, Layers, ShieldCheck, Lock, Activity, Globe, ChevronRight, CheckCircle2, Circle, Loader2, Sun, Moon, Target, Users, Twitter, Github, Sliders, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, Variants, useScroll, useSpring, useTransform } from 'framer-motion';

// Separate component for Roadmap Items to handle individual parallax refs
const RoadmapItem = ({ item, index }: { item: any, index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax: Cards float upward slightly as you scroll down, creating depth against the static line
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  return (
    <div ref={ref} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Dot Indicator */}
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={
                item.status === 'delayed' 
                ? { scale: [1, 1.15, 1], opacity: 1 } 
                : { scale: 1, opacity: 1 }
            }
            viewport={{ once: true, margin: "-100px" }}
            transition={
                item.status === 'delayed' 
                ? { 
                    opacity: { duration: 0.4, delay: 0.2 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  } 
                : { duration: 0.4, delay: 0.2 }
            }
            className={`absolute left-0 md:left-1/2 w-8 h-8 rounded-full border flex items-center justify-center z-10 transform md:-translate-x-1/2 shadow-lg dark:shadow-[0_0_10px_rgba(0,0,0,0.8)]
                ${item.status === 'delayed' 
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30' 
                    : 'bg-white dark:bg-[#050508] border-black/10 dark:border-white/20'}`}
        >
            {item.status === 'completed' && <CheckCircle2 size={16} className="text-black dark:text-white" />}
            {item.status === 'active' && <Loader2 size={16} className="text-black dark:text-white animate-spin" />}
            {item.status === 'upcoming' && <Circle size={16} className="text-gray-400 dark:text-gray-500" />}
            {item.status === 'delayed' && <AlertCircle size={16} className="text-orange-500 dark:text-orange-400" />}
        </motion.div>

        {/* Content Spacer for Desktop Layout */}
        <div className="hidden md:block w-5/12"></div>

        {/* Content Card Wrapper with Parallax Effect */}
        <motion.div
            style={{ y }}
            className="ml-12 md:ml-0 w-full md:w-5/12"
        >
            {/* Entrance Animation */}
            <motion.div 
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl border transition-all duration-300 relative group
                    bg-white/40 dark:bg-white/[0.02] 
                    border-black/5 dark:border-white/5
                    hover:bg-white/60 dark:hover:bg-white/[0.05] 
                    hover:border-black/10 dark:hover:border-white/30 
                    hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
                    ${item.status === 'active' ? 'border-black/20 dark:border-white/20 shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.05)]' : ''}
                    ${item.status === 'delayed' ? 'border-orange-500/20 dark:border-orange-400/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : ''}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold tracking-widest uppercase ${item.status === 'active' ? 'text-black dark:text-white' : item.status === 'delayed' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>{item.quarter}</span>
                    {item.status === 'active' && <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold text-black dark:text-white border border-black/10 dark:border-white/10">LIVE</span>}
                    {item.status === 'delayed' && <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-[10px] font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">DELAYED</span>}
                </div>
                <h3 className={`text-xl font-bold font-display mb-2 text-gray-900 dark:text-white transition-all ${item.status === 'delayed' ? 'group-hover:underline decoration-orange-500/60 underline-offset-4 decoration-2' : ''}`}>{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
        </motion.div>
    </div>
  );
}

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bloomStrength, setBloomStrength] = useState(1.5);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Theme Persistence
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // Roadmap Scroll Animation Logic (Line Drawing)
  const roadmapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: roadmapRef,
    offset: ["start 80%", "end 50%"]
  });

  const scrollLineHeight = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const navItemVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    open: { 
        opacity: 1, 
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
  };

  const mobileItemVariants: Variants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  const roadmapData = [
    {
      quarter: "Q1 2024",
      title: "Protocol Genesis",
      desc: "Launch of Novus DEX V1 with core AMM functionality and initial liquidity mining rewards.",
      status: "completed"
    },
    {
      quarter: "Q2 2024",
      title: "Multi-Chain Expansion",
      desc: "Integration with Arbitrum and Optimism. Release of the Novus Bridge for cross-chain swaps.",
      status: "completed"
    },
    {
      quarter: "Q3 2024",
      title: "Advanced Trading Engine",
      desc: "Deployment of on-chain limit orders and perpetual futures trading with up to 50x leverage.",
      status: "active"
    },
    {
      quarter: "Q4 2024",
      title: "Novus DAO",
      desc: "Governance token launch. Transition to community-led protocol management and treasury allocation.",
      status: "upcoming"
    },
    {
      quarter: "Q1 2025",
      title: "Privacy Shield",
      desc: "Integration of zero-knowledge proofs for optional transaction privacy and identity masking.",
      status: "delayed"
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 ease-in-out bg-gray-50 text-gray-900 dark:bg-cyber-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 transition-colors duration-500"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'bg-white/80 dark:bg-[#050508]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3 shadow-lg dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <motion.div variants={navItemVariants} className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center font-bold text-white dark:text-black text-lg shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 group-hover:scale-105">
                <span className="relative z-10 transition-transform duration-700 ease-out group-hover:rotate-[360deg]">N</span>
            </div>
            <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-xl tracking-wide group-hover:tracking-widest transition-all duration-300">NOVUS</span>
                <span className="text-[10px] text-gray-500 font-mono font-medium tracking-[0.2em] uppercase dark:group-hover:text-white group-hover:text-black transition-colors">Protocol</span>
            </div>
          </motion.div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {['Markets', 'Exchange', 'Governance', 'Developers'].map((item) => (
                <motion.a 
                    key={item} 
                    variants={navItemVariants}
                    href="#" 
                    className="relative group/link py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    {item}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-black dark:bg-white group-hover/link:w-full group-hover/link:left-0 transition-all duration-300 ease-out"></span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-black/20 dark:bg-white/20 blur-[2px] group-hover/link:w-full group-hover/link:left-0 transition-all duration-300 ease-out delay-75"></span>
                </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
                variants={navItemVariants}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button 
                variants={navItemVariants}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all duration-300"
            >
                Log In
            </motion.button>

            <motion.div className="relative group/tooltip" variants={navItemVariants}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <span className="relative z-10 text-sm font-bold flex items-center gap-2">
                        Connect Wallet
                    </span>
                </motion.button>
                <div className="absolute top-full right-0 mt-3 px-4 py-2 bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white text-xs font-medium rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-xl border border-black/5 dark:border-white/10 pointer-events-none whitespace-nowrap z-50">
                    Securely connect your crypto wallet
                    <div className="absolute bottom-full right-8 w-2 h-2 bg-white dark:bg-[#1E2130] transform rotate-45 translate-y-1 border-t border-l border-black/5 dark:border-white/10"></div>
                </div>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            variants={navItemVariants}
            className="md:hidden text-gray-900 dark:text-white p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors z-50 relative" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
            <motion.div 
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
                className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent"></div>
                
                {['Markets', 'Exchange', 'Governance', 'Developers'].map((item) => (
                    <motion.a 
                        key={item} 
                        variants={mobileItemVariants}
                        href="#" 
                        onClick={() => setMenuOpen(false)} 
                        className="font-display text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-4 group"
                    >
                        <span className="w-2 h-2 rounded-full bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item}
                    </motion.a>
                ))}
                
                <motion.div variants={mobileItemVariants} className="mt-8 w-64 space-y-4 flex flex-col items-center">
                    <button 
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white mb-4"
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:scale-105 transition-transform">
                        Connect Wallet
                    </button>
                    <button className="w-full py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl font-bold text-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        View Docs
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[700px] flex items-center pt-20 overflow-hidden">
        {/* 3D Background */}
        <HeroScene particleColor={theme === 'dark' ? '#FFFFFF' : '#000000'} bloomStrength={bloomStrength} />
        
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left pointer-events-none">
                {/* Enable pointer events only for interactive elements */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="pointer-events-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white text-xs font-bold tracking-wider mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse"></span>
                        V3.0 IS LIVE
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight text-gray-900 dark:text-white">
                        The Future of <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-black via-black to-gray-400 dark:from-white dark:via-white dark:to-gray-600">Decentralized</span> Trading
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Experience lightning-fast swaps, minimal fees, and deep liquidity. Join over 2 million users on the world's most advanced DEX.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold shadow-xl hover:shadow-2xl dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            Start Trading 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-black/10 dark:border-white/10 rounded-full font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 transition-all flex items-center justify-center gap-2">
                            Read Docs
                        </button>
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <div className="mt-16 flex items-center justify-center lg:justify-start gap-8 opacity-30 grayscale hover:opacity-100 transition-all duration-700 pointer-events-auto">
                   {/* Mock Logos */}
                   <div className="font-display font-bold text-xl tracking-wider text-black dark:text-white">BINANCE</div>
                   <div className="font-display font-bold text-xl tracking-wider text-black dark:text-white">COINBASE</div>
                   <div className="font-display font-bold text-xl tracking-wider text-black dark:text-white">KRAKEN</div>
                </div>
            </div>

            {/* Interactive Hero Element */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.4, type: "spring" }}
                className="hidden lg:block relative z-20 pointer-events-auto"
            >
                <SwapInterface />
            </motion.div>
        </div>
      </header>

      {/* Floating Settings Control */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
            {showSettings && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl w-64"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bloom Intensity</span>
                        <span className="text-xs font-mono text-black dark:text-white">{bloomStrength.toFixed(1)}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="5" 
                        step="0.1" 
                        value={bloomStrength} 
                        onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                </motion.div>
            )}
        </AnimatePresence>
        
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
            <Sliders size={20} />
        </button>
      </div>

      {/* Ticker Strip */}
      <MarketTicker />

      <main>
        {/* Features Section */}
        <section className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Novus?</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Built for pros, accessible to everyone. We combine the speed of centralized exchanges with the security of DeFi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={Zap}
                        title="Lightning Fast"
                        desc="Execute trades in milliseconds. Our optimized matching engine ensures you never miss a price movement."
                        delay={0}
                    />
                    <FeatureCard 
                        icon={Shield}
                        title="Bank-Grade Security"
                        desc="Your funds are audited by top firms. Non-custodial architecture means you always own your keys."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={Layers}
                        title="Cross-Chain Bridge"
                        desc="Seamlessly move assets between Ethereum, Solana, and L2s with our integrated bridging solution."
                        delay={0.2}
                    />
                </div>
            </div>
        </section>

        {/* Ecosystem Stats */}
        <section className="py-24 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 border-y border-black/5 dark:border-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                     <StatCard value="$12.5B+" label="Total Volume" />
                     <StatCard value="2.4M" label="Verified Users" />
                     <StatCard value="$850M" label="Total Value Locked" />
                     <StatCard value="<50ms" label="Latency" />
                 </div>
            </div>
        </section>

        {/* Security/Privacy Section */}
        <section className="py-32">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1 relative">
                     <div className="absolute inset-0 bg-black/5 dark:bg-white/5 blur-[100px] rounded-full"></div>
                     <div className="relative bg-white/60 dark:bg-[#1E2130]/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-10 rounded-3xl shadow-2xl">
                        <div className="flex items-start gap-5 mb-8 group cursor-default">
                            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Audited Smart Contracts</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Our code is verified by Certik and Trail of Bits to ensure maximum security for your assets.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-5 mb-8 group cursor-default">
                            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                                <Lock size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Encrypted Data</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">End-to-end encryption for all user data, ensuring your privacy is never compromised.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5 group cursor-default">
                            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                                <Activity size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">24/7 Monitoring</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Real-time threat detection systems active around the clock to prevent malicious activity.</p>
                            </div>
                        </div>
                     </div>
                </div>
                <div className="order-1 lg:order-2">
                    <h2 className="font-display text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900 dark:text-white">Security First. <br/>Always.</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        In the world of DeFi, trust is earned through code, not promises. Novus is built on battle-tested architecture designed to withstand the most sophisticated attacks.
                    </p>
                    <button className="text-black dark:text-white font-bold flex items-center gap-2 hover:gap-4 transition-all group">
                        View Audit Reports <ChevronRight size={20} className="group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                    </button>
                </div>
            </div>
        </section>

        {/* Roadmap Section */}
        <section ref={roadmapRef} className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Roadmap</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Our strategic path to revolutionizing the DeFi landscape.</p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line Container */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-black/5 dark:bg-white/5 transform md:-translate-x-1/2"></div>
                    
                    {/* Animated Drawing Line */}
                    <motion.div 
                        style={{ scaleY: scrollLineHeight }}
                        className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-black/20 via-black to-black/20 dark:from-white/20 dark:via-white dark:to-white/20 transform md:-translate-x-1/2 origin-top shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />

                    <div className="space-y-24">
                        {roadmapData.map((item, index) => (
                           <RoadmapItem key={index} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* About Novus Section */}
        <section className="py-32 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#050508]/50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white text-xs font-bold tracking-wider mb-6">
                            <Users size={14} />
                            <span>ABOUT US</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                            Building the Financial <br/> Infrastructure of Tomorrow.
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Novus began with a simple yet radical idea: financial markets should be open, transparent, and accessible to everyone, everywhere.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            We are a diverse team of engineers, cryptographers, and designers spread across 12 countries, united by the mission to eliminate gatekeepers and return sovereignty to the user.
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform">
                                Read Manifesto
                            </button>
                            <button className="px-6 py-3 border border-black/10 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                Meet the Team
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent dark:from-white/5 rounded-3xl transform rotate-3"></div>
                        <div className="relative bg-white dark:bg-[#0A0A0C] border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10">
                                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Core Values</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Radical Transparency</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Every line of code is open source. Every transaction is verifiable on-chain.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">User Sovereignty</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">We never hold your funds. You retain absolute control over your assets at all times.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="group-hover:border-black/20 dark:group-hover:border-white/30 transition-colors"
                                            >
                                                <h4 className="font-bold text-gray-900 dark:text-white">Global Access</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Designed for borderless participation. No geographical restrictions on the protocol level.</p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-black/5 dark:from-white/10 to-transparent blur-[100px] pointer-events-none"></div>
             
             <div className="container mx-auto px-6 relative z-10">
                <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white">Ready to start your journey?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">Join the fastest growing community in DeFi and take control of your financial future today.</p>
                <button className="px-12 py-6 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-2xl dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                    Launch App
                </button>
             </div>
        </section>

      </main>

      <footer className="bg-gray-100 dark:bg-[#020203] border-t border-black/5 dark:border-white/5 pt-12 md:pt-20 pb-10 transition-colors duration-500">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-20">
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center font-bold text-white dark:text-black text-sm">N</div>
                        <span className="font-display font-bold text-2xl tracking-wide text-gray-900 dark:text-white">NOVUS</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
                        The world's premier decentralized exchange protocol. 
                        Trade tokens, earn yields, and access liquidity with ease.
                    </p>
                    <div className="flex gap-6">
                        {[Twitter, Github, Globe].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ scale: 1.2, color: theme === 'dark' ? '#FFFFFF' : '#000000' }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 dark:text-gray-500 transition-colors"
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Markets</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Exchange</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Earn</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Wallet</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">API Documentation</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Fees</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Security</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">About</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-500 dark:text-gray-500">© 2024 Novus Labs. All rights reserved.</p>
                <div className="flex gap-8 text-xs text-gray-500 dark:text-gray-500">
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;