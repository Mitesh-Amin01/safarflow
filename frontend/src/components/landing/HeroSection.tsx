import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaArrowRight } from 'react-icons/fa';
import logo from '../../assets/logo/logo.png';

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const leftPathRef = useRef<SVGPathElement>(null);
    const rightPathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Core text reveal
        tl.fromTo('.hero-text-anim',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15 }
        )
            // 2. Button and central glow
            .fromTo('.hero-glow',
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: 'expo.out' },
                "-=0.5"
            )
            // 3. Phone graphic slides up
            .fromTo('.hero-phone',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.2)' },
                "-=1.5"
            )
            // 4. Feature nodes fade in
            .fromTo('.hero-node',
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
                "-=0.8"
            );

        // 5. SVG Lines drawing animation
        if (leftPathRef.current && rightPathRef.current) {
            const leftLength = leftPathRef.current.getTotalLength();
            const rightLength = rightPathRef.current.getTotalLength();

            gsap.set(leftPathRef.current, { strokeDasharray: leftLength, strokeDashoffset: leftLength });
            gsap.set(rightPathRef.current, { strokeDasharray: rightLength, strokeDashoffset: rightLength });

            tl.to(leftPathRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, "-=1.0")
                .to(rightPathRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, "-=1.5");
        }

        // Continuous subtle floating for the nodes
        gsap.to('.hero-node-left', { y: -8, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.hero-node-right', { y: -8, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });

        // Pulse animation for the lines (simulating data flow)
        gsap.to('.data-flow-dot-left', {
            motionPath: {
                path: leftPathRef.current as SVGPathElement,
                align: leftPathRef.current as SVGPathElement,
                alignOrigin: [0.5, 0.5],
                autoRotate: true
            },
            duration: 4,
            repeat: -1,
            ease: "none"
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-[222vh] bg-background-base flex flex-col items-center justify-start overflow-hidden pt-[160px] md:pt-[200px] z-10 pb-32">

            {/* Background Base */}
            <div className="absolute inset-0 z-0 bg-background pointer-events-none"></div>

            {/* Central Glow behind the phone */}
            <div className="hero-glow absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary rounded-full mix-blend-screen filter blur-[150px] opacity-[0.15] z-0 pointer-events-none"></div>

            {/* Top Text Content */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 w-full mx-auto">
                <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-medium text-white leading-[1.1] tracking-tight mb-6 hero-text-anim whitespace-nowrap">
                    Plan Trips <span className="relative inline-block">
                        <span className="relative z-10">Together,</span>
                        <span className="absolute bottom-1 left-0 w-full h-1 md:h-2 bg-primary group-hover:h-full transition-all z-0"></span>
                    </span><br />
                    <span className="relative inline-block">
                        <span className="relative z-10">Built</span>
                        <span className="absolute bottom-1 left-0 w-full h-1 md:h-2 bg-primary group-hover:h-full transition-all z-0"></span>
                    </span> For Groups
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-[700px] leading-relaxed mb-10 hero-text-anim font-light">
                    We help friend groups orchestrate perfect journeys through a collaborative workspace that blends itineraries, shared budgets, and real-time planning.
                </p>

                {/* Pill CTA Button */}
                <div className="hero-text-anim">
                    <button className="group flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-white/10 text-white rounded-full px-10 py-3 pr-3 transition-all duration-300 shadow-[0_0_30px_rgba(150,113,255,0.15)] hover:shadow-[0_0_40px_rgba(150,113,255,0.3)]">
                        <span className="text-xl font-medium tracking-wide pl-4">Start Planning</span>
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-primary-light transition-colors relative overflow-hidden">
                            <FaArrowRight className="text-xl absolute transform group-hover:translate-x-10 transition-transform duration-300" />
                            <FaArrowRight className="text-xl absolute transform -translate-x-10 group-hover:translate-x-0 transition-transform duration-300" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Graphic Area (Phone + Connecting Nodes) */}
            <div className="relative w-full max-w-[1200px] mx-auto mt-20 md:mt-32 h-[500px] z-20 flex justify-center items-start px-4">

                {/* SVG Connecting Lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block" style={{ overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="glowLineLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(150, 113, 255, 0.1)" />
                            <stop offset="80%" stopColor="rgba(150, 113, 255, 0.8)" />
                            <stop offset="100%" stopColor="rgba(150, 113, 255, 1)" />
                        </linearGradient>
                        <linearGradient id="glowLineRight" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(150, 113, 255, 1)" />
                            <stop offset="20%" stopColor="rgba(150, 113, 255, 0.8)" />
                            <stop offset="100%" stopColor="rgba(150, 113, 255, 0.1)" />
                        </linearGradient>
                    </defs>

                    {/* Left Line */}
                    <path
                        ref={leftPathRef}
                        d="M 200 120 C 350 120, 300 240, 480 240"
                        fill="none"
                        stroke="url(#glowLineLeft)"
                        strokeWidth="1.5"
                        className="opacity-70"
                    />

                    {/* Right Line */}
                    <path
                        ref={rightPathRef}
                        d="M 720 240 C 900 240, 850 120, 1000 120"
                        fill="none"
                        stroke="url(#glowLineRight)"
                        strokeWidth="1.5"
                        className="opacity-70"
                    />

                    {/* Dots on Left Line */}
                    <circle cx="200" cy="120" r="3" fill="#9671FF" />
                    <circle cx="480" cy="240" r="3" fill="#9671FF" />
                    <circle cx="340" cy="180" r="2" fill="none" stroke="#9671FF" strokeWidth="1" className="opacity-50" />

                    {/* Dots on Right Line */}
                    <circle cx="720" cy="240" r="3" fill="#9671FF" />
                    <circle cx="1000" cy="120" r="3" fill="#9671FF" />
                    <circle cx="860" cy="180" r="2" fill="none" stroke="#9671FF" strokeWidth="1" className="opacity-50" />
                </svg>

                {/* Left Node */}
                <div className="hero-node hero-node-left absolute left-[5%] md:left-[10%] top-[40px] md:top-[80px] w-[180px] bg-[#120B20]/90 backdrop-blur-xl border border-borders/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(150,113,255,0.1)] z-30 hidden md:block">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-white font-bold text-lg leading-tight mb-2 opacity-90">Collaborative<br />Builder</div>
                        <div className="text-gray-500 text-[10px] uppercase font-mono tracking-widest flex justify-between w-full border-t border-borders/50 pt-2">
                            <span>Real</span>
                            <span>Time</span>
                        </div>
                    </div>
                </div>

                {/* Center Phone Mockup */}
                <div className="hero-phone relative w-[320px] md:w-[360px] h-[650px] bg-[#0A0514] border-[6px] border-[#1E1235] rounded-[40px] z-40 overflow-hidden mt-10 shadow-[0_0_60px_rgba(150,113,255,0.2),inset_0_0_20px_rgba(0,0,0,1)]">

                    {/* Top Notch/Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1E1235] rounded-b-[16px] z-50 flex justify-center items-end pb-1">
                        <div className="w-16 h-1.5 rounded-full bg-black/50"></div>
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-2 left-6 text-[10px] font-medium text-white z-50">9:41</div>
                    <div className="absolute top-2 right-6 flex items-center gap-1 z-50">
                        {/* Simulating battery/wifi icons */}
                        <div className="w-3 h-2.5 border border-white rounded-[2px] opacity-90"><div className="w-[80%] h-full bg-white rounded-[1px]"></div></div>
                    </div>

                    {/* App Content Simulation */}
                    <div className="w-full h-full pt-20 px-6 flex flex-col items-center bg-linear-to-b from-[#150D26] to-[#0A0514]">

                        {/* SafarFlow Small Logo Mark */}
                        <div className="w-60 h-40 mb-8 flex flex-col justify-center items-center">
                            <img src={logo} alt="SafarFlow Logo" className="w-full h-full object-contain" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-medium text-white text-center leading-tight mb-8">
                            Bring Your Trip <span className="text-primary-light">Together</span>
                        </h2>

                        <div className="w-full flex justify-center mt-4">
                            <div className="border border-primary/40 bg-primary/10 rounded-[14px] px-6 py-3 text-center">
                                <span className="text-white text-sm font-medium">Create Group Workspace</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Node */}
                <div className="hero-node hero-node-right absolute right-[5%] md:right-[10%] top-[40px] md:top-[80px] w-[180px] bg-[#120B20]/90 backdrop-blur-xl border border-borders/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(150,113,255,0.1)] z-30 hidden md:block">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-white font-bold text-lg leading-tight mb-2 opacity-90">Automated<br />Expenses</div>
                        <div className="text-gray-500 text-[10px] uppercase font-mono tracking-widest flex justify-between w-full border-t border-borders/50 pt-2">
                            <span>Track</span>
                            <span>Split</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
