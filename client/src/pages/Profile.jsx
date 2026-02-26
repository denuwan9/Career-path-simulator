import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ProfileHeader, AboutCard } from '../components/profile/ProfileComponents';
import { SkillsCard, ProjectsGrid } from '../components/profile/ProfileSections';
import { TimelineSection } from '../components/profile/TimelineSection';
import StatsRow from '../components/profile/StatsRow';
import EditProfileModal from '../components/profile/EditProfileModal';
import { motion } from 'framer-motion';

const Profile = () => {
    const authContext = useContext(AuthContext);
    const authUser = authContext?.user || null;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: '', email: '', profileImage: '', contactNumber: '', address: '', age: '',
        careerField: '', bio: '', skills: [], softSkills: [], languages: [],
        education: [], hasExperience: false, experience: [], projects: [],
        socialLinks: { linkedin: '', github: '', portfolio: '', website: '' }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const email = authUser?.email || 'student@example.com';
                const res = await axios.get(`http://localhost:5000/api/users/profile/${email}`);
                setUserData({
                    ...res.data,
                    // Ensure arrays exist
                    skills: res.data.skills || [],
                    softSkills: res.data.softSkills || [],
                    languages: res.data.languages || [],
                    education: res.data.education || [],
                    experience: res.data.experience || [],
                    projects: res.data.projects || [],
                    socialLinks: res.data.socialLinks || { linkedin: '', github: '', portfolio: '', website: '' }
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [authUser]);

    const handleSave = async (updatedData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/profile', updatedData);
            setUserData(res.data);
            setIsEditing(false);
            // alert('Profile saved successfully!');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile.');
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Particles/Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* 1. Header (Full Width Banner) */}
                <ProfileHeader user={userData} onEdit={() => setIsEditing(true)} />

                {/* 2. Stats Row */}
                <StatsRow />

                {/* 3. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column (Sticky Sidebar feel) */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start h-fit">
                        <AboutCard user={userData} />
                        <SkillsCard user={userData} />
                    </div>

                    {/* Right Column (Scrollable Content) */}
                    <div className="lg:col-span-8 space-y-6">
                        <TimelineSection education={userData.education} experience={userData.experience} />
                        <ProjectsGrid projects={userData.projects} />
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <EditProfileModal
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                    userData={userData}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Profile;
