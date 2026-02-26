import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Globe, ExternalLink, Github, Layers } from 'lucide-react';

export const SkillsCard = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><Cpu size={18} /></span>
                Skills & Expertise
            </h3>

            {/* Technical Skills */}
            <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Technical</h4>
                <div className="space-y-4">
                    {user.skills?.map((skill, index) => (
                        <div key={index} className="group">
                            <div className="flex justify-between text-sm text-slate-600 mb-1 group-hover:text-slate-900 transition-colors">
                                <span>{typeof skill === 'string' ? skill : skill.name}</span>
                                <span className="text-blue-600 font-medium text-xs">{typeof skill === 'string' ? '80%' : `${skill.level}%`}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: typeof skill === 'string' ? '80%' : `${skill.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm transition-shadow"
                                />
                            </div>
                        </div>
                    ))}
                    {(!user.skills || user.skills.length === 0) && <p className="text-slate-400 text-sm italic">No skills added</p>}
                </div>
            </div>

            {/* Languages & Soft Skills */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Languages & Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {user.languages?.map((lang, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            {lang.name}
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span className="opacity-80 text-[10px]">{lang.proficiency}</span>
                        </span>
                    ))}
                    {user.softSkills?.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
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
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600"><Layers size={18} /></span>
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
                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                    >
                        {/* Thumbnail */}
                        <div className="h-32 bg-slate-100 relative overflow-hidden">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <Code size={32} />
                                </div>
                            )}
                            {/* Overlay Links */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                {project.githubLink && (
                                    <a href={project.githubLink} className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"><Github size={18} /></a>
                                )}
                                {project.demoLink && (
                                    <a href={project.demoLink} className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white transition-colors"><ExternalLink size={18} /></a>
                                )}
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                            <p className="text-slate-500 text-sm mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-1.5">
                                {project.tags?.map((tag, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-slate-300 bg-white rounded-2xl">
                        No projects showcased yet.
                    </div>
                )}
            </div>
        </div>
    );
};
