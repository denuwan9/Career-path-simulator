import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, BookOpen, Layers, Save, Plus, Trash2 } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState(userData);

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'skills', label: 'Skills', icon: Layers },
        { id: 'education', label: 'Education', icon: BookOpen },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: Layers },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Generic Array Handlers
    const handleArrayChange = (index, field, key, value) => {
        const newArray = [...formData[field]];
        if (key) {
            newArray[index] = { ...newArray[index], [key]: value };
        } else {
            newArray[index] = value; // For simple arrays like softSkills
        }
        setFormData({ ...formData, [field]: newArray });
    };

    const addItem = (field, template) => {
        setFormData({ ...formData, [field]: [...formData[field], template] });
    };

    const removeItem = (field, index) => {
        setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
    };

    // Handle Tech Skills (Special Case: Object {name, level})
    // If backend returns strings, we convert to objects for editing, or handle mixed types.
    // For this implementation, we assume we updated backend to accept objects, 
    // but if it's still strings, we handle graceful degradation.

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0f172a] border border-white/10 w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-glass-100">
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-900/50 border-r border-white/5 p-4 space-y-2 overflow-y-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto bg-[#0f172a]">

                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6 max-w-3xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                    <InputGroup label="Career Title" name="careerField" value={formData.careerField} onChange={handleChange} />
                                    <InputGroup label="Email" name="email" value={formData.email} onChange={handleChange} />
                                    <InputGroup label="Phone" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                    <InputGroup label="Address" name="address" value={formData.address} onChange={handleChange} />
                                    <InputGroup label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
                                </div>
                                <InputGroup label="Profile Image URL" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://..." />
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Short Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32 resize-none"
                                    />
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputGroup label="LinkedIn" name="socialLinks.linkedin" value={formData.socialLinks?.linkedin || ''} onChange={handleChange} />
                                        <InputGroup label="GitHub" name="socialLinks.github" value={formData.socialLinks?.github || ''} onChange={handleChange} />
                                        <InputGroup label="Portfolio" name="socialLinks.portfolio" value={formData.socialLinks?.portfolio || ''} onChange={handleChange} />
                                        <InputGroup label="Website" name="socialLinks.website" value={formData.socialLinks?.website || ''} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills Tab */}
                        {activeTab === 'skills' && (
                            <div className="space-y-8">
                                {/* Tech Skills */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-white">Technical Skills</h3>
                                        <button onClick={() => addItem('skills', { name: '', level: 80 })} className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">+ Add Skill</button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="flex gap-4 items-center bg-slate-800/30 p-3 rounded-xl border border-white/5">
                                                <input
                                                    value={typeof skill === 'string' ? skill : skill.name}
                                                    onChange={(e) => handleArrayChange(index, 'skills', typeof skill === 'string' ? null : 'name', e.target.value)}
                                                    placeholder="Skill Name (e.g. React)"
                                                    className="bg-transparent border-b border-white/10 text-white px-2 py-1 flex-1 focus:border-blue-500 outline-none"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">Level:</span>
                                                    <input
                                                        type="number"
                                                        value={typeof skill === 'string' ? 80 : skill.level}
                                                        onChange={(e) => handleArrayChange(index, 'skills', 'level', parseInt(e.target.value))}
                                                        className="bg-slate-900 border border-white/10 rounded w-16 px-2 py-1 text-white text-sm"
                                                        min="0" max="100"
                                                    />
                                                </div>
                                                <button onClick={() => removeItem('skills', index)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-white">Languages</h3>
                                        <button onClick={() => addItem('languages', { name: '', proficiency: 'Basic' })} className="text-sm bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-500/30 transition-colors">+ Add Language</button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.languages.map((lang, index) => (
                                            <div key={index} className="flex gap-4 items-center bg-slate-800/30 p-3 rounded-xl border border-white/5">
                                                <input
                                                    value={lang.name}
                                                    onChange={(e) => handleArrayChange(index, 'languages', 'name', e.target.value)}
                                                    placeholder="Language"
                                                    className="bg-transparent border-b border-white/10 text-white px-2 py-1 flex-1 focus:border-green-500 outline-none"
                                                />
                                                <select
                                                    value={lang.proficiency}
                                                    onChange={(e) => handleArrayChange(index, 'languages', 'proficiency', e.target.value)}
                                                    className="bg-slate-900 border border-white/10 rounded px-3 py-1.5 text-white text-sm outline-none"
                                                >
                                                    <option>Basic</option>
                                                    <option>Fluent</option>
                                                    <option>Native</option>
                                                </select>
                                                <button onClick={() => removeItem('languages', index)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Education Tab */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button onClick={() => addItem('education', { institution: '', degree: '', year: '', gpa: '', description: '' })} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors">
                                        <Plus size={18} /> Add Education
                                    </button>
                                </div>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 relative group">
                                        <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <InputGroup label="Institution" value={edu.institution} onChange={(e) => handleArrayChange(index, 'education', 'institution', e.target.value)} />
                                            <InputGroup label="Degree" value={edu.degree} onChange={(e) => handleArrayChange(index, 'education', 'degree', e.target.value)} />
                                            <InputGroup label="Year Range" value={edu.year} onChange={(e) => handleArrayChange(index, 'education', 'year', e.target.value)} />
                                            <InputGroup label="GPA" value={edu.gpa} onChange={(e) => handleArrayChange(index, 'education', 'gpa', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                                            <textarea
                                                value={edu.description}
                                                onChange={(e) => handleArrayChange(index, 'education', 'description', e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-20 resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button onClick={() => addItem('projects', { title: '', description: '', image: '', tags: [], githubLink: '', demoLink: '' })} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-500 transition-colors">
                                        <Plus size={18} /> Add Project
                                    </button>
                                </div>
                                {formData.projects.map((proj, index) => (
                                    <div key={index} className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 relative group">
                                        <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <InputGroup label="Project Title" value={proj.title} onChange={(e) => handleArrayChange(index, 'projects', 'title', e.target.value)} />
                                            <InputGroup label="Thumbnail URL" value={proj.image} onChange={(e) => handleArrayChange(index, 'projects', 'image', e.target.value)} />
                                            <InputGroup label="GitHub Link" value={proj.githubLink} onChange={(e) => handleArrayChange(index, 'projects', 'githubLink', e.target.value)} />
                                            <InputGroup label="Demo Link" value={proj.demoLink} onChange={(e) => handleArrayChange(index, 'projects', 'demoLink', e.target.value)} />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm text-slate-400 mb-1">Tech Stack (comma separated)</label>
                                            <input
                                                value={Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags}
                                                onChange={(e) => handleArrayChange(index, 'projects', 'tags', e.target.value.split(',').map(t => t.trim()))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                                            <textarea
                                                value={proj.description}
                                                onChange={(e) => handleArrayChange(index, 'projects', 'description', e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none h-20 resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Experience Tab */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '', logo: '' })} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors">
                                        <Plus size={18} /> Add Experience
                                    </button>
                                </div>
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 relative group">
                                        <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <InputGroup label="Company" value={exp.company} onChange={(e) => handleArrayChange(index, 'experience', 'company', e.target.value)} />
                                            <InputGroup label="Role" value={exp.role} onChange={(e) => handleArrayChange(index, 'experience', 'role', e.target.value)} />
                                            <InputGroup label="Duration" value={exp.duration} onChange={(e) => handleArrayChange(index, 'experience', 'duration', e.target.value)} />
                                            <InputGroup label="Logo URL" value={exp.logo} onChange={(e) => handleArrayChange(index, 'experience', 'logo', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => handleArrayChange(index, 'experience', 'description', e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none h-24 resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-glass-100 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium hover:bg-white/5 transition-colors">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-900/40 hover:from-royal-500 hover:to-purple-500 transition-all flex items-center gap-2"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div>
        <label className="block text-sm text-slate-400 mb-1 ml-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none focus:bg-slate-800 transition-colors"
        />
    </div>
);

export default EditProfileModal;
