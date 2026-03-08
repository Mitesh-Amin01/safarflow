import { FiCloud, FiCheckCircle } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RightPanelProps {
    budgetData: { name: string; value: number }[];
}

const RightPanel = ({ budgetData }: RightPanelProps) => {
    return (
        <aside className="reveal-pane w-96 border-l border-borders bg-background-light/10 backdrop-blur-2xl p-8 flex-col gap-10 hidden 2xl:flex z-20">

            {/* Budget Gauge */}
            <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Global Liquidity</h3>
                <div className="h-64 relative bg-background-base/40 rounded-5xl border border-borders flex items-center justify-center overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={budgetData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                                <Cell fill="#9671FF" />
                                <Cell fill="#2A1758" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                        <p className="text-2xl font-black">$1.2k</p>
                        <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Spent</p>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="flex-1 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Quantum Feed</h3>
                <div className="space-y-6">
                    {[
                        { user: "Priya", action: "Added Flight", target: "Paris", time: "2m ago" },
                        { user: "Arjun", action: "Commented on", target: "Day 2", time: "1h ago" }
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="w-1 h-10 bg-primary/20 group-hover:bg-primary transition-colors rounded-full" />
                            <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-primary-light">{log.user}</span> {log.action} <span className="text-white">{log.target}</span>
                                </p>
                                <p className="text-[9px] text-text-muted font-bold uppercase">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weather/Milestone Widget */}
            <section className="p-6 rounded-4xl bg-linear-to-br from-primary/20 to-secondary/5 border border-primary/20">
                <div className="flex justify-between items-center mb-4">
                    <FiCloud className="text-3xl text-primary-light" />
                    <div className="text-right">
                        <p className="text-2xl font-black">28°C</p>
                        <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest italic">Bali, Indo</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light flex items-center gap-2">
                        <FiCheckCircle /> Next Milestone
                    </p>
                    <p className="text-xs font-bold uppercase tracking-widest">Flight in 48 Hours</p>
                </div>
            </section>
        </aside>
    );
};

export default RightPanel;
