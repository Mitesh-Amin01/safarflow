import { useRef, useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiUser, FiMail, FiLock, FiArrowRight, FiTarget, FiZap, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { loginUser, googleAuthSync, verifyOTP } from '../../services/auth.service';
import { useAuth } from '../../utils/AuthContext';
import FullScreenLoader from '../ui/FullScreenLoader';

import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, login, loading: authLoading } = useAuth();
    const container = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user && !authLoading) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleGoogleAuthCode = async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await googleAuthSync({
                code,
                redirectUri: window.location.origin + "/login"
            });
            if (data.success) {
                login(data.data.user);
                setSuccess("Access Granted. Redirecting...");
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Google authentication failed");
            setLoading(false);
        }
    };

    const handleGoogleAuth = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: window.location.origin + "/login",
        onError: () => setError("Google Login Failed")
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            window.history.replaceState({}, document.title, window.location.pathname);
            handleGoogleAuthCode(code);
        }
    }, [navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await loginUser(formData);
            
            if (data.data && data.data.requires2FA) {
                setIsVerifying(true);
                setSuccess("Security check required. OTP Sent.");
                setLoading(false);
                return;
            }

            login(data.data.user);
            setSuccess("Access Granted. Redirecting...");

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await verifyOTP({
                email: formData.email,
                otp
            });

            if (data.success) {
                login(data.data.user);
                setSuccess("Security verified. Redirecting...");
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed. Please try again.");
            setLoading(false);
        }
    };

    useGSAP(() => {
        if (authLoading) return;
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

            {loading && <FullScreenLoader message="AUTHENTICATING..." />}

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
            <div className="login-pod relative z-10 w-full max-w-[1100px] min-h-[700px] flex flex-col md:flex-row bg-background-light/20 backdrop-blur-3xl border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] mx-6 my-12 mt-22">

                {/* Visual Accent Side */}
                <div className="hidden md:flex w-5/12 bg-linear-to-br from-primary/10 to-transparent p-12 flex-col justify-between border-r border-white/5">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40">
                            <FiZap className="text-primary text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold pt-4 text-text-main leading-tight">Welcome Back</h3>
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
                <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-background-base/40">
                    {!isVerifying ? (
                        <>
                            <div className="mb-10 space-y-2 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tight text-text-main uppercase">Login</h2>
                        <p className="text-text-muted text-sm">Access your collaborative travel workspace.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-4 duration-500">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-in fade-in slide-in-from-top-4 duration-500">
                            {success}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hello@safar.flow"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-base md:text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full mt-8 bg-white text-background-base font-black py-5 rounded-4xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0" />
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-300">
                                {loading ? "AUTHENTICATING..." : "LOGIN"} <FiArrowRight />
                            </span>
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-background-base px-4 text-text-muted">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleGoogleAuth()}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold group disabled:opacity-50"
                    >
                        <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                        <span>{loading ? "AUTHENTICATING..." : "Login with Google"}</span>
                    </button>

                    <p className="mt-8 text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                        Need an account? <Link to="/signup" className="text-primary-light cursor-pointer hover:text-white transition-colors">Create Account</Link>
                    </p>
                        </>
                    ) : (
                        <div className="max-w-md mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-center space-y-4">
                                <div className="inline-flex w-20 h-20 rounded-3xl bg-primary/20 border border-primary/40 items-center justify-center mb-4">
                                    <FiCheckCircle className="text-4xl text-primary" />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Security Check</h2>
                                <p className="text-text-muted text-sm px-8">We've sent a 6-digit authentication code to <br /><span className="text-primary-light font-bold">{formData.email}</span></p>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-sm text-center font-bold">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl py-8 text-center text-4xl font-black tracking-[0.5em] focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-white placeholder:text-white/10"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6 || (success !== null && success.includes("verified"))}
                                    className="group relative w-full bg-primary text-white font-black py-5 rounded-4xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-[0_20px_40px_rgba(109,40,217,0.3)] disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {loading ? "VERIFYING..." : "CONFIRM CODE"} <FiArrowRight />
                                    </span>
                                </button>
                            </form>

                            <button
                                onClick={() => { setIsVerifying(false); setSuccess(null); setError(null); }}
                                className="w-full text-center text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
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
