import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = false
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Visual Header */}
                <div className={`h-2 w-full ${isDestructive ? 'bg-red-500' : 'bg-primary'}`} />

                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className={`p-3 rounded-2xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary-light'}`}>
                            <FiAlertTriangle className="text-2xl" />
                        </div>
                        <button 
                            onClick={onCancel}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                        {title}
                    </h3>
                    
                    <p className="text-sm text-white/60 leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-4 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest text-white transition-all shadow-lg ${
                                isDestructive 
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                                    : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
