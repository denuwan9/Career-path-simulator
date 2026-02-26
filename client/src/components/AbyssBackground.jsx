import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';

export default function AbyssBackground() {
    return (
        <div className="fixed inset-0 z-[-10] bg-abyss-gradient pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={300} size={3} scale={[10, 10, 10]} speed={0.4} opacity={0.5} color="#60a5fa" />
            </Canvas>
        </div>
    );
}
