import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaPlus } from 'react-icons/fa';
import logo from '../../assets/logo/logo.png';
import { useAuth } from '../../utils/AuthContext';


export default function Navbar() {
    const navContainerRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();


    // Scroll opacity functionality
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initial Navbar Entrance Animation
    useGSAP(() => {
        gsap.fromTo('.nav-brand', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
        gsap.fromTo('.nav-center', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out' });
        gsap.fromTo('.nav-cta', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' });
    }, { scope: navContainerRef });

    // Menu Toggle Timeline Setup
    useGSAP(() => {
        // Setup the master timeline, paused by default
        const tl = gsap.timeline({ paused: true });

        // 1. Unclip the overlay from top to bottom
        tl.to(overlayRef.current, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'expo.inOut',
        })
            // 2. Stagger text link entrance
            .fromTo('.menu-link-item',
                { y: 50, opacity: 0, rotateX: -20 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' },
                "-=0.9"
            )
            // 3. Info text entrance
            .fromTo('.menu-info',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
                "-=0.9"
            )
            // 4. Image cards fade/slide in
            .fromTo('.menu-media',
                { scale: 1.05, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' },
                "-=1.1"
            );

        tlRef.current = tl;
    }, { scope: navContainerRef });

    // Handle menu state changes
    useEffect(() => {
        if (!tlRef.current) return;

        if (menuOpen) {
            tlRef.current.play();
            // Optional: lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            tlRef.current.reverse();
            document.body.style.overflow = 'auto';
        }

        return () => { document.body.style.overflow = 'auto'; };
    }, [menuOpen]);

    const navLinks = [
        { name: 'Home', path: '/#' },
        { name: 'About', path: '/#about' },
        { name: 'Feature', path: '/#features' },
        { name: 'How it Work', path: '/#how-it-works' },
        { name: 'Contact', path: '/contact-us' },
        ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    ];

    const closeMenu = () => setMenuOpen(false);

    return (
        <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-50">

            {/* Top Bar relative z-index needs to be higher than overlay so it's always clickable */}
            <div className={`relative z-50 w-full transition-colors duration-300 ${menuOpen ? 'bg-[#0a0512]' : isScrolled ? 'bg-background-base/95 backdrop-blur-xl border-b border-borders/30' : 'bg-transparent border-b border-transparent'}`}>
                <div className="flex h-[90px] md:h-[100px] items-center justify-between px-6 md:px-12 lg:px-20 mx-auto max-w-[1800px]">

                    {/* Left: Logo */}
                    <Link to="/" className="w-48 text-left z-50 group flex flex-col justify-center nav-brand" onClick={closeMenu}>
                        <img
                            src={logo}
                            alt="SafarFlow Logo"
                            className="h-10 md:h-30 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </Link>

                    {/* Middle: Custom Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="nav-center z-50 group flex items-center justify-center gap-4 text-sm font-semibold tracking-widest text-white uppercase -ml-8 md:ml-0"
                    >
                        <span className="w-12 text-right cursor-pointer">{menuOpen ? 'CLOSE' : 'MENU'}</span>
                        <div className="relative flex items-center justify-center w-5 h-5 cursor-pointer">
                            <span className={`absolute h-[1.5px] bg-white transition-all duration-300 origin-center  ${menuOpen ? 'w-full rotate-45' : 'w-full -translate-y-1'}`}></span>
                            <span className={`absolute h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'w-full -rotate-45' : 'w-full translate-y-1'}`}></span>
                        </div>
                    </button>

                    {/* Right: Solid Action Button */}
                    <div className="hidden md:flex items-center justify-end z-50 w-48 nav-cta">
                        <Link
                            to={user ? "/dashboard" : "/signup"}
                            onClick={closeMenu}
                            className="flex items-stretch bg-primary text-white font-semibold uppercase tracking-[0.15em] text-[10px] hover:bg-primary-light transition-colors"
                        >
                            <span className="px-5 py-2 flex items-center">
                                {user ? "Dashboard" : "Let's Work Together"}
                            </span>
                            <div className="border-l border-white/20 px-4 py-4 flex flex-col justify-center items-center">
                                <FaPlus className="text-white text-sm" />
                            </div>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Menu Overlay Container (85vh approx like reference) */}
            <div
                ref={overlayRef}
                className="fixed top-0 left-0 right-0 z-40 bg-[#0e071b] border-b border-borders/50 h-screen flex flex-col pt-[100px]"
                style={{
                    // Initial state: clipped to the top line (invisible)
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
                }}
            >
                {/* Scrollable content area */}
                <div className="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-20 mx-auto max-w-[1800px] pb-12 no-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 h-full pt-4 md:pt-12">

                        {/* 1. Huge Navigation Links (Left) */}
                        <div className="lg:col-span-4 flex flex-col justify-start gap-1">
                            {navLinks.map((item) => (
                                <div key={item.name} className="overflow-hidden flex items-center group">
                                    <div className={`w-6 h-6 shrink-0 mt-3 mr-6 ${location.pathname === item.path ? 'bg-primary' : 'bg-transparent'}`}></div>
                                    <HashLink
                                        smooth
                                        to={item.path}
                                        onClick={closeMenu}
                                        className={`menu-link-item block text-[4rem] sm:text-[4.5rem] lg:text-[5rem] font-medium tracking-tight transition-colors duration-200 leading-[1.1] ${location.pathname + location.hash === item.path ? 'text-primary' : 'text-white hover:text-gray-300'}`}
                                    >
                                        {item.name}
                                    </HashLink>
                                </div>
                            ))}
                        </div>

                        {/* 2. Contact and Info (Middle) */}
                        <div className="lg:col-span-3 flex flex-col justify-start gap-12 text-[13px] text-gray-300 mt-6 tracking-wide ml-0 lg:ml-8">
                            <div className="menu-info">
                                <h4 className="uppercase text-gray-500 font-mono mb-4 text-[10px] tracking-[0.2em] font-semibold">Contact & Social</h4>
                                <a href="mailto:hello@safarflow.com" className="block mb-8 hover:text-primary transition-colors cursor-pointer text-lg font-medium text-white">hello@safarflow.com</a>

                                <a href="https://www.instagram.com/er_mitesh_amin" className="block mb-2 hover:text-primary transition-colors cursor-pointer">Instagram</a>
                                <a href="https://www.linkedin.com/in/mitesh-amin/" className="block mb-2 hover:text-primary transition-colors cursor-pointer">LinkedIn</a>
                                <a href="https://x.com/MITESHAMIN001" className="block mb-2 hover:text-primary transition-colors cursor-pointer">Twitter</a>
                                <a href="https://github.com/Mitesh-Amin01" className="block hover:text-primary transition-colors cursor-pointer">GitHub</a>
                            </div>

                            <div className="menu-info mt-2">
                                <h4 className="uppercase text-gray-500 font-mono mb-4 text-[10px] tracking-[0.2em] font-semibold">Platform Status</h4>

                                <div className="flex gap-4 items-start mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-[5px] shrink-0 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-gray-300 max-w-[200px] leading-relaxed">System Online. All Services Operational.</p>
                                </div>
                                <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-[5px] shrink-0"></div>
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-primary max-w-[200px] leading-relaxed">Designing the Next Era of Travel.</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Image Display Cards (Right) */}
                        <div className="lg:col-span-5 flex flex-row gap-6 h-[400px] md:h-[500px]">

                            <div className="flex-1 flex flex-col gap-4">
                                <div className="menu-media group relative w-full h-full overflow-hidden bg-[#1e1035] cursor-pointer">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                                        alt="Studio"
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest menu-media-text pl-1">About the Studio</p>
                            </div>

                            <div className="flex-1 flex flex-col gap-4">
                                <div className="menu-media group relative w-full h-full overflow-hidden bg-[#1e1035] cursor-pointer">
                                    <img
                                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                                        alt="Featured Project"
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest menu-media-text pl-1">Featured Project</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
