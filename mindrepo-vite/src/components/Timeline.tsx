import React, { useState } from 'react';
import type { Commit, NewCommit } from '../types';
import { EditModal } from './EditModal';
import { Star, MessageSquare, MoreHorizontal } from 'lucide-react';

interface TimelineProps {
    commits: Commit[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, commit: Partial<NewCommit>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ commits, onDelete, onUpdate }) => {
    const [editingCommit, setEditingCommit] = useState<Commit | null>(null);

    if (commits.length === 0) {
        return (
            <div className="bg-mantle border border-dashed border-surface0 rounded-lg p-12 text-center flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-surface0 rounded-full flex items-center justify-center mb-4">
                    <Star className="text-subtext0" size={24} />
                </div>
                <h3 className="text-lg font-bold text-text">No activity yet</h3>
                <p className="text-subtext0 max-w-xs mx-auto mt-2">Make your first mental commit above to start tracking your journey.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {commits.map((commit, index) => {
                    const date = new Date(commit.timestamp);
                    const timeAgo = getTimeAgo(date);

                    return (
                        <div
                            key={commit.id}
                            className="bg-mantle border border-surface0 rounded-lg p-4 hover:border-blue/30 hover:shadow-lg transition-all duration-300 group relative animate-in slide-in-from-bottom-2 fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Connector Line */}
                            {index !== commits.length - 1 && (
                                <div className="absolute left-[27px] top-12 bottom-[-20px] w-0.5 bg-surface0 -z-10 group-hover:bg-blue/10 transition-colors"></div>
                            )}

                            <div className="flex gap-4">
                                {/* Avatar / Icon */}
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-surface0 border border-surface1 flex items-center justify-center z-10 group-hover:border-blue/50 group-hover:scale-110 transition-all duration-300">
                                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(commit.category)}`}></div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-text text-base hover:text-blue cursor-pointer transition-colors leading-snug">
                                                {commit.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-subtext0">
                                                <span className="font-medium text-text">You</span>
                                                <span>committed</span>
                                                <span className="font-mono bg-surface0 px-1.5 py-0.5 rounded text-[10px]">{timeAgo}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingCommit(commit)}
                                                className="p-1.5 hover:bg-surface0 rounded text-subtext0 hover:text-text transition-colors"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    {commit.description && (
                                        <div className="mt-3 text-sm text-subtext0 bg-surface0/20 p-3 rounded border border-transparent hover:border-surface1 transition-colors cursor-text">
                                            {commit.description}
                                        </div>
                                    )}

                                    {/* Footer / Meta */}
                                    <div className="mt-3 flex items-center gap-4">
                                        <CategoryBadge category={commit.category} />

                                        <div className="flex items-center gap-1 text-xs text-subtext0 font-mono" title={`Effort Level: ${commit.effort}`}>
                                            <span className="text-yellow">⚡</span>
                                            <span>{commit.effort}</span>
                                        </div>

                                        <div className="flex-1"></div>

                                        <div className="flex gap-3">
                                            <button className="flex items-center gap-1.5 text-xs text-subtext0 hover:text-blue transition-colors group/btn">
                                                <MessageSquare size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                <span>0</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(commit.id)}
                                                className="flex items-center gap-1.5 text-xs text-subtext0 hover:text-red transition-colors group/btn"
                                            >
                                                <Star size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <EditModal
                isOpen={!!editingCommit}
                onClose={() => setEditingCommit(null)}
                onSave={onUpdate}
                commit={editingCommit}
            />
        </>
    );
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    let colors = "bg-surface1 text-text border-surface0";
    // Using Catppuccin palette classes defined in index.css theme
    switch (category) {
        case 'Coding': colors = "bg-blue/10 text-blue border-blue/20"; break;
        case 'Learning': colors = "bg-yellow/10 text-yellow border-yellow/20"; break;
        case 'Health': colors = "bg-green/10 text-green border-green/20"; break;
        case 'Meeting': colors = "bg-peach/10 text-peach border-peach/20"; break;
        case 'Planning': colors = "bg-mauve/10 text-mauve border-mauve/20"; break;
    }

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colors}`}>
            {category}
        </span>
    );
};

function getCategoryColor(category: string) {
    switch (category) {
        case 'Coding': return 'bg-blue';
        case 'Learning': return 'bg-yellow';
        case 'Health': return 'bg-green';
        case 'Meeting': return 'bg-peach';
        case 'Planning': return 'bg-mauve';
        default: return 'bg-subtext0';
    }
}

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
}
