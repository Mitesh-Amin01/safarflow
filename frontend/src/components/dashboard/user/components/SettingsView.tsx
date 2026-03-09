import { useState } from 'react';
import { FiShield, FiEdit3, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { updateAccountDetails } from '../../../../services/auth.service';
import { useAuth } from '../../../../utils/AuthContext';

interface SettingsViewProps {
    user?: any;
}

const SettingsView = ({ user }: SettingsViewProps) => {
    const { checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=9671FF&color=fff`;

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await updateAccountDetails({ name });
            await checkAuth();
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10 text-left">
            <header className="mb-16">
                <h1 className="text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none mb-4 text-white">
                    Account <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Profile .</span>
                </h1>
                <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[11px] flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 ${user?.isVerified ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} rounded-full`} />
                    {user?.isVerified ? 'Verified Member' : 'Pending Verification'} | Concierge Access
                </p>
            </header>

            <div className="max-w-3xl space-y-12 pb-20">
                {message && (
                    <div className={`p-4 rounded-2xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Header Card */}
                <section className="flex items-center gap-10 p-10 rounded-4xl bg-white/2 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Replace</span>
                        </button>
                    </div>
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white">{user?.name || "Anonymous User"}</h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Global Voyager Class // SF-{new Date().getFullYear()}-X</p>
                        <div className="flex gap-4 pt-2">
                            <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/20 text-[9px] font-black text-primary-light uppercase tracking-widest">Premium Status</span>
                            <span className={`px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest ${user?.isVerified ? 'text-[#22c55e]' : 'text-amber-500'}`}>
                                {user?.isVerified ? 'Active Member' : 'Pending Sync'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Form Fields */}
                <section className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Legal Full Name</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    readOnly={!isEditing}
                                    className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5 ring-1 ring-primary/20' : 'border-white/10'} rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90`} 
                                />
                                {!isEditing && <FiEdit3 className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary-light transition-colors" />}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue={user?.email || ""}
                                readOnly
                                className="w-full bg-white/5 border border-primary/20 rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none text-white/40 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-light/60 ml-1">Professional Travel Bio</label>
                        <textarea 
                            rows={4}
                            defaultValue="Passionate explorer and digital nomad focused on discovering the world's most breathtaking landscapes with mathematical precision."
                            readOnly={!isEditing}
                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-2xl py-5 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90 resize-none`} 
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
                                    readOnly
                                    className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-white/90 cursor-not-allowed" 
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-4">
                            {isEditing && (
                                <button 
                                    onClick={() => { setIsEditing(false); setName(user?.name || ""); }}
                                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2"
                                >
                                    <FiX className="text-lg" /> Cancel
                                </button>
                            )}
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className={`flex-2 bg-linear-to-r ${isEditing ? 'from-primary to-secondary' : 'from-white/10 to-white/5'} text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:shadow-[0_0_50px_rgba(150,113,255,0.4)] transition-all active:scale-95 border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50`}
                            >
                                {loading ? <FiLoader className="animate-spin text-lg" /> : isEditing ? <><FiCheck className="text-lg" /> Confirm Updates</> : <><FiEdit3 className="text-lg" /> Modify Account</>}
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
