import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    User,
    Calendar,
    BookOpen,
    Briefcase,
    LogOut,
    LayoutDashboard,
    Settings,
    HelpCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Interviews', path: '/interviews', icon: Calendar },
        { name: 'Study Plan', path: '/study-plan', icon: BookOpen },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 to-indigo-900 border-r border-purple-800/50 text-slate-100 flex flex-col z-50">
            {/* Logo Section */}
            <div className="p-4 border-t border-purple-800/50 bg-black/20 rounded-xl">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-royal-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="font-bold text-white text-lg">CH</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-white/100 text-transparent block leading-tight">
                            CareerHelp
                        </span>
                        <span className="text-[10px] text-slate-400 tracking-widest uppercase font-bold">SLIIT University</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                            ${isActive(link.path)
                                ? 'bg-white/10 text-white shadow-sm border border-white/20'
                                : 'text-purple-200 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                    >
                        <link.icon size={20} className={`${isActive(link.path) ? 'text-white' : 'text-purple-300 group-hover:text-white transition-colors'}`} />
                        <span className="font-medium relative z-10">{link.name}</span>
                        {isActive(link.path) && (
                            <motion.div
                                layoutId="active-glow"
                                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent blur-xl px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-purple-800/50 bg-black/10">
                {user ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">{user.name}</p>
                            <p className="text-xs text-purple-300 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-purple-300 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Link to="/login" className="block w-full text-center py-2.5 text-sm text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/20">
                            Login
                        </Link>
                        <Link to="/signup" className="block w-full text-center py-2.5 text-sm bg-gradient-to-r from-royal-600 to-purple-600 text-white rounded-xl hover:shadow-md hover:shadow-blue-500/25 transition-all font-bold">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
