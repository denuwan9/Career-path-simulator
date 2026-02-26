import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Calendar } from 'lucide-react';

const TimelineItem = ({ title, subtitle, date, description, icon: Icon, color, isLast }) => (
    <div className="relative pl-8 pb-8 group">
        {/* Line */}
        {!isLast && (
            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-white/10 group-hover:bg-gradient-to-b group-hover:from-blue-500 group-hover:to-transparent transition-colors duration-500" />
        )}

        {/* Dot */}
        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,0,0,0.5)] ${color}`}>
            <Icon size={12} className="text-white" />
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-200">{title}</h4>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-black/20 px-2 py-1 rounded">
                    <Calendar size={10} />
                    {date}
                </div>
            </div>
            <p className="text-sm text-blue-300 mb-2 font-medium">{subtitle}</p>
            {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
        </div>
    </div>
);

export const TimelineSection = ({ education, experience }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-4 rounded-3xl bg-glass-100 border border-white/10 p-6 h-fit sticky top-24"
        >
            {/* Education */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400"><BookOpen size={18} /></span>
                    Education
                </h3>
                <div>
                    {education?.map((edu, index) => (
                        <TimelineItem
                            key={index}
                            title={edu.institution}
                            subtitle={edu.degree}
                            date={edu.year}
                            description={edu.description}
                            icon={BookOpen}
                            color="bg-orange-500"
                            isLast={index === education.length - 1}
                        />
                    ))}
                    {(!education || education.length === 0) && <p className="text-slate-500 text-sm pl-8">No education history.</p>}
                </div>
            </div>

            {/* Experience */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><Briefcase size={18} /></span>
                    Experience
                </h3>
                <div>
                    {experience?.map((exp, index) => (
                        <TimelineItem
                            key={index}
                            title={exp.role}
                            subtitle={exp.company}
                            date={exp.duration}
                            description={exp.description}
                            icon={Briefcase}
                            color="bg-emerald-500"
                            isLast={index === experience.length - 1}
                        />
                    ))}
                    {(!experience || experience.length === 0) && <p className="text-slate-500 text-sm pl-8">No experience listed.</p>}
                </div>
            </div>
        </motion.div>
    );
};
