import React from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    view?: string;
    onNavigate?: (view: string) => void;
    onPlusClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, onNavigate, onPlusClick }) => {
    return (
        <div className="min-h-screen bg-base text-text font-sans selection:bg-blue/30">
            {/* Header */}
            <header className="bg-mantle border-b border-surface0 sticky top-0 z-50 shadow-sm">
                <div className="w-full px-4 h-16 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-subtext0 hover:text-text">
                            <Menu size={20} />
                        </button>
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => onNavigate?.('dashboard')}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-base font-bold text-crust group-hover:opacity-90 transition-opacity">
                                M
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight leading-none group-hover:text-blue transition-colors">MindRepo</span>
                                <span className="text-[10px] text-subtext0 font-mono leading-none mt-0.5">v1.0.0</span>
                            </div>
                        </div>

                        {/* Breadcrumbs for desktop */}
                        {view === 'repository' && (
                            <div className="hidden md:flex items-center gap-2 text-sm text-subtext0 ml-4 animate-in fade-in slide-in-from-left-2">
                                <span className="hover:text-blue cursor-pointer">freakyady</span>
                                <span className="text-surface1">/</span>
                                <span className="font-bold text-text hover:text-blue cursor-pointer">mindrepo</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 max-w-md hidden md:block group">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={14} className="text-subtext0 group-focus-within:text-blue transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Type / to search"
                                className="block w-full pl-10 pr-3 py-1.5 border border-surface0 rounded-md leading-5 bg-base text-text placeholder-surface1 focus:outline-none focus:bg-base focus:ring-1 focus:ring-blue focus:border-blue sm:text-sm transition-all shadow-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <kbd className="hidden sm:inline-block border border-surface0 rounded px-1 text-[10px] font-mono text-subtext0">
                                    /
                                </kbd>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPlusClick}
                            className="p-1.5 rounded-md text-subtext0 hover:text-text hover:bg-surface0 transition-all border border-transparent hover:border-surface1 relative"
                        >
                            <Plus size={18} />
                        </button>

                        <div className="w-px h-6 bg-surface0 mx-1"></div>

                        <button className="p-1.5 rounded-md text-subtext0 hover:text-text hover:bg-surface0 transition-all border border-transparent hover:border-surface1 relative">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1.5 w-2 h-2 bg-blue rounded-full border-2 border-mantle"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-surface0 border border-surface1 ml-2 cursor-pointer hover:border-subtext0 transition-colors bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
