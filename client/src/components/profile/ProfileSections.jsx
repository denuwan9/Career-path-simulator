import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Globe, ExternalLink, Github, Layers } from 'lucide-react';

export const SkillsCard = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-4 rounded-3xl bg-glass-100 border border-white/10 p-6 shadow-antigravity-sm hover:shadow-antigravity-md transition-shadow relative overflow-hidden"
        >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"><Cpu size={18} /></span>
                Skills & Expertise
            </h3>

            {/* Technical Skills */}
            <div className="mb-6">
                <h4 className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest mb-3">Technical</h4>
                <div className="space-y-4">
                    {user.skills?.map((skill, index) => (
                        <div key={index} className="group">
                            <div className="flex justify-between text-sm text-slate-300 mb-1 group-hover:text-white transition-colors">
                                <span>{typeof skill === 'string' ? skill : skill.name}</span>
                                <span className="text-blue-400 text-xs">{typeof skill === 'string' ? '80%' : `${skill.level}%`}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: typeof skill === 'string' ? '80%' : `${skill.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-shadow"
                                />
                            </div>
                        </div>
                    ))}
                    {(!user.skills || user.skills.length === 0) && <p className="text-slate-500 text-sm italic">No skills added</p>}
                </div>
            </div>

            {/* Languages & Soft Skills */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest mb-2">Languages & Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {user.languages?.map((lang, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                            {lang.name}
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span className="opacity-60 text-[10px]">{lang.proficiency}</span>
                        </span>
                    ))}
                    {user.softSkills?.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export const ProjectsGrid = ({ projects }) => {
    return (
        <div className="col-span-12 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400"><Layers size={18} /></span>
                Featured Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group bg-glass-100 border border-white/10 rounded-2xl overflow-hidden shadow-antigravity-sm hover:shadow-antigravity-hover transition-all"
                    >
                        {/* Thumbnail */}
                        <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                    <Code size={32} />
                                </div>
                            )}
                            {/* Overlay Links */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                {project.githubLink && (
                                    <a href={project.githubLink} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><Github size={18} /></a>
                                )}
                                {project.demoLink && (
                                    <a href={project.demoLink} className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-colors"><ExternalLink size={18} /></a>
                                )}
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-blue-300 transition-colors">{project.title}</h4>
                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-1.5">
                                {project.tags?.map((tag, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                        No projects showcased yet.
                    </div>
                )}
            </div>
        </div>
    );
};
