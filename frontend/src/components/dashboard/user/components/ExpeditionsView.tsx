import { FiArchive } from 'react-icons/fi';

const ExpeditionsView = () => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 mb-20">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-[-0.08em] uppercase leading-none">Journeys Archive</h1>
                    <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[11px] flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        Bespoke History | Past Explorations
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">All Time</button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all">2025</button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all">2024</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="group relative aspect-square rounded-4xl overflow-hidden border border-white/5 bg-white/2 hover:border-primary/40 transition-all duration-500">
                        <div className="absolute inset-0 bg-linear-to-t from-background-base via-transparent to-transparent z-10" />
                        <img 
                            src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?q=80&w=500&auto=format&fit=crop`} 
                            alt="Archive" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                        />
                        <div className="absolute bottom-8 left-8 right-8 z-20 space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Mission_0{i}</p>
                            <h3 className="text-xl font-black uppercase tracking-tight">Expedition Alpha {i}</h3>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Dec 2025</span>
                                <button className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-primary/20 hover:text-primary-light transition-all">
                                    <FiArchive className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ExpeditionsView;
