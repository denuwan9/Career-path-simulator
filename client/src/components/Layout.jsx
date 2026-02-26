import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AbyssBackground from './AbyssBackground';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="min-h-screen flex relative text-slate-900 font-sans">
            <AbyssBackground />

            {!isAuthPage && <Sidebar />}

            <main className={`flex-1 ${!isAuthPage ? 'ml-64' : ''} p-8 overflow-y-auto h-screen relative z-10`}>
                <div className={`mx-auto ${!isAuthPage ? 'max-w-7xl' : 'w-full h-full flex items-center justify-center'}`}>
                    {!isAuthPage && (
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                {/* Dynamic header could go here */}
                            </div>
                            {/* Status / Notifications placeholder */}
                            <div className="flex gap-4">
                                {/* <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                                    <Bell size={20} />
                                </div> */}
                            </div>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={isAuthPage ? "w-full" : ""}
                    >
                        {children}
                    </motion.div>
                </div>
                {!isAuthPage && <ChatBot />}
            </main>
        </div>
    );
};

export default Layout;
