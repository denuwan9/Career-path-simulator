import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';

export default function AbyssBackground() {
    return (
        <div className="fixed inset-0 z-[-10] bg-abyss-gradient pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Sparkles count={200} size={2} scale={[10, 10, 10]} speed={0.3} opacity={0.3} color="#3b82f6" />
            </Canvas>
        </div>
    );
}
