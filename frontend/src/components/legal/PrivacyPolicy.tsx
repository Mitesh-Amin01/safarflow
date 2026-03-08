import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hero Entrance
        gsap.fromTo('.privacy-hero-text',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
        );

        // Scroll reveals for each section
        const sections = gsap.utils.toArray('.privacy-section') as HTMLElement[];
        sections.forEach((section) => {
            gsap.fromTo(section,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Parallax effect on the giant background numbers
            const number = section.querySelector('.bg-number');
            if (number) {
                gsap.to(number, {
                    y: -50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
        });

    }, { scope: containerRef });

    const policySections = [
        {
            id: "information-collection",
            number: "01",
            title: "Information Collection",
            content: (
                <div className="space-y-4">
                    <p>When you enter the SafarFlow ecosystem, we collect data to fuel your collaborative travel experience. This includes identy data (Name, Email), encrypted credentials, and orbital tracking data (IP Address, Device telemetry).</p>
                    <p>We do not collect unnecessary residual data. Your inputs are strictly utilized to synchronize your group itineraries and automate expense tracking.</p>
                </div>
            )
        },
        {
            id: "data-usage",
            number: "02",
            title: "Data Utilization",
            content: (
                <div className="space-y-4">
                    <p>Your telemetry is synthesized for one core directive: providing a flawless, real-time sync across your travel group. We process your inputs to construct itineraries, calculate shared debts, and maintain websocket connections.</p>
                    <p>SafarFlow does not sell your data to third-party data brokers. Your travel plans belong to you and your orbit.</p>
                </div>
            )
        },
        {
            id: "security",
            number: "03",
            title: "Platform Security",
            content: (
                <div className="space-y-4">
                    <p>We deploy military-grade encryption payloads to secure your data at rest and in transit. Our infrastructure is fortified against external breaches, ensuring your shared vaults and financial coordinates remain locked.</p>
                    <p>However, the safety of your orbit also depends on securing your own access ports. Never share your credentials.</p>
                </div>
            )
        },
        {
            id: "cookies",
            number: "04",
            title: "Tracker Beacons",
            content: (
                <div className="space-y-4">
                    <p>SafarFlow uses essential session beacons (cookies) to maintain your connection state and authentication tokens. These are not used for cross-site tracking or injected advertising.</p>
                </div>
            )
        },
        {
            id: "contact",
            number: "05",
            title: "Communication",
            content: (
                <div className="space-y-4">
                    <p>If you need to extract your data or close your port, initiate contact with our central command at <span className="text-primary-light">hello@safarflow.com</span>. We will process data deletion requests within standard compliance cycles.</p>
                </div>
            )
        }
    ];

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#05020A] text-text-main overflow-hidden font-sans pt-32 pb-32">

            {/* Ambient Background Grid & Orbs */}
            <div className="absolute inset-0 bg-[#05020A] bg-grid-white/[0.02] bg-size-[50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* Hero Header */}
                <div className="mb-20">
                    <p className="privacy-hero-text text-primary-light font-bold tracking-[0.3em] uppercase text-xs mb-4">SafarFlow Legal Directive</p>
                    <h1 className="privacy-hero-text text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        Privacy <br /> <span className="text-white/20">Protocol.</span>
                    </h1>
                </div>

                {/* Sub-Layout: Centered Content Area */}
                <div className="flex flex-col gap-16 lg:gap-24 relative max-w-4xl mx-auto">
                    
                    {/* Content Area */}
                    <div className="w-full space-y-32">
                        {policySections.map((sec) => (
                            <div key={sec.id} id={sec.id} className="privacy-section relative scroll-mt-32">

                                {/* Giant Background Number */}
                                <div className="bg-number absolute -top-10 -left-10 text-[8rem] md:text-[12rem] font-black text-white/3 select-none pointer-events-none z-0">
                                    {sec.number}
                                </div>

                                <div className="relative z-10 pl-4 border-l border-primary/30">
                                    <span className="text-xs font-mono text-primary tracking-widest mb-4 block">SECTION {sec.number}</span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{sec.title}</h2>
                                    <div className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                                        {sec.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="privacy-section pt-16 border-t border-white/10 relative">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                Protocol Last Updated: <span className="text-white">January 2026</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-2 max-w-md">
                                By engaging with SafarFlow modules, you consent to the data telemetry processes outlined in this directive.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default PrivacyPolicy;
