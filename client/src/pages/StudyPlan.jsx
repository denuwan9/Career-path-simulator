import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, CheckSquare, Square, Plus, Trash2, ChevronDown, ChevronUp, Target, Clock, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GravityCard from '../components/GravityCard';
import LiquidProgressBar from '../components/LiquidProgressBar';

const StudyPlan = () => {
    const authContext = useContext(AuthContext);
    const authUser = authContext?.user || null;

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [file, setFile] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        examDate: '',
        topics: ''
    });

    const userEmail = authUser?.email || 'student@example.com';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get(`http://localhost:5000/api/users/profile/${userEmail}`);
                setUser(userRes.data);

                if (userRes.data._id) {
                    const savedPlans = await axios.get(`http://localhost:5000/api/study-plans/${userRes.data._id}`);
                    setPlans(savedPlans.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        let topicsArray = [];

        if (file) {
            setAiLoading(true);
            try {
                const data = new FormData();
                data.append('file', file);

                // Call AI endpoint
                const aiRes = await axios.post('http://localhost:5000/api/ai/generate-plan', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                topicsArray = aiRes.data.topics || [];
            } catch (err) {
                console.error("AI Generation Failed", err);
                alert("Failed to generate plan from AI. Please try manual entry.");
                setAiLoading(false);
                return;
            }
            setAiLoading(false);
        } else {
            topicsArray = formData.topics.split(',').map(t => ({ name: t.trim(), completed: false })).filter(t => t.name);
        }

        try {
            const res = await axios.post('http://localhost:5000/api/study-plans', {
                ...formData,
                topics: topicsArray,
                user: user._id
            });
            setPlans([...plans, res.data]);
            setShowForm(false);
            setFormData({ subject: '', examDate: '', topics: '' });
            setFile(null);
        } catch (err) {
            console.error('Error creating plan:', err);
        }
    };

    const toggleTopic = async (planId, topicIndex) => {
        const plan = plans.find(p => p._id === planId);
        const updatedTopics = [...plan.topics];
        updatedTopics[topicIndex].completed = !updatedTopics[topicIndex].completed;

        try {
            await axios.put(`http://localhost:5000/api/study-plans/${planId}`, { topics: updatedTopics });
            setPlans(plans.map(p => p._id === planId ? { ...p, topics: updatedTopics } : p));
        } catch (err) {
            console.error('Error updating topic:', err);
        }
    };

    const deletePlan = async (planId) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/study-plans/${planId}`);
            setPlans(plans.filter(p => p._id !== planId));
        } catch (err) {
            console.error('Error deleting plan:', err);
        }
    };

    const calculateProgress = (topics) => {
        if (!topics || topics.length === 0) return 0;
        const completed = topics.filter(t => t.completed).length;
        return Math.round((completed / topics.length) * 100);
    };

    const InputClass = "w-full bg-transparent border-b border-white/20 text-white placeholder-blue-300/50 focus:border-blue-400 outline-none transition-all py-2";
    const LabelClass = "block text-xs font-bold text-blue-300 mb-1 uppercase tracking-wider";

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <GravityCard className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Study Modules</h1>
                        <p className="text-blue-200/80 max-w-xl">
                            AI-powered curriculum generation and progress tracking. Master your domain.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-gradient-to-r from-royal-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Study Module
                    </button>
                </div>
            </GravityCard>

            {/* Create Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <GravityCard className="p-6 border-blue-500/30 bg-blue-900/10 mb-8">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Initialize New Module</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className={LabelClass}>Subject Name</label>
                                            <input
                                                className={InputClass}
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="e.g. Data Structures"
                                                required={!file}
                                            />
                                        </div>
                                        <div>
                                            <label className={LabelClass}>Target Date</label>
                                            <input
                                                type="date"
                                                className={InputClass}
                                                value={formData.examDate}
                                                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors">
                                            <label className={`${LabelClass} mb-2 flex items-center gap-2`}>
                                                <Sparkles size={14} className="text-purple-400" /> AI Generation (Optional)
                                            </label>
                                            <input
                                                type="file"
                                                accept=".pdf,.png,.jpg"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30 transition-all cursor-pointer"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Upload syllabus PDF to auto-generate topics.</p>
                                        </div>

                                        <div>
                                            <label className={LabelClass}>Or Manual Topics</label>
                                            <textarea
                                                className={`${InputClass} h-20 resize-none`}
                                                value={formData.topics}
                                                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                                                placeholder="Comma separated topics (e.g. Arrays, Linked Lists, Trees)"
                                                disabled={!!file}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={aiLoading}
                                        className="px-8 py-3 bg-gradient-to-r from-royal-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {aiLoading ? 'Analyzing Syllabus...' : 'Create Module'}
                                    </button>
                                </div>
                            </form>
                        </GravityCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Plans List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                ) : plans.length === 0 ? (
                    <GravityCard className="p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="text-slate-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">No active modules</h3>
                        <p className="text-slate-400 mt-2">Create a study plan to begin tracking your progress.</p>
                    </GravityCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => {
                            const progress = calculateProgress(plan.topics);
                            const isExpanded = expandedPlan === plan._id;

                            return (
                                <GravityCard key={plan._id} className="group hover:shadow-antigravity-hover transition-all duration-500">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{plan.subject}</h3>
                                                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                                                    <Target size={14} className="text-purple-400" />
                                                    Target: {new Date(plan.examDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => deletePlan(plan._id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-sm font-bold text-slate-400">{progress}% Complete</span>
                                            <span className="text-xs text-blue-400 font-mono">{plan.topics.filter(t => t.completed).length}/{plan.topics.length} Nodes</span>
                                        </div>
                                        <LiquidProgressBar progress={progress} color="bg-gradient-to-r from-blue-500 to-purple-500" height="h-3" className="mb-6" />

                                        <button
                                            onClick={() => setExpandedPlan(isExpanded ? null : plan._id)}
                                            className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            {isExpanded ? 'Collapse Module' : 'Expand Module'}
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden border-t border-white/5 bg-black/20"
                                            >
                                                <div className="p-6 space-y-2">
                                                    {plan.topics.map((topic, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => toggleTopic(plan._id, index)}
                                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group/topic transition-colors"
                                                        >
                                                            <div className={`mt-0.5 transition-colors ${topic.completed ? 'text-green-400' : 'text-slate-600 group-hover/topic:text-blue-400'}`}>
                                                                {topic.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                                            </div>
                                                            <span className={`text-sm transition-all ${topic.completed ? 'text-slate-500 line-through' : 'text-slate-300 group-hover/topic:text-white'}`}>
                                                                {topic.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </GravityCard>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPlan;
