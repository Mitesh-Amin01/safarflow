import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLaptop, FaMobileAlt, FaFilePdf, FaFileImage, FaLock, FaUsers, FaMoneyBillWave, FaExchangeAlt, FaReceipt } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Intro animation for the whole section
        tl.fromTo('.feature-card',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );

        // Continuous pulsing glows
        gsap.to('.pulse-glow', {
            opacity: 0.8,
            scale: 1.1,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Continuous line flow animations along the curved SVGs
        // Continuous line flow animations along the curved SVGs
        gsap.to('.flow-line', {
            strokeDashoffset: "-=100",
            duration: 2.5,
            repeat: -1,
            ease: "linear"
        });

        // Scanner effect for File Vault
        gsap.fromTo('.file-scanner-line',
            { left: '-10%' },
            { left: '110%', duration: 3.5, repeat: -1, ease: 'sine.inOut' }
        );

        // Sequential glowing links for File Vault
        const vaultTl = gsap.timeline({ repeat: -1 });
        vaultTl.to('.vault-link-1', { opacity: 0.8, filter: 'blur(2px)', duration: 0.6, ease: "power2.inOut" })
            .to('.vault-link-1', { opacity: 0.2, filter: 'blur(4px)', duration: 0.6, ease: "power2.inOut" })
            .to('.vault-link-2', { opacity: 0.8, filter: 'blur(2px)', duration: 0.6, ease: "power2.inOut" }, "-=0.3")
            .to('.vault-link-2', { opacity: 0.2, filter: 'blur(4px)', duration: 0.6, ease: "power2.inOut" });

    }, { scope: containerRef });

    return (
        <section id="features" ref={containerRef} className="w-full bg-background relative z-10 py-24 px-6 md:px-12 lg:px-20 mx-auto max-w-[1800px]">

            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-background pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,rgba(150,113,255,0.05)_0%,transparent_70%)]"></div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6">

                {/* Section Header */}
                <div className="mb-14 text-center relative z-20 flex flex-col items-center">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(150,113,255,0.8)]"></span>
                        <span className="text-xs font-semibold tracking-widest text-primary uppercase">Core Capabilities</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium text-white tracking-tight relative">
                        Powerful <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#FF90E8] relative z-10">Features</span>
                        {/* Glow behind "Features" */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/30 blur-2xl -z-10 rounded-full"></span>
                    </h2>
                </div>

                {/* Benton Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

                    {/* LEFT CARD: Real-time Collaboration (Tall) */}
                    <div className="feature-card lg:col-span-6 bg-[#0E0715] border border-borders/40 rounded-[32px] p-10 flex flex-col justify-between relative overflow-hidden group">

                        {/* Connecting Visual */}
                        <div className="flex-1 w-full relative min-h-[300px] flex items-center justify-center">

                            {/* SVG Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {/* Connectors from center 20,50 to right nodes 75,25 and 75,75 */}
                                <path d="M 20 50 C 40 50 50 25 75 25" fill="none" stroke="#9671FF" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" className="opacity-50" />
                                <path d="M 20 50 C 40 50 50 75 75 75" fill="none" stroke="#9671FF" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" className="opacity-50" />

                                {/* Animated flow lines tracking the curves exactly */}
                                <path d="M 20 50 C 40 50 50 25 75 25" fill="none" stroke="#FFD700" strokeWidth="3.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="8 100" strokeDashoffset="0" className="flow-line" filter="url(#glow-gold)" />
                                <path d="M 20 50 C 40 50 50 75 75 75" fill="none" stroke="#FFD700" strokeWidth="3.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="8 100" strokeDashoffset="0" className="flow-line" filter="url(#glow-gold)" />

                                {/* Connection Dots */}
                                <circle cx="75" cy="25" r="1.5" fill="#FFD700" filter="url(#glow-gold)" />
                                <circle cx="75" cy="75" r="1.5" fill="#FFD700" filter="url(#glow-gold)" />
                            </svg>

                            {/* Center Main Node */}
                            <div className="absolute left-[20%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#05020A] rounded-full border border-borders flex items-center justify-center z-10 shadow-[0_0_40px_rgba(150,113,255,0.2)]">
                                <div className="pulse-glow absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                                <div className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 opacity-80">
                                    <div className="w-8 h-1 bg-white rounded-full"></div>
                                    <div className="w-8 h-1 bg-white rounded-full"></div>
                                    <div className="w-8 h-1 bg-primary rounded-full"></div>
                                </div>
                            </div>

                            {/* Top Device Node */}
                            <div className="absolute left-[75%] top-[25%] -translate-y-1/2 w-24 h-20 bg-[#0A0512] rounded-xl border border-borders flex flex-col items-center justify-center z-10 shadow-xl">
                                <FaLaptop className="text-gray-400 text-2xl" />
                            </div>

                            {/* Bottom Device Node */}
                            <div className="absolute left-[75%] top-[75%] -translate-y-1/2 w-24 h-20 bg-[#0A0512] rounded-xl border border-borders flex flex-col items-center justify-center z-10 shadow-xl">
                                <FaMobileAlt className="text-gray-500 text-2xl" />
                            </div>
                        </div>

                        <div className="relative z-20 mt-8">
                            <h3 className="text-2xl font-medium text-white mb-3">Real-time Collaboration</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-[400px]">
                                Build itineraries together. Say goodbye to messy WhatsApp groups. Every addition, vote, and schedule change syncs instantly across all devices.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Stack of 2 */}
                    <div className="lg:col-span-6 grid grid-rows-2 gap-6">

                        {/* TOP RIGHT: Shared File Vault */}
                        <div className="feature-card bg-[#0E0715] border border-borders/40 rounded-[32px] p-8 lg:p-10 flex flex-col relative overflow-hidden group">

                            {/* Matrix/Data Background Effect */}
                            <div className="absolute top-0 right-0 w-[60%] h-full opacity-10 font-mono text-[8px] leading-none text-primary overflow-hidden hidden md:block select-none" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}>
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="whitespace-nowrap mb-1">
                                        {Array.from({ length: 20 }).map(() => Math.floor(Math.random() * 999999).toString().padStart(6, '0')).join(' ')}
                                    </div>
                                ))}
                            </div>

                            {/* Animated Scanner Line */}
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b from-transparent via-[#FFD700] to-transparent z-30 opacity-70 blur-[1px] file-scanner-line pointer-events-none shadow-[0_0_20px_5px_rgba(255,215,0,0.4)]"></div>

                            <div className="flex-1 w-full flex items-center justify-between min-h-[150px] relative z-20 px-2 lg:px-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-20 bg-[#0A0512] border border-borders rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(150,113,255,0.15)] cursor-pointer">
                                        <FaFilePdf className="text-gray-500 text-3xl" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Tickets</span>
                                </div>

                                {/* Glowing Dust Connection 1 */}
                                <div className="h-0.5 w-12 lg:w-16 bg-linear-to-r from-transparent via-primary/50 to-transparent relative">
                                    <div className="absolute inset-0 bg-primary/40 blur-xs opacity-40 vault-link-1"></div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-20 bg-[#0A0512] border border-borders rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(150,113,255,0.15)] cursor-pointer">
                                        <FaFileImage className="text-gray-500 text-3xl" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Vouchers</span>
                                </div>

                                {/* Glowing Dust Connection 2 */}
                                <div className="h-0.5 w-12 lg:w-16 bg-linear-to-r from-transparent via-primary/80 to-transparent relative">
                                    <div className="absolute inset-0 bg-primary/60 blur-xs opacity-40 vault-link-2"></div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-20 bg-[#0A0512] border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(150,113,255,0.2)] transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(150,113,255,0.4)] cursor-pointer">
                                        <FaLock className="text-primary text-3xl" />
                                    </div>
                                    <span className="text-[10px] text-primary font-mono uppercase tracking-widest mt-1">Vault</span>
                                </div>
                            </div>

                            <div className="relative z-20 mt-auto pt-6">
                                <h3 className="text-xl font-medium text-white mb-2">Shared File Vault</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Centralize all boarding passes, hotel reservations, and visa PDFs. Fully encrypted and securely accessible by everyone in your group.
                                </p>
                            </div>
                        </div>

                        {/* BOTTOM RIGHT: Smart Budgeting */}
                        <div className="feature-card bg-[#0E0715] border border-borders/40 rounded-[32px] p-8 lg:p-10 flex flex-col relative overflow-hidden group">

                            <div className="flex-1 w-full relative min-h-[150px] flex items-center justify-center">

                                {/* SVG Integrations Lines - Connected Curves */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M 50 50 C 35 50 20 35 20 15" fill="none" stroke="#9671FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                    <path d="M 50 50 C 35 50 20 65 20 85" fill="none" stroke="#9671FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                    <path d="M 50 50 C 65 50 80 35 80 15" fill="none" stroke="#9671FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                    <path d="M 50 50 C 65 50 80 65 80 85" fill="none" stroke="#9671FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

                                    {/* Connectivity Plugs */}
                                    <path d="M 50 50 C 35 50 20 35 20 15" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line" />
                                    <path d="M 50 50 C 35 50 20 65 20 85" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line" />
                                    <path d="M 50 50 C 65 50 80 35 80 15" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line" />
                                    <path d="M 50 50 C 65 50 80 65 80 85" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line" />
                                </svg>

                                {/* Central Capsule */}
                                <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 bg-background border border-primary/50 rounded-full flex items-center gap-2 z-10 shadow-[0_0_20px_rgba(150,113,255,0.3)]">
                                    <FaExchangeAlt className="text-primary text-sm" />
                                    <span className="text-white text-sm font-mono font-medium tracking-wide">Smart Splits</span>
                                </div>

                                {/* Surrounding Nodes */}
                                <div className="absolute top-[15%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0A0512] border border-borders rounded-full flex items-center justify-center z-10 shadow-lg">
                                    <FaUsers className="text-gray-400 text-2xl" />
                                </div>
                                <div className="absolute top-[85%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0A0512] border border-borders rounded-full flex items-center justify-center z-10 shadow-lg">
                                    <FaReceipt className="text-gray-400 text-2xl" />
                                </div>
                                <div className="absolute top-[15%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0A0512] border border-borders rounded-full flex items-center justify-center z-10 shadow-lg">
                                    <FaMoneyBillWave className="text-gray-400 text-2xl" />
                                </div>
                                <div className="absolute top-[85%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0A0512] border border-borders rounded-full flex items-center justify-center z-10 shadow-lg">
                                    <span className="text-gray-400 text-3xl font-black font-serif">$</span>
                                </div>

                            </div>

                            <div className="relative z-20 mt-auto pt-6">
                                <h3 className="text-xl font-medium text-white mb-2">Automated Expenses</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Log spending as you go. Directly tracks who owes whom and handles unequal splits instantly, eliminating post-trip awkwardness.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
