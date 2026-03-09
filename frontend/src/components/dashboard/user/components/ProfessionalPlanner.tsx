import { FiCpu } from 'react-icons/fi';

interface ProfessionalPlannerProps {
    user?: any;
}

const ProfessionalPlanner = ({ }: ProfessionalPlannerProps) => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10 relative">
            <header className="mb-20">
                <div className="space-y-4 text-left">
                    <h1 className="text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none font-heading text-white">
                        Professional <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary/40">Architect .</span>
                    </h1>
                    <p className="text-primary-light font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse ring-4 ring-primary/20" />
                        Neural Synthetic Planning // Phase 01
                    </p>
                </div>
            </header>

            <section className="space-y-12 pb-20">
                <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-16 group transition-all duration-500 hover:border-primary/30 min-h-[600px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20">
                        <div className="space-y-10 max-w-3xl text-left">
                            <div className="flex items-center gap-4 bg-primary/20 w-fit px-6 py-2.5 rounded-full border border-primary/30">
                                <FiCpu className="text-primary-light animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Quantum Logistics Engine</span>
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className="text-7xl font-black uppercase tracking-tighter leading-none font-heading text-white">
                                    The Future of <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Bespoke Travel</span>
                                </h2>
                                <p className="text-lg font-medium text-text-muted leading-relaxed max-w-xl">
                                    Our AI Architect is currently synthesizing millions of global data points—from real-time flight telemetry to hidden local gems—to build your perfect odyssey.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-6">
                                <button className="group relative px-12 py-6 bg-white text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.2)]">
                                    <span className="relative z-10">Initialize Neural Draft</span>
                                    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                                <div className="space-y-1">
                                    <span className="block text-[11px] font-black text-primary-light uppercase tracking-widest animate-pulse italic">Beta Access: Q3 2026</span>
                                    <span className="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Early Adopter Program Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full lg:w-[450px] aspect-square flex items-center justify-center">
                            {/* Orbital Rings */}
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                            <div className="absolute inset-10 border border-primary/20 rounded-full animate-reverse-spin" />
                            <div className="absolute inset-20 border border-secondary/10 rounded-full animate-spin-slow" />
                            
                            <div className="relative w-64 h-64 bg-linear-to-br from-primary via-secondary to-primary/40 rounded-[3rem] flex items-center justify-center shadow-[0_0_100px_rgba(150,113,255,0.4)] overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                <span className="text-8xl font-black text-white relative z-10">AI</span>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Floating Data Points */}
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div 
                                    key={i} 
                                    className="absolute w-2 h-2 bg-primary rounded-full blur-[1px] animate-pulse"
                                    style={{ 
                                        top: `${Math.random() * 100}%`, 
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${i * 0.7}s`
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { title: "Quantum Routing", desc: "Optimizing multi-city paths with real-time volatility analysis." },
                        { title: "Local Neural Sync", desc: "Accessing deep cultural data not indexed by traditional search." },
                        { title: "Fluid Logistics", desc: "Adaptive booking that reacts to global shifts instantly." }
                    ].map((feature, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white/3 border border-white/5 hover:border-primary/20 transition-all group">
                            <h4 className="text-xl font-black uppercase mb-4 text-white group-hover:text-primary-light transition-colors">{feature.title}</h4>
                            <p className="text-xs text-text-muted leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default ProfessionalPlanner;
