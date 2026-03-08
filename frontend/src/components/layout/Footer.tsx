import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoImage from '../../assets/logo/logo.png';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        tl.fromTo('.footer-reveal',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );

        tl.fromTo('.footer-logo-reveal',
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
            "-=0.4"
        );

    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="relative w-full min-h-screen bg-[#05020A] pt-24 pb-8 overflow-hidden flex flex-col justify-between">

            {/* Ambient Background Glows */}
            <div className="absolute bottom-0 right-0 w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_bottom_right,rgba(150,113,255,0.15),transparent_50%)] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_bottom_left,rgba(255,144,232,0.08),transparent_50%)] pointer-events-none z-0"></div>

            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 z-10 flex flex-col pt-12">

                {/* (Removed Contact Us Eyebrow per user request) */}

                {/* Massive CTA Text and Button container */}
                <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 xl:gap-8 mb-24 footer-reveal">

                    {/* Text */}
                    <h2 className="text-4xl md:text-6xl lg:text-[4.5rem] font-medium leading-[1.1] tracking-tight max-w-[1050px]">
                        <span className="text-white">Interested in working together, </span>
                        <span className="text-gray-500 hover:text-gray-400 transition-colors">trying out the platform or simply learning more?</span>
                    </h2>

                    {/* Button */}
                    <button className="group flex items-center justify-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-white/10 text-white rounded-full px-8 py-4 md:py-3 pr-4 md:pr-3 transition-all duration-300 shadow-[0_0_30px_rgba(150,113,255,0.1)] hover:shadow-[0_0_40px_rgba(150,113,255,0.25)] shrink-0 self-start xl:self-auto xl:mb-4">
                        <span className="text-lg font-medium tracking-wide pl-2">Get Started</span>
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white relative overflow-hidden">
                            <svg className="w-5 h-5 absolute transform group-hover:translate-x-8 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <svg className="w-5 h-5 absolute transform -translate-x-8 group-hover:translate-x-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </button>

                </div>

                {/* Middle Info & Links */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 w-full footer-reveal">

                    {/* Contact Email */}
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-400 text-sm">Contact us at:</span>
                        <a href="mailto:hello@safarflow.com" className="text-white text-2xl lg:text-3xl font-medium tracking-wide hover:text-primary transition-colors flex items-center gap-2 group">
                            hello@safarflow.com
                            <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5M19 5v10M19 5H9" />
                            </svg>
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap items-center justify-start md:justify-end gap-x-6 gap-y-4 lg:gap-8 max-w-[600px]">
                        <a href="#" className="text-white hover:text-primary text-md lg:text-lg font-medium transition-colors">How It Works</a>
                        <a href="#" className="text-white hover:text-primary text-md lg:text-lg font-medium transition-colors">Powerful Features</a>
                        <a href="#" className="text-white hover:text-primary text-md lg:text-lg font-medium transition-colors">About</a>
                        <a href="/contact-us" className="text-white hover:text-primary text-md lg:text-lg font-medium transition-colors">Contact</a>
                    </div>
                </div>
            </div>

            {/* Bottom Section (Massive Logo & Copyright) */}
            <div className="w-full relative z-10 mt-auto pt-20 px-6 md:px-12 lg:px-20 flex flex-col items-center">

                {/* Massive Logo */}
                <div className="w-full flex justify-center mb-10 footer-logo-reveal">
                    <img
                        src={logoImage}
                        alt="SafarFlow Logo"
                        className="w-full object-contain filter brightness-200"
                        style={{ maxHeight: '40vh' }}
                    />
                </div>

                {/* Footer Bottom Bar */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-xs font-medium text-gray-500 pb-2 footer-reveal">
                    <div className="whitespace-nowrap">© 2026 SafarFlow. All rights reserved.</div>

                    {/* Legal Links (Center) */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>

                    {/* Social Links (Right) */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>

        </footer>
    );
}
