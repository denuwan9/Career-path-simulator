import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Linkedin, Github, Globe, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const ProfileHeader = ({ user, onEdit }) => {
    // Calculate completion (mock or real logic)
    const completeness = 85;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 relative overflow-hidden rounded-3xl bg-glass-200 border border-white/10 shadow-antigravity-lg backdrop-blur-2xl mb-6"
        >
            {/* Banner Background */}
            <div className="h-48 bg-gradient-to-r from-royal-900 to-purple-900 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
            </div>

            <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-16 gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-br from-cyan-400 to-purple-600 z-10">
                        <img
                            src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover border-4 border-[#0f172a] bg-[#0f172a]"
                        />
                    </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center md:text-left mb-2">
                    <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">{user.name}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                        <span className="text-blue-200 font-medium px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                            {user.careerField || "Aspiring Professional"}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                            <MapPin size={14} /> {user.address || "Location not set"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mb-4 md:mb-2">
                    <div className="hidden md:block text-right mr-4">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Profile Strength</p>
                        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden ml-auto">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completeness}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-royal-600 to-purple-600 hover:from-royal-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 border border-white/10"
                    >
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                    </button>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
                        <ExternalLink size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const AboutCard = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-4 rounded-3xl bg-glass-100 border border-white/10 p-6 flex flex-col justify-between shadow-antigravity-sm hover:shadow-antigravity-md transition-shadow"
        >
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><UserIcon size={18} /></span>
                    About Me
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm mb-6 font-light">
                    {user.bio || "No bio added yet. Tell us about yourself!"}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg bg-white/5 border border-white/5">
                    <MapPin size={16} className="text-purple-400" />
                    <span>{user.address || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg bg-white/5 border border-white/5">
                    <Mail size={16} className="text-pink-400" />
                    <span className="truncate">{user.email}</span>
                </div>
                {user.contactNumber && (
                    <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg bg-white/5 border border-white/5">
                        <Phone size={16} className="text-green-400" />
                        <span>{user.contactNumber}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Helper icon component
const UserIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
