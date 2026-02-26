import React, { createContext, useContext, useState } from 'react';

const ElevationContext = createContext();

export const ElevationProvider = ({ children }) => {
    const [focusedId, setFocusedId] = useState(null);

    const elevate = (id) => setFocusedId(id);
    const drop = () => setFocusedId(null);

    return (
        <ElevationContext.Provider value={{ focusedId, elevate, drop }}>
            {children}
        </ElevationContext.Provider>
    );
};

export const useElevation = () => {
    const context = useContext(ElevationContext);
    if (!context) {
        throw new Error('useElevation must be used within an ElevationProvider');
    }
    return context;
};
