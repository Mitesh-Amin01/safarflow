import { useState } from 'react';
import { FiShield, FiEdit3, FiCheck, FiX, FiLoader, FiSmartphone, FiMapPin, FiCalendar, FiUser, FiImage, FiTrash2 } from 'react-icons/fi';
import { updateAccountDetails, deleteAccount } from '../../../../services/auth.service';
import { useAuth } from '../../../../utils/AuthContext';
import ConfirmationModal from '../../../common/ConfirmationModal';

interface SettingsViewProps {
    user?: any;
}

const SettingsView = ({ user }: SettingsViewProps) => {
    const { checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile State
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [gender, setGender] = useState(user?.gender || "Secret");
    const [dob, setDob] = useState(user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "");
    const [nationality, setNationality] = useState(user?.nationality || "");
    const [avatarInput, setAvatarInput] = useState(user?.avatar || "");
    const [emergencyDocumentHub, setEmergencyDocumentHub] = useState(user?.emergencyDocumentHub || "");
    
    // Security State
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(user?.isTwoFactorEnabled || false);

    const isGoogleAuth = user?.authType === "GOOGLE";
    const avatarUrl = avatarInput || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=9671FF&color=fff`;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            await deleteAccount();
            window.location.href = "/"; // Force complete refresh and redirect, cookies will be cleared natively
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete account.' });
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const updatePayload: any = {
                name,
                bio,
                phoneNumber,
                gender,
                nationality,
                avatar: avatarInput,
                emergencyDocumentHub
            };

            if (dob) updatePayload.dob = dob;

            // Only send 2FA update if authType isn't Google
            if (!isGoogleAuth) {
                updatePayload.isTwoFactorEnabled = isTwoFactorEnabled;
            }

            await updateAccountDetails(updatePayload);
            await checkAuth();
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(user?.name || "");
        setBio(user?.bio || "");
        setPhoneNumber(user?.phoneNumber || "");
        setGender(user?.gender || "Secret");
        setDob(user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "");
        setNationality(user?.nationality || "");
        setAvatarInput(user?.avatar || "");
        setEmergencyDocumentHub(user?.emergencyDocumentHub || "");
        setIsTwoFactorEnabled(user?.isTwoFactorEnabled || false);
        setMessage(null);
    };

    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-8 lg:p-12 z-10 text-left">
            <header className="mb-12">
                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none mb-4 text-white">
                    Account <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Profile .</span>
                </h1>
                <p className="text-primary-light font-black uppercase tracking-[0.5em] text-[10px] lg:text-[11px] flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 ${user?.isEmailVerified ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} rounded-full`} />
                    {user?.isEmailVerified ? 'Verified Member' : 'Pending Verification'} | {user?.role || "USER"}
                </p>
            </header>

            <div className="w-full space-y-12 pb-20">
                {message && (
                    <div className={`p-4 rounded-2xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    
                    {/* Left Column: Profile Card & Actions */}
                    <div className="xl:col-span-1 space-y-8">
                        {/* Profile Header Card */}
                        <section className="flex flex-col items-center gap-6 p-8 rounded-4xl bg-white/2 border border-white/5 relative overflow-hidden group text-center">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl shrink-0">
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="relative z-10 space-y-3 w-full">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white truncate px-2">{user?.name || "Anonymous User"}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Joined // {user?.accountCreatedDate ? new Date(user.accountCreatedDate).getFullYear() : 'Unknown'}</p>
                                <div className="flex flex-wrap justify-center gap-3 pt-2">
                                    <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${user?.isPremium ? 'bg-amber-500/20 border-amber-500/30 text-amber-500' : 'bg-primary/20 border-primary/20 text-primary-light'}`}>
                                        {user?.planType || "FREE"} Plan
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest ${user?.accountStatus === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                                        {user?.accountStatus || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <section className="flex flex-col gap-4">
                            {isEditing && (
                                <button 
                                    onClick={handleCancel}
                                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2"
                                >
                                    <FiX className="text-lg" /> Cancel
                                </button>
                            )}
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className={`w-full bg-linear-to-r ${isEditing ? 'from-primary to-secondary text-white border-transparent' : 'from-white/10 to-white/5 border-white/10 text-white'} py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:shadow-[0_0_40px_rgba(150,113,255,0.3)] transition-all active:scale-95 border flex items-center justify-center gap-2 disabled:opacity-50`}
                            >
                                {loading ? <FiLoader className="animate-spin text-lg" /> : isEditing ? <><FiCheck className="text-lg" /> Confirm Updates</> : <><FiEdit3 className="text-lg" /> Modify Account</>}
                            </button>
                        </section>
                    </div>

                    {/* Right Column: Complex Form Layout */}
                    <div className="xl:col-span-2 space-y-10">
                        {/* Basic Info */}
                        <section className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary-light/60 border-b border-white/5 pb-2">Identification Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Legal Full Name</label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            readOnly={!isEditing}
                                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5 ring-1 ring-primary/20' : 'border-white/10'} rounded-xl py-4 pl-4 pr-10 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all text-white/90`} 
                                        />
                                        {!isEditing && <FiEdit3 className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary-light transition-colors" />}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Email Address (Secured)</label>
                                    <input 
                                        type="email" 
                                        defaultValue={user?.email || ""}
                                        readOnly
                                        className="w-full bg-white/5 border border-primary/20 rounded-xl py-4 px-4 text-sm font-bold focus:outline-none text-white/40 cursor-not-allowed" 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Extended Demographics */}
                        <section className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary-light/60 border-b border-white/5 pb-2">Personal Demographics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input 
                                            type="text" 
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            readOnly={!isEditing}
                                            placeholder="Not Provided"
                                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all text-white/90`} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Date of Birth</label>
                                    <div className="relative group">
                                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 outline-none" />
                                        <input 
                                            type="date" 
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            readOnly={!isEditing}
                                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all text-white/90 appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.6]`} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Gender</label>
                                    <div className="relative group">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <select 
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full bg-[#0a0a0a] border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all text-white/90 appearance-none`}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Secret">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Nationality</label>
                                    <div className="relative group">
                                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input 
                                            type="text" 
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                            readOnly={!isEditing}
                                            placeholder="Not Provided"
                                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all text-white/90`} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary-light/60 border-b border-white/5 pb-2">Visual & Bio Details</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Avatar Image URL</label>
                                    <div className="relative group">
                                        <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input 
                                            type="text" 
                                            value={avatarInput}
                                            onChange={(e) => setAvatarInput(e.target.value)}
                                            readOnly={!isEditing}
                                            placeholder="Provide a direct image URL (e.g. from Cloudinary)"
                                            className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all text-white/90`} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Professional Travel Bio</label>
                                    <textarea 
                                        rows={4}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        readOnly={!isEditing}
                                        placeholder="Tell us about your global journey..."
                                        className={`w-full bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 px-5 text-sm font-bold focus:outline-none transition-all text-white/90 resize-none`} 
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Emergency Document Hub</label>
                                <div className="relative group">
                                    <FiShield className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-light/40" />
                                    <input 
                                        type="text" 
                                        value={emergencyDocumentHub}
                                        onChange={(e) => setEmergencyDocumentHub(e.target.value)}
                                        readOnly={!isEditing}
                                        placeholder="•••• •••• •••• 9012"
                                        className={`w-full md:w-1/2 bg-white/2 border ${isEditing ? 'border-primary/40 bg-white/5' : 'border-white/10'} rounded-xl py-4 pl-14 pr-5 text-sm font-bold focus:outline-none transition-all text-white/90`} 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Account Security Section */}
                        <section className="pt-8 border-t border-white/5">
                            <h3 className="text-xl font-black uppercase tracking-tight italic mb-8">Account Security</h3>
                            <div className="space-y-6">
                                
                                {/* 2FA Toggle */}
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all gap-4">
                                    <div className="space-y-2 flex-1">
                                        <p className="text-sm font-black uppercase tracking-widest">Two-Factor Authentication</p>
                                        <p className="text-xs text-white/40 leading-relaxed max-w-sm">Require an Email OTP verification on every login to strictly secure your account against unauthorized access.</p>
                                    </div>
                                    <div className="shrink-0">
                                        {isGoogleAuth ? (
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg bg-primary/10 text-primary-light border border-primary/20">
                                                Secured via Google
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => isEditing && setIsTwoFactorEnabled(!isTwoFactorEnabled)}
                                                disabled={!isEditing}
                                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${isTwoFactorEnabled ? 'bg-primary' : 'bg-white/10'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isTwoFactorEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Permanent Deletion */}
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-all gap-4 mt-8">
                                    <div className="space-y-2">
                                        <p className="text-sm font-black uppercase tracking-widest text-red-500">Delete Account</p>
                                        <p className="text-xs text-red-400/60 leading-relaxed max-w-sm">Permanently remove your account and all associated data. This action cannot be undone.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        disabled={loading}
                                        className="shrink-0 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                                    >
                                        <FiTrash2 className="text-lg" />
                                        Terminate Profile
                                    </button>
                                </div>
                                
                            </div>
                        </section>
                    </div>

                </div>
            </div>

            {/* Custom Interactive Delete Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Irreversible Action Warning"
                message={`You are about to permanently delete your entire Safarflow account and all associated profile data. Even though your login analytics will be securely retained, your personal identity and travel records will be unrecoverable. This cannot be undone.`}
                confirmText="Sunder Account"
                cancelText="Keep Safe"
                isDestructive={true}
                onConfirm={handleDeleteAccount}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </main>
    );
};

export default SettingsView;
