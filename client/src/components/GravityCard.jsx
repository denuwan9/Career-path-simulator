import React from 'react';
import { motion } from 'framer-motion';
import { useElevation } from '../context/ElevationContext';

const GravityCard = ({ id, children, className = '', onClick }) => {
    const { focusedId, elevate, drop } = useElevation();
    const isFocused = focusedId === id;
    const isBlurred = focusedId && focusedId !== id;

    const handleClick = () => {
        if (isFocused) {
            drop();
        } else {
            elevate(id);
            if (onClick) onClick();
        }
    };

    return (
        <motion.div
            layoutId={id}
            onClick={handleClick}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            animate={{
                scale: isFocused ? 1.05 : isBlurred ? 0.95 : 1,
                opacity: isBlurred ? 0.5 : 1,
                filter: isBlurred ? 'blur(4px)' : 'blur(0px)',
                zIndex: isFocused ? 50 : 1
            }}
            whileHover={!focusedId ? {
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            } : {}}
            whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`
                bg-glass-100 backdrop-blur-md border border-slate-200 rounded-2xl p-6 cursor-pointer relative overflow-hidden
                shadow-glass-sm transition-colors duration-300
                ${isFocused ? 'bg-glass-200 border-blue-500/50 ring-1 ring-blue-500/30' : 'hover:bg-glass-200 hover:border-slate-300'}
                ${className}
            `}
        >
            {/* Ambient Glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isFocused ? 'opacity-100' : ''}`} />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GravityCard;
