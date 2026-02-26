import React from 'react';
import { motion } from 'framer-motion';

const LiquidProgressBar = ({ progress, color = 'bg-blue-500', height = 'h-2' }) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full ${height} bg-slate-700/30 rounded-full overflow-hidden relative`}>
            <motion.div
                className={`h-full ${color} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                {/* Liquid Sheen Effect */}
                <motion.div
                    className="absolute top-0 bottom-0 right-0 w-4 bg-white/50 blur-sm"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ skewX: -20 }}
                />

                {/* Bubble Particles (Simulated) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full opacity-50 blur-[1px]" />
            </motion.div>
        </div>
    );
};

export default LiquidProgressBar;
