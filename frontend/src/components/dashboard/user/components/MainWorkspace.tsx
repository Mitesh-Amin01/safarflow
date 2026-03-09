import { useState } from 'react';
import { FiSearch, FiPlusCircle, FiEdit3, FiTrash2, FiMap, FiX } from 'react-icons/fi';

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
    user?: any;
}

const MainWorkspace = ({ trips, user }: MainWorkspaceProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Trip>>({});
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrips = trips.filter(trip => 
        trip.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openEditModal = (trip: Trip) => {
        setSelectedTrip(trip);
        setEditFormData(trip);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (trip: Trip) => {
        setSelectedTrip(trip);
        setIsDeleteModalOpen(true);
    };

    const handleSave = () => {
        console.log("Saving Trip:", editFormData);
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        console.log("Deleting Trip:", selectedTrip?.id);
        setIsDeleteModalOpen(false);
    };

    return (
        <main className="reveal-pane flex-1 overflow-y-auto no-scrollbar p-12 z-10 relative">
            {/* Edit Journey Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-background-base/80 backdrop-blur-2xl"
                        onClick={() => setIsEditModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />

                        <header className="flex justify-between items-center mb-10">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-extrabold tracking-tight uppercase font-heading text-white">Edit Journey</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-light/60 text-left">Refine your bespoke itinerary</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </header>

                        <div className="space-y-8 text-left">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Journey Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full bg-white/3 border border-white/5 rounded-2xl py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Arrival Date</label>
                                    <input
                                        type="text"
                                        value={editFormData.date}
                                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                        className="w-full bg-white/3 border border-white/5 rounded-2xl py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-left"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Status Code</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full bg-white/3 border border-white/5 rounded-2xl py-6 px-8 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all appearance-none text-left"
                                    >
                                        <option value="ACTIVE" className="bg-background-base">ACTIVE</option>
                                        <option value="PENDING" className="bg-background-base">PENDING</option>
                                        <option value="COMPLETED" className="bg-background-base">COMPLETED</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-6 bg-linear-to-r from-primary to-secondary text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_40px_-10px_rgba(150,113,255,0.4)] hover:shadow-[0_20px_50px_-10px_rgba(150,113,255,0.6)] transition-all active:scale-[0.98] mt-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-background-base/80 backdrop-blur-xl" />
                    <div className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <FiTrash2 className="text-3xl text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white font-heading">Delete Journey?</h3>
                                <p className="text-[11px] font-medium text-text-muted px-4 leading-relaxed">
                                    This action will permanently erase "<span className="text-white font-bold">{selectedTrip?.title}</span>" and all synchronized data.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-5 rounded-2xl bg-red-500 text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_15px_30px_-10px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 mb-20 text-left">
                <div className="space-y-4">
                    <h1 className="text-6xl font-extrabold tracking-[-0.08em] uppercase leading-none font-heading text-white">
                        {user?.name ? user.name.split(' ')[0] : 'Concierge'} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary/40">.</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <p className="text-primary-light font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ring-4 ring-green-500/20" />
                            Command Center // Global Journeys Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5 w-full xl:w-auto">
                    <div className="relative flex-1 xl:w-[450px] group">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary transition-colors text-lg" />
                        <input
                            type="text"
                            placeholder="SEARCH YOUR ITINERARIES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/3 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] placeholder:text-text-muted/30"
                        />
                    </div>
                    <button className="flex items-center gap-4 bg-linear-to-r from-primary to-secondary text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-[0_0_50px_rgba(150,113,255,0.4)] transition-all active:scale-95 shrink-0 border border-white/10">
                        <FiPlusCircle className="text-xl" /> Create Journey
                    </button>
                </div>
            </header>

            <section className="space-y-24 pb-20">

                {/* Personal Journeys Section */}
                <div className="space-y-10 text-left">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-extrabold uppercase tracking-tight italic font-heading text-white">Personal Command</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Your private bespoke itineraries</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="text-[10px] font-black text-primary-light uppercase tracking-[0.3em] hover:text-white transition-colors bg-white/5 px-6 py-2.5 rounded-xl border border-white/5">Operational History</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map((trip) => (
                                <div key={trip.id} className="group relative flex flex-col rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/2 hover:border-primary/40 transition-all duration-700 shadow-2xl">
                                    <div className="h-72 overflow-hidden relative shrink-0">
                                        <img src={trip.img} alt={trip.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                                        <div className="absolute inset-0 bg-linear-to-t from-background-base via-background-base/20 to-transparent" />
                                        <div className="absolute top-8 left-8 flex items-center gap-3 bg-background-base/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(150,113,255,1)]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-heading">{trip.status}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    </div>
                                    <div className="p-10 flex-1 flex flex-col relative transform group-hover:translate-y-[-5px] transition-transform duration-500">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-extrabold uppercase tracking-tight leading-tight font-heading text-white">{trip.title}</h3>
                                                <div className="flex items-center gap-3 text-text-muted">
                                                    <FiMap className="text-primary-light" />
                                                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold">{trip.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex -space-x-4">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-[#0D0B14] bg-white/5 ring-1 ring-white/10 overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
                                                        <img src={`https://i.pravatar.cc/100?u=${trip.id + i}`} alt="Avatar" className="w-full h-full object-cover grayscale" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em]">
                                                <span className="text-text-muted">{trip.activities} Objectives</span>
                                                <span className="text-primary-light">{trip.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                                <div className="h-full bg-linear-to-r from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(150,113,255,0.8)] transition-all duration-1000" style={{ width: `${trip.progress}%` }} />
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-10 flex gap-4">
                                            <button
                                                onClick={() => openEditModal(trip)}
                                                className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] group/btn text-white"
                                            >
                                                <FiEdit3 className="text-lg group-hover/btn:scale-110 group-hover/btn:text-primary-light transition-all" />
                                                Edit Journey
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(trip)}
                                                className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300 group/del text-text-muted"
                                            >
                                                <FiTrash2 className="text-lg group-hover/del:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">No tactical matches found</p>
                                <button onClick={() => setSearchQuery('')} className="text-[9px] font-bold text-primary-light hover:text-white transition-colors uppercase tracking-[0.3em]">Clear Search Filter</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Explorations Section */}
                <div className="space-y-10 text-left">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-extrabold uppercase tracking-tight italic font-heading text-white">Global Explorations</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Universal itineraries live across the network</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#22c55e]">
                            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                            Live Community Sync
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Tokyo Summit", city: "Tokyo, JP", viewers: "+42", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" },
                            { title: "Ibiza Pulse", city: "Ibiza, ES", viewers: "+128", img: "https://images.unsplash.com/photo-1577717582675-224930d75a45?q=80&w=800" },
                            { title: "Aspen Peak", city: "Aspen, US", viewers: "+15", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" },
                        ].map((item, i) => (
                            <div key={i} className="group relative aspect-4/5 rounded-4xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-linear-to-t from-background-base via-background-base/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 space-y-2">
                                    <h4 className="text-2xl font-black uppercase tracking-tight text-white">{item.title}</h4>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">{item.city}</p>
                                        <p className="text-[10px] font-black text-text-muted">{item.viewers} Viewers</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MainWorkspace;
