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

    const InputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none transition-all py-2 rounded-lg px-3 mt-1";
    const LabelClass = "block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider";

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <GravityCard className="p-8 relative overflow-hidden bg-white border-slate-200 shadow-sm">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Study Modules</h1>
                        <p className="text-slate-600 max-w-xl">
                            AI-powered curriculum generation and progress tracking. Master your domain.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:shadow-md transition-all flex items-center gap-2 group"
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
                        <GravityCard className="p-6 border-blue-200 bg-blue-50 shadow-sm mb-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-blue-200 pb-2">Initialize New Module</h3>
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
                                        <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors shadow-sm">
                                            <label className={`${LabelClass} mb-2 flex items-center gap-2`}>
                                                <Sparkles size={14} className="text-purple-600" /> AI Generation (Optional)
                                            </label>
                                            <input
                                                type="file"
                                                accept=".pdf,.png,.jpg"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer"
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
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-wait"
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
                    <GravityCard className="p-12 text-center flex flex-col items-center justify-center border-dashed border-slate-300 bg-white shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No active modules</h3>
                        <p className="text-slate-500 mt-2">Create a study plan to begin tracking your progress.</p>
                    </GravityCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => {
                            const progress = calculateProgress(plan.topics);
                            const isExpanded = expandedPlan === plan._id;

                            return (
                                <GravityCard key={plan._id} className="group hover:-translate-y-1 transition-all duration-300 bg-white border border-slate-200 shadow-sm">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{plan.subject}</h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                                    <Target size={14} className="text-purple-500" />
                                                    Target: {new Date(plan.examDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => deletePlan(plan._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-sm font-bold text-slate-700">{progress}% Complete</span>
                                            <span className="text-xs text-blue-500 font-mono">{plan.topics.filter(t => t.completed).length}/{plan.topics.length} Nodes</span>
                                        </div>
                                        <LiquidProgressBar progress={progress} color="bg-gradient-to-r from-blue-500 to-indigo-500" height="h-3" className="mb-6" />

                                        <button
                                            onClick={() => setExpandedPlan(isExpanded ? null : plan._id)}
                                            className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
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
                                                className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                                            >
                                                <div className="p-6 space-y-2">
                                                    {plan.topics.map((topic, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => toggleTopic(plan._id, index)}
                                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer group/topic transition-all"
                                                        >
                                                            <div className={`mt-0.5 transition-colors ${topic.completed ? 'text-green-500' : 'text-slate-400 group-hover/topic:text-blue-500'}`}>
                                                                {topic.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                                            </div>
                                                            <span className={`text-sm transition-all ${topic.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover/topic:text-slate-900'}`}>
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
