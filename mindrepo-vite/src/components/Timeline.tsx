import React, { useState } from 'react';
import type { Commit, NewCommit } from '../types';
import { EditModal } from './EditModal';
import { Star } from 'lucide-react';

interface TimelineProps {
    commits: Commit[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, commit: Partial<NewCommit>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ commits, onDelete, onUpdate }) => {
    const [editingCommit, setEditingCommit] = useState<Commit | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (commits.length === 0) {
        return (
            <div className="bg-mantle border border-dashed border-surface0 rounded-lg p-8 text-center">
                <p className="text-subtext0">No activity found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-mantle border border-surface0 rounded-lg">
                {commits.map((commit, index) => {
                    const date = new Date(commit.timestamp);
                    const timeAgo = getTimeAgo(date);
                    const isExpanded = expandedId === commit.id;
                    const isLast = index === commits.length - 1;

                    return (
                        <div key={commit.id} className={`group p-4 flex gap-4 ${!isLast ? 'border-b border-surface0' : ''} hover:bg-surface0/20 transition-colors`}>
                            <div className="pt-1 flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full border-2 border-surface1 flex items-center justify-center bg-base z-10">
                                    <div className="w-2 h-2 rounded-full bg-subtext0"></div>
                                </div>
                                {!isLast && <div className="w-0.5 h-full bg-surface0 -mb-4 mt-1"></div>}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-text text-sm">You</span>
                                        <span className="text-subtext0 text-sm">committed</span>
                                        <CategoryBadge category={commit.category} />
                                        <span className="text-subtext0 text-xs">• {timeAgo}</span>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 text-xs">
                                        <button
                                            onClick={() => setEditingCommit(commit)}
                                            className="text-blue hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(commit.id)}
                                            className="text-red hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="bg-surface0/50 hover:bg-surface0 border border-transparent hover:border-blue/50 rounded p-3 cursor-pointer transition-all"
                                    onClick={() => setExpandedId(isExpanded ? null : commit.id)}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="font-semibold text-text truncate">
                                            {commit.title}
                                        </div>
                                        <div className="text-xs font-mono text-subtext1 shrink-0" title={`Effort: ${commit.effort}/5`}>
                                            ⚡{commit.effort}
                                        </div>
                                    </div>

                                    {(isExpanded || (commit.description && commit.description.length < 100)) && (
                                        <div className="mt-2 text-sm text-subtext0 whitespace-pre-wrap">
                                            {commit.description}
                                        </div>
                                    )}
                                    {!isExpanded && commit.description && commit.description.length >= 100 && (
                                        <div className="mt-1 text-xs text-subtext1">
                                            {commit.description.substring(0, 100)}... <span className="text-blue hover:underline">show more</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 flex gap-4">
                                    <button className="flex items-center gap-1 text-xs text-subtext0 hover:text-text transition-colors px-2 py-1 rounded hover:bg-surface0">
                                        <Star size={14} />
                                        <span>Star</span>
                                    </button>
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
    switch (category) {
        case 'Coding': colors = "bg-blue/10 text-blue border-blue/20"; break;
        case 'Learning': colors = "bg-yellow/10 text-yellow border-yellow/20"; break;
        case 'Health': colors = "bg-green/10 text-green border-green/20"; break;
        case 'Meeting': colors = "bg-peach/10 text-peach border-peach/20"; break;
        case 'Planning': colors = "bg-mauve/10 text-mauve border-mauve/20"; break;
    }

    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors}`}>
            {category}
        </span>
    );
};

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}
