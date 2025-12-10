/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, TrendingUp, Wallet, ShieldCheck, Zap, Globe } from 'lucide-react';

// --- LIVE MARKET TICKER ---
export const MarketTicker: React.FC = () => {
    const coins = [
        { sym: 'BTC', price: '$64,231.40', change: '+2.4%' },
        { sym: 'ETH', price: '$3,452.12', change: '+1.8%' },
        { sym: 'SOL', price: '$145.60', change: '+5.2%' },
        { sym: 'XRP', price: '$0.62', change: '-0.4%' },
        { sym: 'DOT', price: '$7.80', change: '+1.1%' },
        { sym: 'ADA', price: '$0.45', change: '+0.2%' },
        { sym: 'AVAX', price: '$35.20', change: '+3.4%' },
        { sym: 'LINK', price: '$14.90', change: '+2.1%' },
    ];

    return (
        <div className="w-full bg-white/50 dark:bg-cyber-black/50 border-y border-black/5 dark:border-white/5 overflow-hidden flex py-3 backdrop-blur-md transition-colors duration-500">
            <motion.div 
                className="flex items-center gap-12 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...coins, ...coins, ...coins].map((coin, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="font-bold text-gray-700 dark:text-gray-300 font-display">{coin.sym}</span>
                        <span className="text-gray-900 dark:text-white text-sm">{coin.price}</span>
                        <span className={`text-xs ${coin.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {coin.change}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// --- SWAP INTERFACE DEMO ---
export const SwapInterface: React.FC = () => {
    const [fromVal, setFromVal] = useState('1.5');
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSwap = () => {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 500);
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-black/5 dark:from-white/10 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/60 dark:bg-[#1E2130]/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full mx-auto shadow-2xl transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-900 dark:text-white font-display font-bold">Swap</h3>
                    <div className="text-gray-500 dark:text-gray-400 text-xs cursor-pointer hover:text-black dark:hover:text-white transition-colors">Settings</div>
                </div>

                {/* From Input */}
                <div className="bg-gray-100 dark:bg-cyber-dark/50 p-4 rounded-xl border border-black/5 dark:border-white/5 mb-2 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">From</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Balance: 4.20 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <input 
                            type="text" 
                            value={fromVal}
                            onChange={(e) => setFromVal(e.target.value)}
                            className="bg-transparent text-2xl font-bold text-gray-900 dark:text-white outline-none w-1/2" 
                        />
                        <div className="flex items-center gap-2 bg-white dark:bg-cyber-slate px-3 py-1.5 rounded-full cursor-pointer shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-[8px] font-bold text-white dark:text-black">ETH</div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white">ETH</span>
                        </div>
                    </div>
                </div>

                {/* Swap Icon */}
                <div className="flex justify-center -my-3 relative z-10">
                    <button 
                        onClick={handleSwap}
                        className="bg-white dark:bg-cyber-slate border border-black/5 dark:border-white/10 p-2 rounded-lg text-gray-600 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                    >
                        <ArrowDownUp size={16} className={isSpinning ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* To Input */}
                <div className="bg-gray-100 dark:bg-cyber-dark/50 p-4 rounded-xl border border-black/5 dark:border-white/5 mb-6 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">To</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Balance: 0.00 USDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-500">
                            {(parseFloat(fromVal || '0') * 3452.12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-cyber-slate px-3 py-1.5 rounded-full cursor-pointer shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[8px] font-bold text-white">$</div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white">USDC</span>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold shadow-lg hover:shadow-xl dark:hover:shadow-white/20 transition-all active:scale-95">
                    Connect Wallet
                </button>
            </div>
        </div>
    );
};

// --- FEATURE CARD ---
export const FeatureCard: React.FC<{ icon: any, title: string, desc: string, delay: number }> = ({ icon: Icon, title, desc, delay }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="group p-8 rounded-2xl bg-white/60 dark:bg-[#1E2130]/40 backdrop-blur-xl border border-white/20 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 transition-all duration-300 hover:border-black/5 dark:hover:border-white/20 shadow-sm hover:shadow-lg dark:hover:shadow-none"
        >
            <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-black dark:group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <Icon className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">{desc}</p>
        </motion.div>
    );
}

// --- STATS CARD ---
export const StatCard: React.FC<{ value: string, label: string }> = ({ value, label }) => {
    return (
        <div className="text-center group">
            <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 mb-2 group-hover:to-black dark:group-hover:to-white transition-all">
                {value}
            </div>
            <div className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold group-hover:text-black dark:group-hover:text-white transition-colors">{label}</div>
        </div>
    )
}