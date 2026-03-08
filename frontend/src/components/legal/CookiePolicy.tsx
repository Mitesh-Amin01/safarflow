import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CookiePolicy = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hero Entrance
        gsap.fromTo('.cookie-hero-text',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
        );

        // Scroll reveals for each section
        const sections = gsap.utils.toArray('.cookie-section') as HTMLElement[];
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

    const cookieSections = [
        {
            id: "what-are-cookies",
            number: "01",
            title: "What Are Cookies",
            content: (
                <div className="space-y-4">
                    <p>As is common practice with almost all professional web platforms, SafarFlow utilizes cookies. These are microscopic data files implanted into your browser cache to enhance the fluidity and personalization of your experience.</p>
                    <p>This protocol details the specific data telemetry these files gather, why their presence is critical for our operations, and how you can override and prevent these files from being stored (though doing so may fracture core platform functionalities).</p>
                </div>
            )
        },
        {
            id: "how-we-use",
            number: "02",
            title: "How We Use Cookies",
            content: (
                <div className="space-y-4">
                    <p>SafarFlow deploys cookies for a matrix of critical operations detailed below. In the vast majority of cases, disabling cookies terminates the advanced features and integrations they synchronize.</p>
                    <p>If you are uncertain whether a cookie is strictly necessary for a service you consume, protocol dictates leaving them enabled to ensure uninterrupted access.</p>
                </div>
            )
        },
        {
            id: "disabling-cookies",
            number: "03",
            title: "Overriding Beacons",
            content: (
                <div className="space-y-4">
                    <p>You can sever cookie injection by modifying your browser's security settings (consult your browser's manual). Be warned: disabling cookies will critically degrade the operational efficiency of SafarFlow and many other platforms you frequent.</p>
                    <p>Deactivating cookies inherently disables certain user-interface tools and real-time collaboration nodes on this site. We heavily recommend maintaining default cookie reception.</p>
                </div>
            )
        },
        {
            id: "the-cookies-we-set",
            number: "04",
            title: "The Cookies We Set",
            content: (
                <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Protocols:</strong> If you forge an account with us, cookies manage the signup sequencing and general authentication state. These are typically purged upon logout, but occasionally persist to recall site parameters.</li>
                        <li><strong>Login Telemetry:</strong> Cookies ensure the system remembers you are securely docked, preventing the requirement to authenticate upon rotating to every new page.</li>
                        <li><strong>Preferences Matrix:</strong> To provide you with a tailored experience, we store cookies to remember your display and UI preferences when interacting with SafarFlow's dashboards.</li>
                    </ul>
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
                    <p className="cookie-hero-text text-primary-light font-bold tracking-[0.3em] uppercase text-xs mb-4">SafarFlow Legal Directive</p>
                    <h1 className="cookie-hero-text text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        Cookie <br /> <span className="text-white/20">Policy.</span>
                    </h1>
                </div>

                {/* Sub-Layout: Centered Content Area */}
                <div className="flex flex-col gap-16 lg:gap-24 relative max-w-4xl mx-auto">
                    
                    {/* Content Area */}
                    <div className="w-full space-y-32">
                        {cookieSections.map((sec) => (
                            <div key={sec.id} id={sec.id} className="cookie-section relative scroll-mt-32">
                                
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

                        <div className="cookie-section pt-16 border-t border-white/10 relative">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                Protocol Last Updated: <span className="text-white">January 2026</span>
                            </p>
                            <p className="text-xs text-gray-600 mt-2 max-w-md">
                                By utilizing SafarFlow services, you permit the utilization of standard telemetry and session cookies as dictated by this protocol.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default CookiePolicy;
