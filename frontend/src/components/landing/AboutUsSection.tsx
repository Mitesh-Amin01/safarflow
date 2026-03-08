import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import founderMitesh from '../../assets/founder/founder-mitesh.png';

gsap.registerPlugin(ScrollTrigger);

const AboutUsSection = () => {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Skill bar animation
        gsap.from(".skill-progress", {
            width: 0,
            duration: 1.5,
            ease: "power4.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".skills-grid",
                start: "top 85%",
            }
        });

        // Counter animation
        gsap.from(".stat-number", {
            textContent: 0,
            duration: 2,
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 85%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="relative py-24 px-6 bg-background-base text-text-main font-sans">
            <div className="max-w-7xl mx-auto space-y-32">

                {/* --- Section 1: About Us --- */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden border border-borders group">
                            <img
                                src={founderMitesh}
                                alt="Founder"
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-base/80 to-transparent opacity-60" />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-6">
                        <span className="text-primary-light font-bold uppercase tracking-[0.2em] text-sm">About Us</span>
                        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter">
                            We Always Make <br /> The Best
                        </h2>
                        <p className="text-text-muted leading-relaxed text-lg max-w-xl">
                            With over 15 years of expertise in UI/UX and digital architecture, we bridge the gap between complex functionality and stunning aesthetics. Our mission is to define the next era of digital experiences.
                        </p>
                        <button className="px-8 py-3 bg-text-main text-background-base font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* --- Section 2: Our Skills & Stats --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Skills Side */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-bold tracking-tight">Our Skills</h3>
                            <p className="text-text-muted max-w-md">
                                Mastering the tools that drive the future of web and design interfaces.
                            </p>
                        </div>

                        <div className="skills-grid space-y-8">
                            {[
                                { name: "UI/UX Design", value: "95%" },
                                { name: "Web Development", value: "90%" },
                                { name: "System Architecture", value: "85%" }
                            ].map((skill, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                        <span>{skill.name}</span>
                                        <span className="text-primary-light">{skill.value}</span>
                                    </div>
                                    <div className="h-[2px] w-full bg-borders relative">
                                        <div
                                            className="skill-progress absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(150,113,255,0.8)]"
                                            style={{ width: skill.value }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Side */}
                    <div className="stats-grid grid grid-cols-2 gap-y-16 gap-x-8 pt-12 lg:pt-20">
                        {[
                            { label: "Years Of Experience", value: 15, suffix: "+" },
                            { label: "Projects Done", value: 1000, suffix: "+" },
                            { label: "Satisfied Clients", value: 300, suffix: "+" },
                            { label: "Certified Awards", value: 64, suffix: "" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-5xl md:text-6xl font-black tracking-tighter">
                                    <span className="stat-number">{stat.value}</span>{stat.suffix}
                                </h4>
                                <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Section 3: Call to Action Frame --- */}
                <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden border border-borders group">
                    <div className="absolute inset-0 bg-background-light/40 backdrop-blur-sm z-10" />

                    {/* Placeholder for your background shot */}
                    <img
                        src="https://images.unsplash.com/photo-1492691523567-6170c817838a?q=80&w=2070"
                        alt="Action Shot"
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 transition-transform duration-[2s]"
                    />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 space-y-8">
                        <div className="space-y-4">
                            <span className="text-primary-light font-bold uppercase tracking-widest text-xs">Hire Us Now</span>
                            <h2 className="text-4xl md:text-6xl font-black max-w-3xl leading-tight tracking-tighter">
                                We Are Always Ready To <br /> Take A Perfect Shot
                            </h2>
                        </div>
                        <button className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-xl active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUsSection;