import { FiShield } from 'react-icons/fi';

const SettingsView = () => {
    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10">
            <header className="mb-16">
                <h1 className="text-6xl font-black tracking-[-0.08em] uppercase leading-none mb-4">Account Profile</h1>
                <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[11px] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    Verified Member | Concierge Access
                </p>
            </header>

            <div className="max-w-3xl space-y-12 pb-20">
                {/* Profile Header Card */}
                <section className="flex items-center gap-10 p-10 rounded-4xl bg-white/2 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
                        <img src="https://i.pravatar.cc/300?u=mitesh" alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Replace</span>
                        </button>
                    </div>
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Mitesh Amin</h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Global Voyager Class // SF-2026-X</p>
                        <div className="flex gap-4 pt-2">
                            <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/20 text-[9px] font-black text-primary-light uppercase tracking-widest">Premium Status</span>
                            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">Active Member</span>
                        </div>
                    </div>
                </section>

                {/* Form Fields */}
                <section className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Legal Full Name</label>
                            <input 
                                type="text" 
                                defaultValue="Mitesh Amin"
                                className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue="mitesh@safarflow.dev"
                                className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90" 
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Professional Travel Bio</label>
                        <textarea 
                            rows={4}
                            defaultValue="Passionate explorer and digital nomad focused on discovering the world's most breathtaking landscapes with mathematical precision."
                            className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90 resize-none" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Emergency Document Hub</label>
                            <div className="relative group">
                                <FiShield className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-light/40" />
                                <input 
                                    type="password" 
                                    placeholder="•••• •••• •••• 9012"
                                    className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90" 
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-linear-to-r from-primary to-secondary text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:shadow-[0_0_50px_rgba(150,113,255,0.4)] transition-all active:scale-95 border border-white/10">
                                Save Profile Changes
                            </button>
                        </div>
                    </div>
                </section>

                {/* Account Security Section */}
                <section className="pt-12 border-t border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-tight italic mb-8">Account Security</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Two-Factor Authentication", desc: "Currently secured via mobile biometric link.", status: "Active", color: "text-green-500" },
                            { label: "Bespoke Notification Engine", desc: "Calibrated for flight alerts and expense sync.", status: "Configured", color: "text-primary-light" }
                        ].map((pref, i) => (
                            <div key={i} className="flex justify-between items-center p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-widest">{pref.label}</p>
                                    <p className="text-[10px] text-text-muted font-medium">{pref.desc}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${pref.color}`}>{pref.status}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default SettingsView;
