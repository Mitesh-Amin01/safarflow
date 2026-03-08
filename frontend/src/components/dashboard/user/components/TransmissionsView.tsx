import { FiActivity, FiCpu, FiGlobe } from 'react-icons/fi';

const TransmissionsView = () => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10">
            <header className="mb-20">
                <h1 className="text-6xl font-black tracking-[-0.08em] uppercase leading-none mb-4">Live Sync Hub</h1>
                <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[11px] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(150,113,255,1)]" />
                    Real-time Itinerary Sync | Satellite Link Stable
                </p>
            </header>

            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-8 p-8 rounded-4xl bg-white/2 border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <FiActivity className="text-3xl text-primary-light shadow-[0_0_15px_rgba(150,113,255,0.4)]" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black uppercase tracking-tight">Data Packet_{i * 42}XT</h3>
                                <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-lg border border-white/10">0{i}:24:12 AM</span>
                            </div>
                            <p className="text-sm font-medium text-text-muted tracking-wide">Signal source: Node_{i} (Bali Cluster). Transmission integrity verified. Metadata encryption: 256-bit AES.</p>
                            <div className="flex gap-4 pt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light flex items-center gap-2">
                                    <FiCpu className="text-xs" /> Processor_{i}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                                    <FiGlobe className="text-xs" /> Geo_Tag_{i}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default TransmissionsView;
