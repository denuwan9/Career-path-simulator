import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BookOpen, Briefcase, User, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import GravityCard from '../components/GravityCard';
import LiquidProgressBar from '../components/LiquidProgressBar';
import PulsingOrbital from '../components/PulsingOrbital';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        bookings: 0,
        studyPlans: 0,
        profileComplete: 0
    });
    const [loading, setLoading] = useState(true);
    const [upcomingInterview, setUpcomingInterview] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.email) return;

            try {
                // 1. Get User Details for ID
                const userRes = await axios.get(`http://localhost:5000/api/users/profile/${user.email}`);
                const userId = userRes.data._id;

                // Calculate Profile Completeness (mock logic for demo)
                const fields = ['name', 'email', 'contactNumber', 'address', 'bio', 'skills', 'experience', 'education'];
                const filled = fields.filter(f => userRes.data[f] && (Array.isArray(userRes.data[f]) ? userRes.data[f].length > 0 : true));
                const completeness = Math.round((filled.length / fields.length) * 100);

                // 2. Get Interview Bookings
                let bookingsCount = 0;
                if (userId) {
                    try {
                        const bookingsRes = await axios.get(`http://localhost:5000/api/interviews/slots/student/${userId}`);
                        bookingsCount = bookingsRes.data.length;
                        // Find upcoming
                        const sorted = bookingsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                        const future = sorted.find(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0));
                        setUpcomingInterview(future);
                    } catch (e) {
                        console.warn("Could not fetch bookings", e);
                    }
                }

                // 3. Get Study Plans
                let plansCount = 0;
                if (userId) {
                    try {
                        const plansRes = await axios.get(`http://localhost:5000/api/study-plans/${userId}`);
                        plansCount = plansRes.data.length;
                    } catch (e) {
                        console.warn("Could not fetch study plans", e);
                    }
                }

                setStats({
                    bookings: bookingsCount,
                    studyPlans: plansCount,
                    profileComplete: completeness
                });

            } catch (err) {
                console.error('Error loading dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 relative z-10">
            {/* Welcome Section - Highest Z-Depth */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-royal-600 to-purple-600 rounded-3xl p-8 text-white shadow-antigravity-hover relative overflow-hidden z-20"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl font-light">
                        Ready to make progress today? Your career orbit is looking stable.
                    </p>

                    {!user && (
                        <div className="mt-6 flex gap-3">
                            <Link to="/login" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all shadow-lg">Login</Link>
                            <Link to="/signup" className="px-6 py-3 bg-white text-royal-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105">Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-40 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
            </motion.div>

            {/* Stats Grid - Floating Depth */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={item}>
                    <GravityCard id="stat-bookings" className="h-36 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 font-medium text-sm">Interviews</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.bookings}/2</h3>
                            </div>
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-200 transition-colors">
                                <Calendar size={22} />
                            </div>
                        </div>
                        <LiquidProgressBar progress={(stats.bookings / 2) * 100} color="bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </GravityCard>
                </motion.div>

                <motion.div variants={item}>
                    <GravityCard id="stat-plans" className="h-36 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 font-medium text-sm">Study Plans</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.studyPlans}</h3>
                            </div>
                            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-200 transition-colors">
                                <BookOpen size={22} />
                            </div>
                        </div>
                        <p className="text-xs text-green-700 flex items-center gap-1 mt-auto bg-green-100 px-2 py-1 rounded w-fit">
                            <TrendingUp size={14} /> Active
                        </p>
                    </GravityCard>
                </motion.div>

                <motion.div variants={item}>
                    <GravityCard id="stat-profile" className="h-36 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 font-medium text-sm">Profile Status</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.profileComplete}%</h3>
                            </div>
                            <div className="p-2.5 bg-royal-100 text-royal-600 rounded-xl group-hover:bg-royal-200 transition-colors">
                                <User size={22} />
                            </div>
                        </div>
                        <LiquidProgressBar progress={stats.profileComplete} color="bg-gradient-to-r from-royal-500 to-purple-500" />
                    </GravityCard>
                </motion.div>

                <motion.div variants={item}>
                    <GravityCard id="stat-jobs" className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 h-36 flex flex-col justify-between group hover:border-blue-300">
                        <div>
                            <p className="text-slate-600 font-medium text-sm">New Opportunities</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">12+</h3>
                        </div>
                        <Link to="/jobs" className="text-slate-900 text-sm font-medium flex items-center gap-2 mt-auto bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 transition-all w-fit shadow-sm">
                            View Openings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </GravityCard>
                </motion.div>
            </motion.div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Actions & Upcoming */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Next Up Card */}
                    {upcomingInterview ? (
                        <GravityCard id="upcoming-interview" className="p-0 overflow-hidden group border-slate-200">
                            <div className="p-6 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Clock className="text-blue-600" size={20} /> Antigravity Schedule
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold border border-blue-200 shadow-sm animate-pulse">LIVE</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="text-center md:text-left min-w-[100px] bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <p className="text-4xl font-bold text-slate-900 tracking-widest">{new Date(upcomingInterview.date).getDate()}</p>
                                        <p className="text-blue-600 uppercase text-xs font-bold tracking-widest">{new Date(upcomingInterview.date).toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-1">
                                        <h4 className="text-2xl font-bold text-slate-900">{upcomingInterview.company}</h4>
                                        <p className="text-blue-600 font-medium text-lg">{upcomingInterview.position}</p>
                                        <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {upcomingInterview.startTime} - {upcomingInterview.endTime}
                                        </p>
                                    </div>
                                    <Link to="/interviews" className="px-5 py-2.5 bg-royal-600 text-white rounded-xl hover:bg-royal-500 text-sm font-bold shadow-lg shadow-blue-900/10 transition-all hover:scale-105">
                                        Join Room
                                    </Link>
                                </div>
                            </div>
                        </GravityCard>
                    ) : (
                        <GravityCard id="empty-upcoming" className="p-10 text-center flex flex-col items-center justify-center relative overflow-hidden group bg-white border-slate-200">
                            {/* Pulsing Orbital for Empty State */}
                            <div className="mb-6 relative z-10 group-hover:scale-110 transition-transform duration-700">
                                <PulsingOrbital size="w-24 h-24" color="bg-blue-500" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 relative z-10">Orbit Clear</h3>
                            <p className="text-slate-500 mt-2 mb-6 max-w-sm relative z-10">No upcoming interviews detected in your trajectory. Schedule a slot to engage boosters.</p>

                            <Link to="/interviews" className="relative z-10 px-8 py-3 bg-white border border-slate-200 text-blue-600 rounded-xl hover:bg-slate-50 font-bold hover:text-blue-700 transition-all shadow-sm group-hover:border-blue-200">
                                Initialize Schedule
                            </Link>

                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-radial-at-c from-blue-50 to-transparent flex-shrink-0 transition-opacity duration-1000"></div>
                        </GravityCard>
                    )}

                    {/* Modules Grid */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 ml-1 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Command Center
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Skill Vector', desc: 'Calibrate technical skills', icon: User, color: 'text-blue-600', bg: 'bg-blue-50', border: 'group-hover:border-blue-200', link: '/profile' },
                                { title: 'Study Module', desc: 'Exam readiness status', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', border: 'group-hover:border-purple-200', link: '/study-plan' },
                                { title: 'Career Radar', desc: 'Scan for opportunities', icon: Briefcase, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'group-hover:border-cyan-200', link: '/jobs' },
                                { title: 'Time Warp', desc: 'Manage temporal slots', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'group-hover:border-indigo-200', link: '/interviews' },
                            ].map((module, i) => (
                                <Link to={module.link} key={i}>
                                    <GravityCard id={`module-${i}`} className={`flex items-center gap-5 p-5 h-full bg-white group hover:bg-slate-50 transition-all border-slate-200 ${module.border}`}>
                                        <div className={`w-14 h-14 rounded-2xl ${module.bg} ${module.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]`}>
                                            <module.icon size={26} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{module.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium">{module.desc}</p>
                                        </div>
                                        <div className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-500 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 border border-slate-200">
                                            <ArrowRight size={14} />
                                        </div>
                                    </GravityCard>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Widgets */}
                <div className="space-y-6">
                    {/* Quote Widget */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="text-8xl font-serif text-slate-100 absolute -top-8 -left-4 leading-none">"</span>
                            <p className="font-light text-xl leading-relaxed italic relative z-10 pt-4 text-slate-700">
                                The future belongs to those who orbit the beauty of their dreams.
                            </p>
                            <div className="flex items-center gap-3 mt-6">
                                <div className="w-8 h-px bg-slate-300"></div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Eleanor Roosevelt</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-1000"></div>
                    </div>

                    {/* Progress Widget */}
                    <GravityCard id="progress-widget" className="p-6 bg-white border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                            System Efficiency
                            <span className="text-xs font-mono text-green-700 bg-green-100 px-2 py-1 rounded">OPTIMAL</span>
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-slate-500">Profile Resonance</span>
                                    <span className="text-slate-900">{stats.profileComplete}%</span>
                                </div>
                                <LiquidProgressBar progress={stats.profileComplete} color="bg-gradient-to-r from-royal-500 to-cyan-500" height="h-2.5" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-slate-500">Interview Readiness</span>
                                    <span className="text-slate-900">{Math.min((stats.bookings / 2) * 100, 100)}%</span>
                                </div>
                                <LiquidProgressBar progress={(stats.bookings / 2) * 100} color="bg-gradient-to-r from-purple-500 to-pink-500" height="h-2.5" />
                            </div>
                        </div>
                    </GravityCard>
                </div>
            </div>
        </div>
    );
};

export default Home;
