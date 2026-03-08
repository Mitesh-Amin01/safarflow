import React from 'react';
import founderMitesh from '../../assets/founder/founder-mitesh.png'; // Using provided founder image
import { FiArrowRight, FiMail, FiPhone, FiCalendar } from 'react-icons/fi'; // Icons for professional look

const ContactUsSection = () => {
    return (
        <section className="relative py-24 px-6 md:px-12 bg-background-base text-text-main font-sans">
            {/* Background Kinetic Glow - Matches 'Cosmos Tech' theme */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10 animate-pulse" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16 lg:gap-24">

                {/* --- Contact Info & Brand Content (Left Side) --- */}
                <div className="w-full lg:w-1/2 space-y-12">

                    {/* Founder & Message Container */}
                    <div className="relative group max-w-sm rounded-[2rem] overflow-hidden border border-borders bg-background-light p-6">
                        {/* Image: Greyed out initially, color on hover */}
                        <div className="relative rounded-2xl overflow-hidden mb-6 aspect-square">
                            <img
                                src={founderMitesh}
                                alt="Mitesh - Founder"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Theme Overlay - matches image_2 gradient overlay style */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background-base to-transparent opacity-80" />
                        </div>

                        {/* Text Block - Uses text-muted for that clean tech feel */}
                        <div className="space-y-3">
                            <span className="text-primary-light font-bold uppercase tracking-widest text-xs">Mitesh - Founder</span>
                            <p className="text-text-muted text-sm leading-relaxed">
                                I personally review all inquiries. Whether you're a startup or an enterprise, let's architect the next era.
                            </p>
                        </div>
                    </div>

                    {/* Reach Out Text & Info (replicates image_3 structure, theme applied) */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <span className="text-text-muted text-xs font-bold uppercase tracking-[0.2em]">Contact</span>
                            <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                                Get In<br />Touch
                            </h2>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-borders">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary-light">Project Collaboration & Inquiries</p>
                            <a href="mailto:hello@safarflow.dev" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-main hover:text-primary-light transition">
                                <FiMail className="text-primary" /> hello@safarflow.dev
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- Contact Form (Right Side) --- */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 rounded-[2.5rem] border border-borders bg-background-light/40 backdrop-blur-xl space-y-10 shadow-[0_0_50px_rgba(42,23,88,0.2)]">

                    <div className="space-y-4">
                        <h3 className="text-3xl font-extrabold tracking-tight text-text-main">Architect Your Vision</h3>
                        <p className="text-text-muted max-w-md">Tell us about your project or inquiry. We'll be in touch within 24 hours.</p>
                    </div>

                    {/* Modern Input Styling (matches form_image style, uses theme colors) */}
                    <form className="space-y-8">
                        <div className="space-y-6">
                            {['Name', 'Email Address', 'Company / Project Name'].map((label, i) => (
                                <div key={i} className="relative">
                                    <label className="absolute left-0 -top-3 text-xs font-bold uppercase tracking-widest text-text-muted transition-all">
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-12 pt-5 pb-1 bg-transparent border-b-2 border-borders focus:border-primary text-text-main placeholder-borders text-lg focus:outline-none focus:bg-background-base/50 px-2 transition"
                                        placeholder={`Enter your ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Textarea - Modern form factor */}
                        <div className="relative">
                            <label className="absolute left-0 -top-3 text-xs font-bold uppercase tracking-widest text-text-muted transition-all">
                                Project Message
                            </label>
                            <textarea
                                rows={5}
                                className="w-full pt-6 pb-2 bg-transparent border-b-2 border-borders focus:border-primary text-text-main placeholder-borders text-lg focus:outline-none focus:bg-background-base/50 px-2 transition resize-none"
                                placeholder="Describe your project, budget, and timeline"
                            ></textarea>
                        </div>

                        {/* Submit Button - Elevated from design image, now high-end tech button */}
                        <button type="submit" className="relative group flex w-full items-center justify-center gap-4 py-5 bg-text-main text-background-base font-black rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(150,113,255,0.4)]">
                            {/* White flash on hover */}
                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 skew-y-12 z-10" />

                            {/* Color layer - is always background-base but text becomes primary on hover */}
                            <div className="absolute inset-0 bg-background-base translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 delay-100 z-0" />

                            <span className="relative z-20 group-hover:text-primary-light transition-colors delay-100 uppercase tracking-widest text-sm">Send Inquiry</span>
                            <FiArrowRight className="relative z-20 group-hover:translate-x-2 transition-transform duration-300 delay-100 text-lg group-hover:text-primary-light" />
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
};

export default ContactUsSection;