import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const InputClass = "w-full pl-10 pr-4 py-3 bg-transparent border-b border-white/20 text-white placeholder-blue-300/50 focus:border-blue-400 outline-none transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-glass-100 backdrop-blur-xl rounded-3xl shadow-antigravity-hover w-full max-w-md overflow-hidden border border-white/10 relative z-20"
            >
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>

                <div className="p-8 text-center bg-gradient-to-r from-royal-600/80 to-purple-600/80 text-white border-b border-white/10 relative z-10">
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Join Antigravity</h2>
                    <p className="text-blue-100 font-light">Launch your professional future today</p>
                </div>

                <div className="p-8 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 text-red-300 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/20 shadow-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-blue-200 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={InputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-blue-200 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={InputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-blue-200 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={InputClass}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-royal-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group mt-4 hover:scale-[1.02]"
                        >
                            Initiate Launch <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
