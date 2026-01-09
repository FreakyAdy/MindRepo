import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-base text-text font-sans">
            <header className="bg-mantle border-b border-surface0 sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center">
                            <span className="text-base font-bold">M</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">MindRepo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-surface0 border border-surface1"></div>
                    </div>
                </div>
            </header>
            <main className="max-w-[1280px] mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
