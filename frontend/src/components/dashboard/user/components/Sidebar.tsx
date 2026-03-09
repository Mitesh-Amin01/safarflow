import { FiHome, FiMap, FiMail, FiFolder, FiSettings, FiCpu, FiChevronLeft, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../../utils/AuthContext';
import logo from '../../../../assets/logo/logo.png';
import icon from '../../../../assets/logo/icon.png';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    activeSection: string;
    setActiveSection: (value: string) => void;
    user: any;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, activeSection, setActiveSection, user }: SidebarProps) => {
    const { logout } = useAuth();

    return (
        <aside className={`reveal-pane relative flex flex-col border-r border-white/5 bg-background-light/10 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-30 h-screen ${isCollapsed ? 'w-24' : 'w-80'}`}>
            {/* Sidebar Toggle - Unified Position */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className={`absolute -right-4 top-10 w-8 h-8 flex items-center justify-center bg-primary backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-primary-light hover:scale-110 transition-all duration-300 z-50 group shadow-[0_0_20px_rgba(150,113,255,0.4)]`}
            >
                <FiChevronLeft className={`${isCollapsed ? 'rotate-180' : ''} text-lg transition-transform duration-500`} />
            </button>

            {/* Header / Logo Section */}
            <div className={`p-8 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <div className="relative flex items-center">
                    <img src={icon} alt="SafarFlow Icon" className={`absolute left-0 w-10 h-10 object-contain transition-all duration-700 ease-in-out ${isCollapsed ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} />
                    <img src={logo} alt="SafarFlow Logo" className={`w-44 h-auto object-contain transition-all duration-700 ease-in-out ${isCollapsed ? 'opacity-0 scale-50 rotate-90 blur-lg' : 'opacity-100 scale-100 rotate-0 blur-0'}`} />
                </div>
            </div>

            <nav className="flex-1 px-5 space-y-2 mt-8 overflow-y-auto no-scrollbar">
                {[
                    { icon: FiHome, label: "Concierge Hub" },
                    { icon: FiCpu, label: "Professional Trip Planner", status: "AI Future" },
                    { icon: FiMap, label: "Journeys" },
                    { icon: FiMail, label: "Real-time Connect", badge: 3 },
                    { icon: FiFolder, label: "Logistics Vault" },
                    { icon: FiSettings, label: "System Profile" },
                ].map((item, i) => {
                    const isActive = activeSection === item.label;
                    return (
                        <button key={i} onClick={() => setActiveSection(item.label)} className={`group flex items-center w-full p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-primary/10 text-primary-light border border-primary/20 shadow-[inset_0_0_20px_rgba(150,113,255,0.05)]' : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'}`}>
                            {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(150,113,255,0.8)]" />}
                            <item.icon className={`text-xl transition-all duration-300 ${isCollapsed ? 'mx-auto' : 'mr-4'} ${isActive ? 'text-primary-light scale-110' : 'group-hover:scale-110'}`} />
                            {!isCollapsed && (
                                <div className="flex-1 flex justify-between items-center overflow-hidden">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${isActive ? 'translate-x-0' : 'group-hover:translate-x-1'}`}>{item.label}</span>
                                    {item.badge && <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-[0_0_10px_rgba(150,113,255,0.5)] animate-pulse">{item.badge}</span>}
                                    {item.status && <span className="text-[7px] font-black uppercase tracking-widest text-primary-light/60 border border-primary/20 px-1.5 py-0.5 rounded-md">{item.status}</span>}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 bg-white/2">
                <div className={`flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all duration-500 ${isCollapsed ? 'justify-center cursor-pointer' : ''}`}>
                    <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-primary via-secondary to-primary/40 ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-500 overflow-hidden shadow-2xl">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                                <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/100?u=mitesh')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background-base rounded-full shadow-lg" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[11px] font-black uppercase tracking-wider truncate mb-1 text-white">{user?.name || "Anonymous User"}</p>
                            <button
                                onClick={logout}
                                className="group/logout text-[9px] text-primary-light font-black uppercase tracking-[0.15em] hover:text-white transition-colors flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 hover:bg-primary/20"
                            >
                                <FiLogOut className="text-xs group-hover/logout:-translate-x-0.5 transition-transform" /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
