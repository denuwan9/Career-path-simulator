import React from 'react';
import { motion } from 'framer-motion';

const PulsingOrbital = ({ size = "w-20 h-20", color = "bg-blue-500" }) => {
    return (
        <div className={`relative ${size} flex items-center justify-center`}>
            {/* Core */}
            <motion.div
                className={`absolute w-1/3 h-1/3 rounded-full ${color} blur-md`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Inner Ring */}
            <motion.div
                className={`absolute w-2/3 h-2/3 rounded-full border-2 border-${color.split('-')[1]}-400/30`}
                animate={{
                    rotateX: [0, 180, 360],
                    rotateY: [0, 90, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Outer Ring */}
            <motion.div
                className={`absolute w-full h-full rounded-full border border-${color.split('-')[1]}-300/20`}
                animate={{
                    rotateZ: [0, 360],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Satellite */}
            <motion.div
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
                <div className={`absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full ${color} shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]`} />
            </motion.div>
        </div>
    );
};

export default PulsingOrbital;
