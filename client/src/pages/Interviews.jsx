import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Building2, Users, Plus, Trash2, Edit2, CheckCircle, XCircle, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GravityCard from '../components/GravityCard';
import LiquidProgressBar from '../components/LiquidProgressBar';

const Interviews = () => {
    const authContext = useContext(AuthContext);
    const authUser = authContext?.user || null;

    const [view, setView] = useState('student'); // 'admin' or 'student'
    const [slots, setSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSlotForm, setShowSlotForm] = useState(false);
    const [user, setUser] = useState(null);

    const [slotFormData, setSlotFormData] = useState({
        company: '',
        position: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: 30,
        maxCapacity: 1,
        description: '',
        adminId: ''
    });

    const userEmail = authUser?.email || 'student@example.com';

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userRes = await axios.get(`http://localhost:5000/api/users/profile/${userEmail}`);
            setUser(userRes.data);

            const slotsRes = await axios.get('http://localhost:5000/api/interviews/slots');
            setSlots(slotsRes.data);

            if (view === 'student' && userRes.data._id) {
                const bookingsRes = await axios.get(`http://localhost:5000/api/interviews/slots/student/${userRes.data._id}`);
                setMyBookings(bookingsRes.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const res = await axios.post('http://localhost:5000/api/interviews/slots', {
                ...slotFormData,
                adminId: user._id
            });
            setSlots([...slots, res.data]);
            setShowSlotForm(false);
            setSlotFormData({ company: '', position: '', location: '', date: '', startTime: '', endTime: '', duration: 30, maxCapacity: 1, description: '', adminId: '' });
        } catch (err) {
            console.error('Error creating slot:', err);
            alert(err.response?.data?.message || 'Failed to create slot');
        }
    };

    const handleBookSlot = async (slotId) => {
        if (!user) return;
        try {
            await axios.post('http://localhost:5000/api/interviews/slots/book', { slotId, userId: user._id });
            alert('Slot booked successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to book slot');
        }
    };

    const handleCancelBooking = async (slotId) => {
        if (!user || !confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.post('http://localhost:5000/api/interviews/slots/cancel', { slotId, userId: user._id });
            alert('Booking cancelled successfully');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!confirm('Are you sure? This will delete the slot permanently.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/interviews/slots/${slotId}`);
            setSlots(slots.filter(s => s._id !== slotId));
        } catch (err) {
            console.error(err);
        }
    };

    const InputClass = "w-full bg-transparent border-b border-white/20 text-white placeholder-blue-300/50 focus:border-blue-400 outline-none transition-all py-2";
    const LabelClass = "block text-xs font-bold text-blue-300 mb-1 uppercase tracking-wider";

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <GravityCard className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-royal-600/20 rounded-full blur-3xl animate-float"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Interview Node</h1>
                        <p className="text-blue-200/80 max-w-xl">
                            Coordinate and secure your interview slots. Manage your trajectory towards career success.
                        </p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setView('student')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'student' ? 'bg-gradient-to-r from-royal-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Candidate View
                        </button>
                        <button
                            onClick={() => setView('admin')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'admin' ? 'bg-gradient-to-r from-royal-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Admin Control
                        </button>
                    </div>
                </div>
            </GravityCard>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upcoming / Slots */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-400" />
                            {view === 'student' ? 'Available Slots' : 'Manage Slots'}
                        </h2>
                        {view === 'admin' && (
                            <button
                                onClick={() => setShowSlotForm(!showSlotForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold"
                            >
                                <Plus size={18} /> Create Slot
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showSlotForm && view === 'admin' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <GravityCard className="p-6 border-blue-500/30 bg-blue-900/10">
                                    <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">New Interview Slot</h3>
                                    <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={LabelClass}>Company</label>
                                            <input className={InputClass} value={slotFormData.company} onChange={(e) => setSlotFormData({ ...slotFormData, company: e.target.value })} placeholder="e.g. Google" required />
                                        </div>
                                        <div>
                                            <label className={LabelClass}>Position</label>
                                            <input className={InputClass} value={slotFormData.position} onChange={(e) => setSlotFormData({ ...slotFormData, position: e.target.value })} placeholder="e.g. Frontend Engineer" required />
                                        </div>
                                        <div>
                                            <label className={LabelClass}>Date</label>
                                            <input type="date" className={InputClass} value={slotFormData.date} onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={LabelClass}>Start Time</label>
                                                <input type="time" className={InputClass} value={slotFormData.startTime} onChange={(e) => setSlotFormData({ ...slotFormData, startTime: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className={LabelClass}>End Time</label>
                                                <input type="time" className={InputClass} value={slotFormData.endTime} onChange={(e) => setSlotFormData({ ...slotFormData, endTime: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={LabelClass}>Location / Link</label>
                                            <input className={InputClass} value={slotFormData.location} onChange={(e) => setSlotFormData({ ...slotFormData, location: e.target.value })} placeholder="Video Call Link or Office Address" required />
                                        </div>
                                        <div className="md:col-span-2 pt-4">
                                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-royal-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                                Initialize Slot
                                            </button>
                                        </div>
                                    </form>
                                </GravityCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                        ) : slots.length === 0 ? (
                            <GravityCard className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="text-slate-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">No Slots Available</h3>
                                <p className="text-slate-400 mt-2">Check back later for new interview opportunities.</p>
                            </GravityCard>
                        ) : (
                            slots.map((slot) => (
                                <GravityCard key={slot._id} className="p-6 group hover:translate-x-2">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{slot.position}</h3>
                                                <span className="px-2 py-0.5 rounded textxs font-bold bg-white/10 text-slate-300 border border-white/5">
                                                    {slot.company}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {new Date(slot.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-purple-500" /> {slot.startTime} - {slot.endTime}</span>
                                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-pink-500" /> {slot.location}</span>
                                            </div>

                                            {view === 'admin' && (
                                                <div className="mt-4 flex items-center gap-2">
                                                    <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${(slot.attendees?.length || 0) / slot.maxCapacity * 100}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{slot.attendees?.length || 0} / {slot.maxCapacity} Candidates</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            {view === 'admin' ? (
                                                <button onClick={() => handleDeleteSlot(slot._id)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">
                                                    <Trash2 size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBookSlot(slot._id)}
                                                    disabled={slot.attendees?.includes(user?._id) || (slot.attendees?.length >= slot.maxCapacity)}
                                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${slot.attendees?.includes(user?._id)
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                                        : slot.attendees?.length >= slot.maxCapacity
                                                            ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                                            : 'bg-white/10 text-white hover:bg-blue-600 hover:shadow-lg hover:border-blue-500/50 border border-white/10'
                                                        }`}
                                                >
                                                    {slot.attendees?.includes(user?._id) ? (
                                                        <> <CheckCircle size={18} /> Booked </>
                                                    ) : slot.attendees?.length >= slot.maxCapacity ? (
                                                        'Full'
                                                    ) : (
                                                        <> Book Slot <ChevronRight size={18} /> </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </GravityCard>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: User's Bookings */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CheckCircle className="text-green-400" />
                        My Bookings
                    </h2>

                    <div className="space-y-4">
                        {myBookings.length === 0 ? (
                            <GravityCard className="p-8 text-center border-dashed border-white/20">
                                <p className="text-slate-400">You haven't booked any interviews yet.</p>
                            </GravityCard>
                        ) : (
                            myBookings.map((booking) => (
                                <GravityCard key={booking._id} className="p-5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-lg text-white">{booking.position}</h4>
                                                <p className="text-sm text-blue-300">{booking.company}</p>
                                            </div>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                                                <XCircle size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-500" />
                                                {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-500" />
                                                {booking.startTime}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                                Confirmed
                                            </span>
                                            <a href={booking.location} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-white transition-colors">
                                                Open Link &rarr;
                                            </a>
                                        </div>
                                    </div>
                                </GravityCard>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interviews;
