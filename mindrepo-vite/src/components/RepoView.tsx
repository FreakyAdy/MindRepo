import React from 'react';
import { Folder, FileCode, FileText, GitBranch, Star, Eye } from 'lucide-react';

export const RepoView: React.FC = () => {
    const files = [
        { name: 'src', type: 'folder', date: '2 hours ago', commit: 'feat: User navigation' },
        { name: 'public', type: 'folder', date: '3 days ago', commit: 'chore: Clean assets' },
        { name: 'components', type: 'folder', date: '5 hours ago', commit: 'style: Update buttons' },
        { name: '.gitignore', type: 'file', date: '5 days ago', commit: 'init: Project setup' },
        { name: 'package.json', type: 'file', date: 'Yesterday', commit: 'fix: Deps upgrade' },
        { name: 'README.md', type: 'file', date: '1 week ago', commit: 'docs: Initial writeup' },
        { name: 'vite.config.ts', type: 'file', date: 'Yesterday', commit: 'chore: Tailwind 4 setup' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Repo Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-text">
                    <div className="w-8 h-8 rounded bg-blue/10 flex items-center justify-center text-blue">
                        <span className="font-bold text-lg">M</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
                            freakyady <span className="text-subtext0">/</span> mindrepo
                            <span className="text-xs border border-surface1 px-2 py-0.5 rounded-full text-subtext0 font-normal">Public</span>
                        </h2>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors">
                        <Eye size={14} /> Watch <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1">1</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors">
                        <GitBranch size={14} /> Fork <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1">0</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-surface0 border border-surface1 rounded text-sm font-medium hover:bg-surface1 transition-colors text-yellow">
                        <Star size={14} className="fill-yellow" /> Star <span className="bg-surface1 px-1.5 rounded-full text-xs ml-1 text-text">3</span>
                    </button>
                </div>
            </div>

            {/* Branch / Meta */}
            <div className="flex justify-between items-center mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-surface0 rounded border border-surface1 text-sm font-bold hover:border-subtext0 transition-colors">
                    <GitBranch size={16} />
                    <span>main</span>
                </button>
                <div className="flex items-center gap-4 text-sm font-mono text-subtext0">
                    <span className="hover:text-blue cursor-pointer"><strong>92</strong> commits</span>
                    <span className="hover:text-blue cursor-pointer"><strong>2</strong> branches</span>
                    <span className="hover:text-blue cursor-pointer"><strong>0</strong> tags</span>
                </div>
            </div>

            {/* File Tree */}
            <div className="border border-surface0 rounded-lg overflow-hidden bg-mantle shadow-sm">
                <div className="bg-surface0/30 p-3 border-b border-surface0 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue/20"></div>
                        <span className="font-bold text-text">FreakyAdy</span>
                        <span className="text-subtext0 truncate">feat: Enhancing logic for navigation</span>
                    </div>
                    <div className="text-xs text-subtext0 font-mono">
                        a1b2c3 • 2 hours ago
                    </div>
                </div>

                <div className="divide-y divide-surface0">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 hover:bg-surface0/50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3 w-1/3">
                                {file.type === 'folder'
                                    ? <Folder size={16} className="text-blue fill-blue/20" />
                                    : <FileCode size={16} className="text-subtext0" />
                                }
                                <span className="text-sm text-text group-hover:text-blue group-hover:underline transition-colors">{file.name}</span>
                            </div>
                            <div className="flex-1 text-sm text-subtext0 truncate px-4 group-hover:text-subtext1">
                                {file.commit}
                            </div>
                            <div className="text-xs text-subtext1 w-24 text-right">
                                {file.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* README Preview */}
            <div className="mt-6 border border-surface0 rounded-lg overflow-hidden bg-mantle">
                <div className="p-3 border-b border-surface0 bg-surface0/30 flex items-center gap-2">
                    <FileText size={16} className="text-subtext0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-subtext0">README.md</span>
                </div>
                <div className="p-8 prose prose-invert max-w-none">
                    <h1 className="text-2xl font-bold mb-4">MindRepo</h1>
                    <p className="text-subtext0 mb-4">A simple, full-stack MVP to track your mental "commits" and gain insights into your daily activities. Built with React, Vite, FastAPI, and SQLAlchemy.</p>

                    <h2 className="text-xl font-bold mb-2 mt-6">Features</h2>
                    <ul className="list-disc pl-5 text-subtext0 space-y-1">
                        <li>Track mental effort</li>
                        <li>Categorize activities</li>
                        <li>Gain automated insights</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
