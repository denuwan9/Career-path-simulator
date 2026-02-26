import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Building, Clock, Search, Filter, ArrowUpRight, User, Plus, X, Globe, Linkedin, Github } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GravityCard from '../components/GravityCard';

const Jobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [viewMode, setViewMode] = useState('jobs'); // 'jobs' or 'talent'
    const [showPostModal, setShowPostModal] = useState(false);

    // Post Form Data
    const [postData, setPostData] = useState({
        title: '', // Job Title or "Aspiring X"
        description: '', // Bio or Job Desc
        type: 'Full-time',
        location: '',
        requirements: '', // Comma separated
        company: '', // For jobs
        applicationLink: '', // For jobs

        // Student specific handled by auto-fill mostly but editable
        skills: '',
        education: '',
        experience: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data);
                setFilteredJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let results = jobs;

        // Filter by View Mode
        if (viewMode === 'jobs') {
            results = results.filter(j => !j.isStudentPost);
        } else {
            results = results.filter(j => j.isStudentPost);
        }

        // Filter by Search
        results = results.filter(job => {
            const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.studentName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterType === 'All' || job.type === filterType;
            return matchesSearch && matchesFilter;
        });

        setFilteredJobs(results);
    }, [searchTerm, filterType, jobs, viewMode]);

    const openPostModal = async () => {
        if (!user) {
            alert("Please login to post.");
            return;
        }

        // Auto-fill for students
        if (viewMode === 'talent') {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/profile/${user.email}`);
                const p = res.data;
                setPostData({
                    title: p.careerField || '',
                    description: p.bio || '',
                    type: 'Full-time',
                    location: p.address || '',
                    requirements: '',
                    skills: p.skills?.join(', ') || '',
                    education: p.education?.[0]?.degree || '',
                    experience: p.experience?.[0]?.role || '',
                    isStudent: true
                });
            } catch (e) {
                console.error("Failed to fetch profile for auto-fill", e);
            }
        } else {
            setPostData({
                title: '', description: '', type: 'Full-time', location: '', requirements: '', company: '', applicationLink: '', isStudent: false
            });
        }
        setShowPostModal(true);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = 'http://localhost:5000/api/jobs';
            const payload = { ...postData, postedBy: user._id, studentName: user.name, studentEmail: user.email };

            if (viewMode === 'talent') {
                payload.isStudentPost = true;
            }

            const res = await axios.post(endpoint, payload);
            setJobs([...jobs, res.data]);
            setShowPostModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to post.");
        }
    };

    const InputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none transition-all py-2 rounded-lg px-3 mt-1";
    const LabelClass = "block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider";

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <GravityCard className="p-8 relative overflow-hidden bg-white border-slate-200">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-100 rounded-full blur-3xl animate-float"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Career Nexus</h1>
                        <p className="text-slate-600 max-w-xl">
                            Discover opportunities or showcase your talent. The future is yours to shape.
                        </p>
                    </div>
                </div>
            </GravityCard>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center sticky top-4 z-30">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
                    <button
                        onClick={() => setViewMode('jobs')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'jobs' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Find Jobs
                    </button>
                    <button
                        onClick={() => setViewMode('talent')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'talent' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Find Talent
                    </button>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={viewMode === 'jobs' ? "Search roles, companies..." : "Search talent..."}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={openPostModal}
                        className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={20} /> {viewMode === 'jobs' ? 'Post Job' : 'Post Profile'}
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                ) : filteredJobs.length === 0 ? (
                    <GravityCard className="col-span-full p-12 text-center flex flex-col items-center justify-center border-dashed border-slate-300 bg-white shadow-sm">
                        <Briefcase className="text-slate-400 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-900">No listings found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    </GravityCard>
                ) : (
                    filteredJobs.map((job) => (
                        <GravityCard key={job._id} className="group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full bg-white border-slate-200 shadow-sm">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-700 mb-4">
                                        {job.company ? job.company[0] : <User />}
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600">
                                        {job.type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                                    {job.company || job.studentName}
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin size={14} className="text-blue-500" /> {job.location}
                                    </div>
                                    {job.isStudentPost && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {job.skills?.split(',').slice(0, 3).map((skill, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {!job.isStudentPost ? (
                                    <a
                                        href={job.applicationLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-auto w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-slate-900 font-bold transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Apply Now <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = `mailto:${job.studentEmail}`}
                                        className="mt-auto w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:shadow-md transition-all hover:bg-blue-700"
                                    >
                                        Contact Talent
                                    </button>
                                )}
                            </div>
                        </GravityCard>
                    ))
                )}
            </div>

            {/* Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPostModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-center z-10">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {viewMode === 'jobs' ? 'Post a Job Opportunity' : 'Create Talent Profile'}
                                </h2>
                                <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
                            </div>

                            <form onSubmit={handlePostSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={LabelClass}>Title / Role</label>
                                        <input
                                            className={InputClass}
                                            value={postData.title}
                                            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                                            placeholder={viewMode === 'jobs' ? "e.g. Senior React Developer" : "e.g. Aspiring Full Stack Dev"}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={LabelClass}>Company / Name</label>
                                        <input
                                            className={InputClass}
                                            value={viewMode === 'jobs' ? postData.company : user.name}
                                            onChange={(e) => setPostData({ ...postData, company: e.target.value })}
                                            disabled={viewMode === 'talent'}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LabelClass}>Description / Bio</label>
                                    <textarea
                                        className={`${InputClass} h-32 resize-none`}
                                        value={postData.description}
                                        onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                                        placeholder="Tell us about the role or yourself..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={LabelClass}>Location</label>
                                        <input
                                            className={InputClass}
                                            value={postData.location}
                                            onChange={(e) => setPostData({ ...postData, location: e.target.value })}
                                            placeholder="e.g. Remote, San Francisco"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={LabelClass}>Type</label>
                                        <select
                                            className={`${InputClass} bg-slate-50`}
                                            value={postData.type}
                                            onChange={(e) => setPostData({ ...postData, type: e.target.value })}
                                        >
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>
                                </div>

                                {viewMode === 'jobs' ? (
                                    <>
                                        <div>
                                            <label className={LabelClass}>Requirements</label>
                                            <textarea
                                                className={`${InputClass} h-24 resize-none`}
                                                value={postData.requirements}
                                                onChange={(e) => setPostData({ ...postData, requirements: e.target.value })}
                                                placeholder="Comma separated list of requirements..."
                                            />
                                        </div>
                                        <div>
                                            <label className={LabelClass}>Application Link</label>
                                            <input
                                                className={InputClass}
                                                value={postData.applicationLink}
                                                onChange={(e) => setPostData({ ...postData, applicationLink: e.target.value })}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className={LabelClass}>Skills (Comma Separated)</label>
                                            <input
                                                className={InputClass}
                                                value={postData.skills}
                                                onChange={(e) => setPostData({ ...postData, skills: e.target.value })}
                                                placeholder="e.g. React, Node.js, Python"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="pt-4 border-t border-white/10 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-to-r from-royal-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                    >
                                        {viewMode === 'jobs' ? 'Publish Job' : 'Publish Profile'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Jobs;
