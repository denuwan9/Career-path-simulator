import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, X, User, Mail, Phone, Calendar, Ruler, Weight, Camera, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InputField = ({ label, name, register, validation, error, type = "text", icon: Icon, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />}
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, validation)}
                className={`w-full bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all ${Icon ? 'pl-10' : 'pl-4'}`}
            />
        </div>
        {error && <p className="text-red-400 text-xs ml-1 flex items-center gap-1">{error.message}</p>}
    </div>
);

const ProfileEdit = ({ user, onCancel, onSave, isSaving }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
            contactNumber: user.contactNumber || '',
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            gender: user.gender || '',
            height: user.height || '',
            weight: user.weight || '',
            bio: user.bio || '',
            careerField: user.careerField || '',
            address: user.address || '',
            profileImage: user.profileImage || ''
        }
    });

    const [previewImage, setPreviewImage] = useState(user.profileImage);

    // Watch fields for interactions (like BMI auto-calc if needed live, though user asked for calc in View)
    // We can also calc BMI live here
    const height = watch('height');
    const weight = watch('weight');
    const [bmi, setBmi] = useState(null);

    useEffect(() => {
        if (height && weight) {
            const h = height / 100;
            const b = (weight / (h * h)).toFixed(1);
            setBmi(b);
        } else {
            setBmi(null);
        }
    }, [height, weight]);

    const handleImageChange = (e) => {
        const url = e.target.value;
        setPreviewImage(url);
        setValue('profileImage', url); // In a real app, this would be file upload logic
    };

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl mx-auto bg-glass-100 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
            <div className="border-b border-white/10 p-6 bg-slate-900/40 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600">
                            <img
                                src={previewImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`}
                                alt="Preview"
                                className="w-full h-full rounded-full object-cover bg-slate-900 border-4 border-slate-900"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" />
                        </div>
                    </div>
                    <div className="w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Paste Image URL"
                            {...register('profileImage')}
                            onChange={handleImageChange}
                            className="w-full text-center text-sm bg-transparent border-b border-white/20 text-blue-300 placeholder-slate-600 focus:border-blue-500 outline-none pb-2"
                        />
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Full Name"
                        name="name"
                        register={register}
                        validation={{ required: 'Name is required' }}
                        error={errors.name}
                        icon={User}
                    />

                    <InputField
                        label="Email Address"
                        name="email"
                        register={register}
                        validation={{
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                        }}
                        error={errors.email}
                        icon={Mail}
                        type="email"
                    />

                    <InputField
                        label="Phone Number"
                        name="contactNumber"
                        register={register}
                        validation={{
                            required: 'Phone is required',
                            pattern: { value: /^[0-9+\-\s]+$/, message: 'Valid phone number required' }
                        }}
                        error={errors.contactNumber}
                        icon={Phone}
                    />

                    <InputField
                        label="Date of Birth"
                        name="dateOfBirth"
                        register={register}
                        validation={{ required: 'Date of birth is required' }}
                        error={errors.dateOfBirth}
                        icon={Calendar}
                        type="date"
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 ml-1">Gender</label>
                        <select
                            {...register('gender', { required: 'Gender is required' })}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none appearance-none"
                        >
                            <option value="" className="text-slate-500">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="text-red-400 text-xs ml-1">{errors.gender.message}</p>}
                    </div>

                    <InputField
                        label="Career Field"
                        name="careerField"
                        register={register}
                        icon={User}
                        placeholder="e.g. Software Engineer"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Height (cm)"
                            name="height"
                            register={register}
                            validation={{ required: 'Height required', min: 50, max: 300 }}
                            error={errors.height}
                            icon={Ruler}
                            type="number"
                        />
                        <InputField
                            label="Weight (kg)"
                            name="weight"
                            register={register}
                            validation={{ required: 'Weight required', min: 20, max: 500 }}
                            error={errors.weight}
                            icon={Weight}
                            type="number"
                        />
                    </div>

                    {/* Live BMI Indicator during Edit */}
                    <div className="md:col-span-2 flex justify-end">
                        {bmi && (
                            <div className="text-sm px-4 py-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                Estimated BMI: <span className="font-bold text-white">{bmi}</span>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 ml-1">Bio</label>
                        <textarea
                            {...register('bio')}
                            rows="4"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none resize-none"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || !isValid}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ProfileEdit;
