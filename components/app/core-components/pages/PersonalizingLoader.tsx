
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardBackground, Spotlight } from './LoginPage';
import { BarChart3, Briefcase, DollarSign, Palette, Target, Users, Wallet } from 'lucide-react';

interface PersonalizingLoaderProps {
    onComplete: () => void;
}

const icons = [
    { Icon: Users, delay: 0 },
    { Icon: Briefcase, delay: 0.2 },
    { Icon: DollarSign, delay: 0.4 },
    { Icon: Target, delay: 0.6 },
    { Icon: BarChart3, delay: 0.8 },
    { Icon: Wallet, delay: 1.0 },
    { Icon: Palette, delay: 1.2 },
];

export const PersonalizingLoader: React.FC<PersonalizingLoaderProps> = ({ onComplete }) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 8000); // from 4 to 8 seconds for effect

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            key="personalizing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black font-sans"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none fixed">
                <Spotlight />
            </div>

            <div className="relative z-10 text-center flex flex-col items-center">
                
                {/* Animated Icons */}
                <div className="flex gap-4 mb-8">
                    {icons.map(({ Icon, delay }, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                            transition={{
                                duration: 4,
                                delay: delay,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.2, 0.8, 1]
                            }}
                            className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center"
                        >
                            <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                    ))}
                </div>

                {/* Text */}
                <div className="relative w-[36ch] text-center">
                    <AnimatePresence>
                        <motion.h1
                            key="loading-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1.5 }}
                            className="text-2xl font-bold text-white"
                        >
                            O Sócio está absorvendo cada detalhe do seu negócio...
                        </motion.h1>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <motion.div 
                        className="h-full bg-white"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 7.5, ease: 'linear' }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
