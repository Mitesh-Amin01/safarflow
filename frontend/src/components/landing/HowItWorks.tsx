import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPlus, FaUserFriends, FaMapMarkedAlt } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate nodes in
        tl.fromTo('.step-node',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.3, ease: 'power3.out' }
        );

        // Continuous line flow animation
        gsap.to('.flow-line-steps', {
            strokeDashoffset: "-=100",
            duration: 2.5,
            repeat: -1,
            ease: "linear"
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-background relative z-10 py-24 px-6 md:px-12 lg:px-20 mx-auto max-w-[1800px] overflow-hidden">

            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-background pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,rgba(150,113,255,0.05)_0%,transparent_70%)]"></div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16 lg:gap-24">

                {/* Section Header */}
                <div className="text-center relative z-20 flex flex-col items-center">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#FF90E8] animate-pulse shadow-[0_0_10px_rgba(255,144,232,0.8)]"></span>
                        <span className="text-xs font-semibold tracking-widest text-[#FF90E8] uppercase">Simple Process</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight relative">
                        How It <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#FF90E8] relative z-10">Works</span>
                        {/* Glow behind "Works" */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/30 blur-2xl -z-10 rounded-full"></span>
                    </h2>
                </div>

                {/* 3-Step Visual Container */}
                <div className="relative w-full min-h-[400px] lg:min-h-[500px] flex flex-col lg:flex-row items-center justify-between lg:px-10">

                    {/* Connecting SVG Lines (Desktop) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0" preserveAspectRatio="none" viewBox="0 0 1000 500">
                        {/* Static Track 1 -> 2 */}
                        <path d="M 166 250 C 333 250, 333 150, 500 150" fill="none" stroke="rgba(150,113,255,0.2)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

                        {/* Animated Flow 1 -> 2 */}
                        <path d="M 166 250 C 333 250, 333 150, 500 150" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line-steps" style={{ filter: 'drop-shadow(0 0 8px rgba(150,113,255,0.8))' }} />

                        {/* Static Track 2 -> 3 */}
                        <path d="M 500 150 C 666 150, 666 350, 833 350" fill="none" stroke="rgba(150,113,255,0.2)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

                        {/* Animated Flow 2 -> 3 */}
                        <path d="M 500 150 C 666 150, 666 350, 833 350" fill="none" stroke="#BCA3FF" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength="100" strokeDasharray="5 100" strokeDashoffset="-85" className="flow-line-steps" style={{ filter: 'drop-shadow(0 0 8px rgba(150,113,255,0.8))' }} />
                    </svg>

                    {/* Step 1 */}
                    <div className="step-node relative z-10 flex flex-col items-center max-w-[280px] text-center mb-16 lg:mb-0 lg:mt-32">
                        <div className="relative group w-32 h-32 mb-8">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 group-hover:blur-2xl transition-all duration-500"></div>
                            {/* Inner Node */}
                            <div className="relative w-full h-full rounded-full bg-[#0A0512] border border-borders group-hover:border-primary flex items-center justify-center shadow-[inset_0_0_20px_rgba(150,113,255,0.1)] transition-all duration-500 z-10">
                                <FaPlus className="text-3xl text-primary group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#120B20] border border-primary text-white flex items-center justify-center font-mono text-sm font-bold shadow-[0_0_10px_rgba(150,113,255,0.5)]">1</div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Create Trip</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Start a new journey instantly with a single tap. Set your dates, destination, and initial ideas.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="step-node relative z-10 flex flex-col items-center max-w-[280px] text-center mb-16 lg:mb-0 lg:-mt-36">
                        <div className="relative group w-32 h-32 mb-8">
                            <div className="absolute inset-0 rounded-full bg-[#FF90E8]/20 blur-xl group-hover:bg-[#FF90E8]/40 group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative w-full h-full rounded-full bg-[#0A0512] border border-borders group-hover:border-[#FF90E8] flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,144,232,0.1)] transition-all duration-500 z-10">
                                <FaUserFriends className="text-4xl text-[#FF90E8] group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#120B20] border border-[#FF90E8] text-white flex items-center justify-center font-mono text-sm font-bold shadow-[0_0_10px_rgba(255,144,232,0.5)]">2</div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Invite Friends</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Share the secure link and watch your crew join effortlessly across all their platforms.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="step-node relative z-10 flex flex-col items-center max-w-[280px] text-center lg:mt-96">
                        <div className="relative group w-32 h-32 mb-8">
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative w-full h-full rounded-full bg-[#0A0512] border border-borders group-hover:border-primary flex items-center justify-center shadow-[inset_0_0_20px_rgba(150,113,255,0.1)] transition-all duration-500 z-10">
                                <FaMapMarkedAlt className="text-3xl text-primary group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#120B20] border border-primary text-white flex items-center justify-center font-mono text-sm font-bold shadow-[0_0_10px_rgba(150,113,255,0.5)]">3</div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Build Itinerary</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Collaboratively add places to go, vote on activities, and instantly finalize the perfect plan.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
