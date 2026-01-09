import React from 'react';
import { Menu, Command, Bell, Plus, Github } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            {/* GitHub-like Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <button className="menu-btn">
                            <Menu size={20} />
                        </button>
                        <div className="logo-section">
                            <Github size={32} fill="currentColor" />
                            <span>Dashboard</span>
                        </div>
                    </div>

                    <div className="search-bar">
                        <button className="search-input-wrapper">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Command size={14} /> Type <kbd className="kbd-shortcut">/</kbd> to search
                            </span>
                        </button>
                    </div>

                    <div className="header-right">
                        <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>

                        <button className="icon-btn">
                            <Plus size={20} />
                        </button>

                        <button className="icon-btn" style={{ position: 'relative' }}>
                            <Bell size={16} />
                            <span style={{
                                position: 'absolute', top: 0, right: 0, width: '8px', height: '8px',
                                backgroundColor: 'var(--blue)', borderRadius: '50%', border: '2px solid var(--mantle)'
                            }}></span>
                        </button>

                        <div className="avatar">
                            {/* Avatar Placeholder */}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-container">
                {children}
            </main>
        </div>
    );
};
