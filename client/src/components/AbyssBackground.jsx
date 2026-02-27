import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export default function AbyssBackground() {
    return (
        <div className="fixed inset-0 z-[-10] bg-gradient-to-br from-white via-white to-slate-50 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Sparkles count={150} size={1.5} scale={[10, 10, 10]} speed={0.2} opacity={0.15} color="#cbd5e1" />
            </Canvas>
        </div>
    );
}
