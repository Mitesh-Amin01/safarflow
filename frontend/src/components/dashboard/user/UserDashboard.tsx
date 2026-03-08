import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from './components/Sidebar';
import MainWorkspace from './components/MainWorkspace';
import RightPanel from './components/RightPanel';

// --- Types & Mock Data ---
const ACTIVE_TRIPS = [
    { id: 1, title: "Bali Summer 2026", date: "June 10-20", progress: 40, activities: "4/10", status: "ONGOING", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500" },
    { id: 2, title: "Paris Corporate", date: "Sept 12-15", progress: 85, activities: "12/15", status: "PENDING", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500" },
];

const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".reveal-pane", {
            x: -30, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out"
        });
    }, { scope: container });

    const budgetData = [
        { name: 'Spent', value: 1200 },
        { name: 'Remaining', value: 800 },
    ];

    return (
        <div ref={container} className="flex h-screen bg-background-base text-text-main font-sans overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <MainWorkspace trips={ACTIVE_TRIPS} />
            <RightPanel budgetData={budgetData} />
        </div>
    );
};

export default Dashboard;