import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../../../utils/AuthContext';
import Sidebar from './components/Sidebar';
import MainWorkspace from './components/MainWorkspace';
import ProfessionalPlanner from './components/ProfessionalPlanner';
import ExpeditionsView from './components/ExpeditionsView';
import TransmissionsView from './components/TransmissionsView';
import AssetVaultView from './components/AssetVaultView';
import SettingsView from './components/SettingsView';

// --- Demo Data ---
const DEMO_TRIPS = [
    { id: 1, title: "Bali Summer 2026", date: "June 10-20", progress: 40, activities: "4/10", status: "ONGOING", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800" },
    { id: 2, title: "Paris Corporate", date: "Sept 12-15", progress: 85, activities: "12/15", status: "PENDING", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800" },
    { id: 3, title: "Tokyo Neon Nights", date: "Oct 05-12", progress: 15, activities: "2/12", status: "ONGOING", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
    { id: 4, title: "Swiss Alps Retreat", date: "Dec 20-28", progress: 0, activities: "0/8", status: "PENDING", img: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800" },
    { id: 5, title: "Dubai Skyline", date: "Jan 15-20", progress: 100, activities: "20/20", status: "COMPLETED", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" },
    { id: 6, title: "London Heritage", date: "March 10-15", progress: 60, activities: "6/10", status: "ONGOING", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800" },
];

const Dashboard = () => {
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('Concierge Hub');
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".reveal-pane", {
            x: -30, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out"
        });
    }, { scope: container });



    const renderContent = () => {
        switch (activeSection) {
            case 'Concierge Hub':
                return <MainWorkspace trips={DEMO_TRIPS} user={user} />;
            case 'Journeys':
                return <ExpeditionsView />;
            case 'Professional Trip Planner':
                return <ProfessionalPlanner user={user} />;
            case 'Real-time Connect':
                return <TransmissionsView />;
            case 'Logistics Vault':
                return <AssetVaultView />;
            case 'System Profile':
                return <SettingsView user={user} />;
            default:
                return <MainWorkspace trips={DEMO_TRIPS} />;
        }
    };

    return (
        <div ref={container} className="flex h-screen bg-background-base text-text-main font-sans">
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                user={user}
            />
            {renderContent()}
            {/* <RightPanel budgetData={budgetData} /> */}
        </div>
    );
};

export default Dashboard;