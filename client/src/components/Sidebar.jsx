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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 text-slate-900 flex flex-col z-50">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-royal-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="font-bold text-white text-lg">CH</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent block leading-tight">
                            CareerHelp
                        </span>
                        <span className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">SLIIT University</span>
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
                                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                            }`}
                    >
                        <link.icon size={20} className={`${isActive(link.path) ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}`} />
                        <span className="font-medium relative z-10">{link.name}</span>
                        {isActive(link.path) && (
                            <motion.div
                                layoutId="active-glow"
                                className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 blur-xl px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                {user ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Link to="/login" className="block w-full text-center py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
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
