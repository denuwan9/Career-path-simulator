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

    const InputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none transition-all py-2 rounded-lg px-3 mt-1";
    const LabelClass = "block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider";

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <GravityCard className="p-8 relative overflow-hidden bg-white border-slate-200">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-royal-100 rounded-full blur-3xl animate-float"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Interview Node</h1>
                        <p className="text-slate-600 max-w-xl">
                            Coordinate and secure your interview slots. Manage your trajectory towards career success.
                        </p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
                        <button
                            onClick={() => setView('student')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'student' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Candidate View
                        </button>
                        <button
                            onClick={() => setView('admin')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
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
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="text-blue-600" />
                            {view === 'student' ? 'Available Slots' : 'Manage Slots'}
                        </h2>
                        {view === 'admin' && (
                            <button
                                onClick={() => setShowSlotForm(!showSlotForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold shadow-sm"
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
                                <GravityCard className="p-6 border-blue-200 bg-blue-50 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-blue-200 pb-2">New Interview Slot</h3>
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
                                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:shadow-md transition-all">
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
                            <GravityCard className="p-12 text-center flex flex-col items-center justify-center bg-white border border-slate-200 shadow-sm border-dashed">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No Slots Available</h3>
                                <p className="text-slate-500 mt-2">Check back later for new interview opportunities.</p>
                            </GravityCard>
                        ) : (
                            slots.map((slot) => (
                                <GravityCard key={slot._id} className="p-6 group hover:translate-x-2 bg-white border border-slate-200 shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{slot.position}</h3>
                                                <span className="px-2 py-0.5 rounded textxs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                    {slot.company}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {new Date(slot.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-purple-500" /> {slot.startTime} - {slot.endTime}</span>
                                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-pink-500" /> {slot.location}</span>
                                            </div>

                                            {view === 'admin' && (
                                                <div className="mt-4 flex items-center gap-2">
                                                    <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${(slot.attendees?.length || 0) / slot.maxCapacity * 100}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{slot.attendees?.length || 0} / {slot.maxCapacity} Candidates</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            {view === 'admin' ? (
                                                <button onClick={() => handleDeleteSlot(slot._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-200">
                                                    <Trash2 size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBookSlot(slot._id)}
                                                    disabled={slot.attendees?.includes(user?._id) || (slot.attendees?.length >= slot.maxCapacity)}
                                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${slot.attendees?.includes(user?._id)
                                                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                                                        : slot.attendees?.length >= slot.maxCapacity
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                                            : 'bg-white text-slate-900 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'
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
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        My Bookings
                    </h2>

                    <div className="space-y-4">
                        {myBookings.length === 0 ? (
                            <GravityCard className="p-8 text-center border-dashed border-slate-300 bg-white shadow-sm">
                                <p className="text-slate-500">You haven't booked any interviews yet.</p>
                            </GravityCard>
                        ) : (
                            myBookings.map((booking) => (
                                <GravityCard key={booking._id} className="p-5 relative overflow-hidden group bg-white border border-slate-200 shadow-sm">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-green-200 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-900">{booking.position}</h4>
                                                <p className="text-sm text-blue-600">{booking.company}</p>
                                            </div>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="text-red-500 hover:text-red-600 transition-colors p-1 bg-red-50 rounded-md">
                                                <XCircle size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-400" />
                                                {booking.startTime}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                Confirmed
                                            </span>
                                            <a href={booking.location} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold">
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
