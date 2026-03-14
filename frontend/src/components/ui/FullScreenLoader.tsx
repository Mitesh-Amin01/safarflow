import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FullScreenLoaderProps {
    message?: string;
}

const FullScreenLoader = ({ message = "AUTHENTICATING" }: FullScreenLoaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ring1Ref = useRef<HTMLDivElement>(null);
    const ring2Ref = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Reveal the backdrop
        tl.to(containerRef.current, {
            opacity: 1,
            backdropFilter: "blur(20px)",
            duration: 0.5,
            ease: "power2.out"
        });

        // Spin the rings
        gsap.to(ring1Ref.current, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "linear"
        });

        gsap.to(ring2Ref.current, {
            rotation: -360,
            duration: 2,
            repeat: -1,
            ease: "linear"
        });

        // Pulse the text
        gsap.to(textRef.current, {
            opacity: 0.5,
            yoyo: true,
            repeat: -1,
            duration: 0.8,
            ease: "power1.inOut"
        });

    }, []);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background-base/80 opacity-0 pointer-events-none"
            style={{ pointerEvents: 'all' }}
        >
            <div className="relative flex items-center justify-center w-40 h-40 mb-8">
                {/* Outer Ring */}
                <div 
                    ref={ring1Ref}
                    className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/30"
                />
                
                {/* Inner Ring */}
                <div 
                    ref={ring2Ref}
                    className="absolute inset-4 rounded-full border-b-2 border-l-2 border-primary-light"
                />

                {/* Core Glow */}
                <div className="absolute inset-10 rounded-full bg-primary/20 blur-md animate-pulse" />
                <div className="absolute inset-14 rounded-full bg-primary shadow-[0_0_30px_rgba(150,113,255,0.8)]" />
            </div>

            <div className="flex flex-col items-center gap-2" ref={textRef}>
                <span className="text-white font-black tracking-[0.5em] uppercase text-sm">{message}</span>
                <span className="text-primary-light font-bold tracking-[0.3em] uppercase text-[9px]">SafarFlow Secure Sync</span>
            </div>
        </div>
    );
};

export default FullScreenLoader;
