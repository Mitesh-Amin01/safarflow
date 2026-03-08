import { FiFileText, FiImage, FiLock, FiStar, FiArchive } from 'react-icons/fi';

const AssetVaultView = () => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10">
            <header className="mb-20">
                <h1 className="text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none mb-4 font-heading">Logistics Vault</h1>
                <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[10px] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    Synchronized Documents | Secure Cloud Access
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Boarding Passes", type: "PDF Bundle", color: "from-blue-500/20 to-blue-600/5", icon: FiFileText },
                    { label: "Visa Approvals", type: "Image Pack", color: "from-purple-500/20 to-purple-600/5", icon: FiImage },
                    { label: "Travel Insurance", type: "Locked File", color: "from-green-500/20 to-green-600/5", icon: FiLock },
                    { label: "Global Permits", type: "Priority Doc", color: "from-orange-500/20 to-orange-600/5", icon: FiStar },
                ].map((asset, i) => (
                    <div key={i} className={`p-8 rounded-4xl bg-linear-to-br ${asset.color} border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-pointer`}>
                        <asset.icon className="text-4xl mb-6 text-white group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest mb-1 font-heading">{asset.label}</h3>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{asset.type} // Sync Ready</p>
                    </div>
                ))}
            </div>
            
            <section className="mt-20 space-y-10">
                <h2 className="text-2xl font-black uppercase tracking-tight italic border-b border-white/5 pb-4">Recent Access</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <FiArchive className="text-primary-light" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">vault_recovery_0{i}.data</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 italic">Accessed 1h ago</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default AssetVaultView;
