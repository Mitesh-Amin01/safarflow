

const ExpeditionsView = () => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10 text-left">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 mb-20">
                <div className="space-y-4">
                    <h1 className="text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none font-heading text-white">
                        Global <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary/40">Explorations .</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <p className="text-[#22c55e] font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse ring-4 ring-green-500/20" />
                            Live Community Sync // Network Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">Trending</button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all">Newest</button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all">Verified</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Tokyo Summit", city: "Tokyo, JP", viewers: "+42", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" },
                    { title: "Ibiza Pulse", city: "Ibiza, ES", viewers: "+128", img: "https://images.unsplash.com/photo-1577717582675-224930d75a45?q=80&w=800" },
                    { title: "Aspen Peak", city: "Aspen, US", viewers: "+15", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" },
                    { title: "Seoul Velocity", city: "Seoul, KR", viewers: "+89", img: "https://images.unsplash.com/photo-1538481199705-c710c4e963fc?q=80&w=800" },
                    { title: "Berlin Brutal", city: "Berlin, DE", viewers: "+234", img: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=800" },
                    { title: "Cairo Nexus", city: "Cairo, EG", viewers: "+56", img: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800" },
                ].map((item, i) => (
                    <div key={i} className="group relative aspect-4/5 rounded-4xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale hover:grayscale-0" />
                        <div className="absolute inset-0 bg-linear-to-t from-background-base via-background-base/20 to-transparent z-10" />
                        <div className="absolute bottom-8 left-8 right-8 z-20 space-y-2">
                            <h4 className="text-2xl font-black uppercase tracking-tight text-white">{item.title}</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">{item.city}</p>
                                <p className="text-[10px] font-black text-text-muted">{item.viewers} Viewers</p>
                            </div>
                            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary transition-all">Clone Itinerary</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ExpeditionsView;
