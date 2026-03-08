import { FiHome, FiMap, FiMail, FiFolder, FiSettings, FiChevronLeft, FiLogOut } from 'react-icons/fi';
import logo from '../../../../assets/logo/logo.png';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
    return (
        <aside className={`reveal-pane relative flex flex-col border-r border-borders bg-background-light/30 backdrop-blur-3xl transition-all duration-500 z-30 h-screen overflow-hidden ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3">
                    <img src={logo} alt="SafarFlow Logo" className={`${isCollapsed ? 'w-8 h-8' : 'w-40 h-30'} object-contain transition-all duration-500`} />
                </div>
                {!isCollapsed && (
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 rounded-xl text-text-muted transition-colors">
                        <FiChevronLeft className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            {isCollapsed && (
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-4 top-20 p-2 bg-background-light border border-borders rounded-full text-text-muted hover:text-white transition-all z-50">
                    <FiChevronLeft className="rotate-180" />
                </button>
            )}

            <nav className="flex-1 px-4 space-y-3 mt-6">
                {[
                    { icon: FiHome, label: "Dashboard", active: true },
                    { icon: FiMap, label: "My Trips" },
                    { icon: FiMail, label: "Invites", badge: 3 },
                    { icon: FiFolder, label: "Global Vault" },
                    { icon: FiSettings, label: "Settings" },
                ].map((item, i) => (
                    <button key={i} className={`group flex items-center w-full p-4 rounded-2xl transition-all relative ${item.active ? 'bg-primary/10 text-primary-light border border-primary/20 shadow-[0_0_20px_rgba(150,113,255,0.1)]' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}>
                        <item.icon className="text-xl min-w-[24px]" />
                        {!isCollapsed && (
                            <div className="ml-4 flex-1 flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                {item.badge && <span className="bg-red-500/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-red-500/10 animate-pulse">{item.badge}</span>}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-borders">
                <div className={`flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-secondary shrink-0 ring-2 ring-white/10" />
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-tighter truncate">Mitesh</p>
                            <button className="text-[9px] text-primary-light font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                <FiLogOut className="text-xs" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
