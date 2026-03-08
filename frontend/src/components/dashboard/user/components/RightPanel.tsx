import { FiCloud, FiCheckCircle } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RightPanelProps {
    budgetData: { name: string; value: number }[];
}

const RightPanel = ({ budgetData }: RightPanelProps) => {
    return (
        <aside className="reveal-pane w-[450px] border-l border-white/5 bg-white/1 backdrop-blur-3xl p-10 flex-col gap-12 hidden 2xl:flex z-20">

            {/* Budget Gauge */}
            <section className="space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary-light/60">Settlement Summary</h3>
                    <span className="text-[10px] font-black bg-primary/20 text-primary-light px-3 py-1 rounded-lg border border-primary/20">SPLITWISE LOGIC</span>
                </div>
                <div className="h-72 relative bg-white/2 rounded-[2.5rem] border border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-30" />
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={budgetData} 
                                innerRadius={70} 
                                outerRadius={95} 
                                paddingAngle={10} 
                                dataKey="value" 
                                stroke="none" 
                                startAngle={90} 
                                endAngle={450}
                            >
                                <Cell fill="#9671FF" className="drop-shadow-[0_0_10px_rgba(150,113,255,0.8)]" />
                                <Cell fill="#1a1a2e" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center space-y-1">
                        <p className="text-4xl font-extrabold tracking-tighter font-heading">$800</p>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Net Settlement</p>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="flex-1 space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary-light/60">Concierge Feed</h3>
                <div className="space-y-8 relative">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-linear-to-b from-primary via-secondary/20 to-transparent" />
                    {[
                        { user: "Priya", action: "Confirmed Flight", target: "Paris Hub", time: "2m ago", color: "text-primary-light" },
                        { user: "Arjun", action: "Left Review", target: "Boutique Hotel", time: "1h ago", color: "text-secondary" }
                    ].map((log, i) => (
                        <div key={i} className="flex gap-6 group relative pl-6">
                            <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(150,113,255,1)] ring-4 ring-primary/20" />
                            <div className="space-y-2">
                                <p className="text-[12px] font-black uppercase tracking-widest leading-relaxed">
                                    <span className={`${log.color}`}>{log.user}</span> 
                                    <span className="text-text-muted mx-2">{log.action}</span> 
                                    <span className="text-white border-b border-white/10">{log.target}</span>
                                </p>
                                <p className="text-[9px] text-primary-light/40 font-black uppercase tracking-[0.2em]">{log.time} // LOG_ID_{i+104}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weather/Milestone Widget */}
            <section className="p-8 rounded-[2.5rem] bg-linear-to-br from-primary/10 via-background-light/5 to-secondary/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                <div className="relative z-10 flex justify-between items-center mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <FiCloud className="text-4xl text-primary-light shadow-[0_0_20px_rgba(150,113,255,0.4)]" />
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-4xl font-black tracking-tighter">28°C</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center justify-end gap-2">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            Bali Pulse
                        </p>
                    </div>
                </div>
                <div className="pt-6 border-t border-white/10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light flex items-center gap-3">
                        <FiCheckCircle className="text-base" /> NEXT EVENT IN: 48H
                    </p>
                    <p className="text-sm font-black uppercase tracking-widest text-white/90">First Class Departure</p>
                </div>
            </section>
        </aside>
    );
};

export default RightPanel;
