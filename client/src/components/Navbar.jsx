import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Calendar, BookOpen, Briefcase, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const links = [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Interviews', path: '/interviews', icon: Calendar },
        { name: 'Study Plan', path: '/study-plan', icon: BookOpen },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        CareerPath
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {user ? (
                            <>
                                {links.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600 
                                            ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-600'}`}
                                    >
                                        <link.icon size={18} />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                                <div className="border-l pl-6 ml-2 flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-900">Hi, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">Login</Link>
                                <Link to="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {user ? (
                                <>
                                    {links.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium 
                                                ${location.pathname === link.path
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <link.icon size={20} />
                                            <span>{link.name}</span>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-2 border-t mt-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
