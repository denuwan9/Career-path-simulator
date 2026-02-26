import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Search, TrendingUp, Award } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-glass-100 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-colors"
    >
        <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
            <h4 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h4>
            {trend && <span className="text-xs text-green-400 flex items-center gap-1">+{trend}% <TrendingUp size={10} /></span>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={24} />
        </div>
    </motion.div>
);

const StatsRow = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Eye} label="Profile Views" value="1,240" trend="12" color="from-blue-500 to-cyan-500" delay={0.1} />
            <StatCard icon={Search} label="Search Appearances" value="345" trend="8" color="from-purple-500 to-pink-500" delay={0.2} />
            <StatCard icon={Award} label="Skills Verified" value="18" trend="4" color="from-orange-500 to-red-500" delay={0.3} />
            <StatCard icon={TrendingUp} label="Reputation" value="Top 10%" color="from-emerald-500 to-green-500" delay={0.4} />
        </div>
    );
};

export default StatsRow;
