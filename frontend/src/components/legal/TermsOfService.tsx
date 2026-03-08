import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TermsOfService = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hero Entrance
        gsap.fromTo('.terms-hero-text',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
        );

        // Scroll reveals for each section
        const sections = gsap.utils.toArray('.terms-section') as HTMLElement[];
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

    const termsSections = [
        {
            id: "acceptance",
            number: "01",
            title: "Protocol Acceptance",
            content: (
                <div className="space-y-4">
                    <p>Welcome to the SafarFlow network. By accessing this terminal and utilizing our platform tools, you agree to be bound by these Terms of Service.</p>
                    <p>If you disagree with any part of these protocols, do not proceed. Continued use of SafarFlow constitutes absolute acceptance of all conditions outlined herein.</p>
                </div>
            )
        },
        {
            id: "license",
            number: "02",
            title: "Operational License",
            content: (
                <div className="space-y-4">
                    <p>Unless explicitly stated, SafarFlow and its creators own all intellectual property rights for the platform materials. These rights are protected and reserved globally.</p>
                    <p>You are granted a temporary, non-exclusive license to utilize SafarFlow for personal travel coordination. You may not republish, sell, rent, sub-license, or reverse-engineer any component of this architecture.</p>
                </div>
            )
        },
        {
            id: "user-accounts",
            number: "03",
            title: "User Terminals",
            content: (
                <div className="space-y-4">
                    <p>Creating an account within SafarFlow requires the submission of precise and current telemetry. Falsified data constitutes a protocol breach and will result in immediate termination of network access.</p>
                    <p>You are entirely responsible for safeguarding your authentication credentials. SafarFlow cannot and will not be liable for any loss or damage arising from your failure to secure your access port.</p>
                </div>
            )
        },
        {
            id: "liability",
            number: "04",
            title: "System Liability",
            content: (
                <div className="space-y-4">
                    <p>SafarFlow operates on an "as is" and "as available" basis. We do not warrant that the network will be uninterrupted, flawlessly secure, or completely devoid of errors.</p>
                    <p>Under no circumstance shall SafarFlow be held liable for indirect, incidental, or consequential damages resulting from the use or inability to use our systems.</p>
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
                    <p className="terms-hero-text text-primary-light font-bold tracking-[0.3em] uppercase text-xs mb-4">SafarFlow Legal Directive</p>
                    <h1 className="terms-hero-text text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        Terms <br /> <span className="text-white/20">Of Service.</span>
                    </h1>
                </div>

                {/* Sub-Layout: Centered Content Area */}
                <div className="flex flex-col gap-16 lg:gap-24 relative max-w-4xl mx-auto">
                    
                    {/* Content Area */}
                    <div className="w-full space-y-32">
                        {termsSections.map((sec) => (
                            <div key={sec.id} id={sec.id} className="terms-section relative scroll-mt-32">
                                
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

                        <div className="terms-section pt-16 border-t border-white/10 relative">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                Protocol Last Updated: <span className="text-white">January 2026</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-2 max-w-md">
                                SafarFlow reserves the right to modify these terms at any time. Continued use of the platform indicates explicit agreement to the altered protocols.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default TermsOfService;
