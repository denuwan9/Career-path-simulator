/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                royal: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563EB', // Primary Brand Color
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                navy: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b', // Sidebar Dark
                    900: '#0f172a', // Sidebar Darker
                },
                success: '#10B981',
                danger: '#EF4444',
                warning: '#F59E0B',
                glass: {
                    100: 'rgba(255, 255, 255, 0.5)',
                    200: 'rgba(255, 255, 255, 0.7)',
                    300: 'rgba(255, 255, 255, 0.9)',
                    dark: 'rgba(0, 0, 0, 0.05)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
                'glass-sm': '0 4px 30px rgba(0, 0, 0, 0.05)',
                'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                'antigravity-sm': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                'antigravity-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            },
            backgroundImage: {
                'abyss-gradient': 'linear-gradient(to bottom, #f8fafc, #ffffff, #f8fafc)',
                'glow-mesh': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05), transparent 70%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
