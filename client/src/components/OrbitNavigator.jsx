import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const SkillNode = ({ position, label, color, isCenter = false }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!isCenter) {
            // Self-rotation
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={hovered ? 1.2 : 1}
                >
                    <sphereGeometry args={[isCenter ? 1.5 : 0.8, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
                <Text
                    position={[0, isCenter ? 2.5 : 1.5, 0]}
                    fontSize={isCenter ? 0.5 : 0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label}
                </Text>
            </group>
        </Float>
    );
};

const OrbitSystem = () => {
    // Mock Data - In real app, this comes from AI Controller
    const centerRole = { name: "Full Stack Architect", color: "#3b82f6" };
    const skills = [
        { name: "React + Fiber", color: "#06b6d4" },
        { name: "Node.js", color: "#22c55e" },
        { name: "Three.js", color: "#fcd34d" },
        { name: "System Design", color: "#a855f7" },
        { name: "AI Integration", color: "#ef4444" },
    ];

    return (
        <group>
            {/* Center Node */}
            <SkillNode position={[0, 0, 0]} label={centerRole.name} color={centerRole.color} isCenter />

            {/* Orbiting Skills */}
            {skills.map((skill, i) => {
                const angle = (i / skills.length) * Math.PI * 2;
                const radius = 6;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                    <group key={i}>
                        <SkillNode position={[x, 0, z]} label={skill.name} color={skill.color} />
                        {/* Connection Line */}
                        <Line
                            points={[[0, 0, 0], [x, 0, z]]}
                            color={skill.color}
                            opacity={0.2}
                            transparent
                            lineWidth={1}
                        />
                    </group>
                );
            })}
        </group>
    );
};

const OrbitNavigator = () => {
    return (
        <div className="w-full h-[500px] bg-glass-100 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden relative shadow-glass-md">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-xl font-bold text-white">Career Orbit</h3>
                <p className="text-sm text-blue-200">Interactive Skill Map</p>
            </div>

            <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <OrbitSystem />
            </Canvas>
        </div>
    );
};

export default OrbitNavigator;
