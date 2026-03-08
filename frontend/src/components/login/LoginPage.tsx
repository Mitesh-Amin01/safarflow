import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiUser, FiMail, FiLock, FiArrowRight, FiTarget, FiZap, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
    const container = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // 1. Initial background warp
        tl.from(".bg-glow", { scale: 0, opacity: 0, duration: 2, stagger: 0.2 })

            // 2. Kinetic Title Masking
            .from(".kinetic-title span", {
                yPercent: 100,
                duration: 1,
                stagger: 0.1,
            }, "-=1")

            // 3. Float in the Login "Pod"
            .from(".login-pod", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                backdropFilter: "blur(0px)",
            }, "-=0.8");

        // Subtle continuous orbit for the background
        gsap.to(orbitRef.current, {
            rotation: 360,
            duration: 50,
            repeat: -1,
            ease: "none"
        });
    }, { scope: container });

    return (
        <main ref={container} className="relative min-h-screen w-full bg-background-base overflow-hidden flex items-center justify-center font-sans selection:bg-primary selection:text-white">

            {/* --- Level 1: Atmospheric Background --- */}
            <div ref={orbitRef} className="absolute inset-0 pointer-events-none">
                <div className="bg-glow absolute top-[-10%] left-[10%] w-[60vw] h-[60vw] bg-primary/10 blur-[180px] rounded-full" />
                <div className="bg-glow absolute bottom-[-20%] right-[5%] w-[50vw] h-[50vw] bg-primary-dark/15 blur-[150px] rounded-full" />
            </div>

            {/* Grid Overlay with Radial Fade */}
            <div className="absolute inset-0 opacity-10 mask-[radial-gradient(ellipse_at_center,black,transparent_80%)] border-white/5 border-x border-y bg-size-[40px_40px] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]" />

            {/* --- Level 2: Kinetic Branding (Behind Form) --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none pointer-events-none z-0">
                <h1 className="kinetic-title text-[15vw] font-black leading-none tracking-tighter text-white/3 uppercase inline-flex overflow-hidden">
                    <span>S</span><span>A</span><span>F</span><span>A</span><span>R</span>
                </h1>
                <div className="flex justify-center gap-[5vw]">
                    <h1 className="kinetic-title text-[15vw] font-black leading-none tracking-tighter text-white/3 uppercase inline-flex overflow-hidden italic">
                        <span>F</span><span>L</span><span>O</span><span>W</span>
                    </h1>
                </div>
            </div>

            {/* --- Level 3: The Login "Pod" (The Interface) --- */}
            <div className="login-pod relative z-10 w-full max-w-[1100px] aspect-video md:aspect-16/8 flex flex-col md:flex-row bg-background-light/20 backdrop-blur-3xl border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] mx-6 mt-18">

                {/* Visual Accent Side */}
                <div className="hidden md:flex w-5/12 bg-linear-to-br from-primary/10 to-transparent p-12 flex-col justify-between border-r border-white/5">
                    <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40">
                            <FiZap className="text-primary text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold pt-4 text-text-main">Welcome Back</h3>
                        <p className="text-text-muted text-sm leading-relaxed">Access your synchronized travel itineraries and group expenses in real-time.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: FiTarget, text: "Smart Itineraries" },
                            { icon: FiUser, text: "Automated Expenses" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light">
                                <item.icon /> <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-background-base/40">
                    <div className="mb-10 space-y-2 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tight text-text-main uppercase">Login</h2>
                        <p className="text-text-muted text-sm">Access your collaborative travel workspace.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg" />
                                    <input type="email" placeholder="hello@safar.flow" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-base md:text-lg" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-12 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-base md:text-lg tracking-widest font-mono" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1"
                                    >
                                        {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="group relative w-full mt-8 bg-white text-background-base font-black py-5 rounded-4xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                            <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0" />
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-300">
                                LOGIN <FiArrowRight />
                            </span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                        Need an account? <Link to="/signup" className="text-primary-light cursor-pointer hover:text-white transition-colors">Create Account</Link>
                    </p>
                </div>
            </div>

            {/* Floating Cyber Elements */}
            <div className="absolute top-10 right-10 flex-col items-end gap-1 opacity-20 hidden lg:flex">
                <div className="h-[2px] w-20 bg-primary" />
                <div className="h-[2px] w-12 bg-primary" />
                <span className="text-[8px] font-black text-primary tracking-[0.5em] mt-2">ORBITAL_SYNC_ACTIVE</span>
            </div>

        </main>
    );
};

export default LoginPage;
