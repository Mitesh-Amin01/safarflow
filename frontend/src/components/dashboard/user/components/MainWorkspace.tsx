import { FiSearch, FiPlusCircle, FiEdit3, FiTrash2 } from 'react-icons/fi';

interface Trip {
    id: number;
    title: string;
    date: string;
    progress: number;
    activities: string;
    status: string;
    img: string;
}

interface MainWorkspaceProps {
    trips: Trip[];
}

const MainWorkspace = ({ trips }: MainWorkspaceProps) => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-10 z-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase">Hello, Mitesh!</h1>
                    <p className="text-text-muted font-bold uppercase tracking-[0.3em] text-[10px]">Where are we going next?</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input type="text" placeholder="FIND A JOURNEY..." className="w-full bg-background-light/50 border border-borders rounded-full py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:bg-background-light transition-all shadow-2xl" />
                    </div>
                    <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(150,113,255,0.4)] transition-all active:scale-95">
                        <FiPlusCircle className="text-lg" /> Create New Trip
                    </button>
                </div>
            </header>

            <section className="space-y-8">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-black uppercase tracking-widest italic">Active Journeys</h2>
                    <button className="text-[10px] font-bold text-primary-light uppercase tracking-widest hover:text-white transition-colors">View All Archive</button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {trips.map((trip) => (
                        <div key={trip.id} className="group relative rounded-5xl overflow-hidden border border-borders bg-background-light/20 hover:border-primary/30 transition-all duration-700">
                            <div className="h-64 overflow-hidden relative">
                                <img src={trip.img} alt={trip.title} className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-linear-to-t from-background-base via-transparent to-transparent" />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-background-base/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">{trip.status}</div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">{trip.title}</h3>
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">{trip.date}</p>
                                    </div>
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-4 border-background-light bg-primary/20 ring-1 ring-white/10 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=${trip.id + i}`} alt="Avatar" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-text-muted">{trip.activities} Planned</span>
                                        <span className="text-primary-light">{trip.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-borders rounded-full overflow-hidden">
                                        <div className="h-full bg-primary shadow-[0_0_15px_rgba(150,113,255,0.6)]" style={{ width: `${trip.progress}%` }} />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                        <FiEdit3 /> Edit
                                    </button>
                                    <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:text-red-400 transition-all">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MainWorkspace;
