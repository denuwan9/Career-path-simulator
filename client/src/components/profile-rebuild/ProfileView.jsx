import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Ruler, Weight, Activity, Edit2, Share2, MapPin } from 'lucide-react';
import { format } from 'date-fns';


const InfoItem = ({ icon: Icon, label, value, color = "text-slate-400" }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
        <div className={`p-3 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-slate-200 font-semibold">{value || 'Not set'}</p>
        </div>
    </div>
);

const ProfileView = ({ user, onEdit }) => {
    // Calculate BMI
    const calculateBMI = () => {
        if (!user.height || !user.weight) return null;
        const heightInMeters = user.height / 100;
        const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
        return bmi;
    };

    const bmi = calculateBMI();
    const getBMICategory = (bmi) => {
        if (!bmi) return { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-500/20' };
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500/20' };
        if (bmi < 25) return { label: 'Healthy', color: 'text-green-400', bg: 'bg-green-500/20' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    const bmiCategory = getBMICategory(bmi);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto"
        >
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 space-y-6">
                <div className="relative rounded-3xl bg-glass-100 border border-white/10 overflow-hidden shadow-antigravity-lg group">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-royal-600 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-8 relative">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg shadow-purple-500/30">
                                <img
                                    src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-[#0f172a] bg-[#0f172a]"
                                />
                            </div>
                        </div>

                        <div className="mt-20 text-center space-y-2">
                            <h2 className="text-2xl font-bold text-white">{user.name || 'User Name'}</h2>
                            <p className="text-blue-300 font-medium">{user.careerField || 'Career Title'}</p>

                            <div className="flex justify-center gap-2 mt-4">
                                <span className="px-3 py-1 rounded-full bg-slate-800 border border-white/5 text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin size={12} /> {user.address || 'Location N/A'}
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed mt-6 px-2">
                                {user.bio || "No bio added yet."}
                            </p>

                            <button
                                onClick={onEdit}
                                className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-royal-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Completion Progress */}
                <div className="p-6 rounded-3xl bg-glass-100 border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-300">Profile Completion</span>
                        <span className="text-2xl font-bold text-green-400">85%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Details Grid */}
            <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={Mail} label="Email" value={user.email} color="text-blue-400" />
                    <InfoItem icon={Phone} label="Phone" value={user.contactNumber} color="text-green-400" />
                    <InfoItem icon={Calendar} label="Date of Birth" value={user.dateOfBirth ? format(new Date(user.dateOfBirth), 'PPP') : null} color="text-purple-400" />
                    <InfoItem icon={User} label="Gender" value={user.gender} color="text-pink-400" />
                    <InfoItem icon={Ruler} label="Height" value={user.height ? `${user.height} cm` : null} color="text-orange-400" />
                    <InfoItem icon={Weight} label="Weight" value={user.weight ? `${user.weight} kg` : null} color="text-cyan-400" />
                </div>

                {/* Health Metrics Card */}
                {bmi && (
                    <div className="p-8 rounded-3xl bg-glass-100 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="text-red-400" /> Health Metrics
                        </h3>

                        <div className="flex items-center gap-8">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * (Math.min(bmi, 40) / 40))} className={`transition-all duration-1000 ${bmiCategory.color}`} />
                                </svg>
                                <div className="absolute text-center">
                                    <span className="text-3xl font-bold text-white block">{bmi}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">BMI</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm mb-1">Your BMI Category</p>
                                <p className={`text-2xl font-bold ${bmiCategory.color}`}>{bmiCategory.label}</p>
                                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                                    Body Mass Index is a simple calculation using a person's height and weight. The formula is BMI = kg/m².
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileView;
