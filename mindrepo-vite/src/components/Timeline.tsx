import React, { useState } from 'react';
import type { Commit, NewCommit } from '../types';
import { EditModal } from './EditModal';
import { GitCommit, Star } from 'lucide-react';
// Actually I don't recall installing date-fns. I'll stick to my custom helper to be safe.

interface TimelineProps {
    commits: Commit[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, commit: Partial<NewCommit>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ commits, onDelete, onUpdate }) => {
    const [editingCommit, setEditingCommit] = useState<Commit | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Search and Filter state could be lifted, but for MVP local filtering is fine 
    // OR the parent passes filtered commits. 
    // The requirement said "Add search filter... above timeline". 
    // The `useCommits` hook handles fetching with params. 
    // For now, let's assume `commits` passed here are ALREADY filtered by the parent App, 
    // or we do client-side here. 
    // Let's stick to simple client-side search/filter on the *displayed* commits 
    // if the prop contains everything, OR better: UI controls here trigger parent fetch.
    // Actually, keeping it simple: The requirements said "Timeline: show commit cards...".
    // The App.tsx should likely hold the filter state and pass filtered commits.
    // But wait, the previous `Timeline` was just a list. 
    // Let's implement the list rendering here.

    if (commits.length === 0) {
        return (
            <div className="feed-card" style={{ textAlign: 'center', borderStyle: 'dashed', padding: '2rem' }}>
                <p className="text-muted">No activity found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="timeline-feed">
                {commits.map((commit) => {
                    const date = new Date(commit.timestamp);
                    const timeAgo = getTimeAgo(date);
                    const isExpanded = expandedId === commit.id;

                    return (
                        <div key={commit.id} className="feed-card group">
                            <div className="feed-header">
                                <div style={{ marginTop: '0.25rem' }}>
                                    <div className="feed-icon">
                                        <GitCommit size={16} />
                                    </div>
                                </div>

                                <div className="feed-content">
                                    <div className="feed-meta">
                                        <div>
                                            <span className="font-bold text-[var(--text)]">You</span>
                                            <span className="text-muted"> committed </span>
                                            <span className={`text - xs font - medium px - 1.5 py - 0.5 rounded - full border border - [var(--surface1)]bg - [var(--mantle)]text - [var(--${getCategoryColor(commit.category)})]`}>
                                                {commit.category}
                                            </span>
                                            <span className="text-muted" style={{ margin: '0 0.25rem' }}>•</span>
                                            <span className="text-muted text-xs" title={date.toLocaleString()}>{timeAgo}</span>
                                        </div>

                                        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button
                                                onClick={() => setEditingCommit(commit)}
                                                className="text-xs text-[var(--blue)] hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(commit.id)}
                                                className="text-xs text-[var(--red)] hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className="commit-box cursor-pointer hover:border-[var(--blue)] transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : commit.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="commit-title text-[var(--text)]">
                                                {commit.title}
                                            </div>
                                            <div className="text-xs font-mono text-[var(--subtext1)]" title="Effort">
                                                ⚡{commit.effort}
                                            </div>
                                        </div>
                                        {(isExpanded || (commit.description && commit.description.length < 100)) && (
                                            <div className="commit-desc mt-2">
                                                {commit.description}
                                            </div>
                                        )}
                                        {!isExpanded && commit.description && commit.description.length >= 100 && (
                                            <div className="text-xs text-[var(--subtext1)] mt-1">
                                                {commit.description.substring(0, 100)}... <span className="text-[var(--blue)]">show more</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                                        <button className="action-btn" style={{ fontSize: '0.75rem', gap: '0.25rem' }}>
                                            <Star size={14} />
                                            Star
                                        </button>
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

function getCategoryColor(cat: string) {
    switch (cat) {
        case 'Coding': return 'blue';
        case 'Learning': return 'yellow';
        case 'Health': return 'green';
        case 'Meeting': return 'peach';
        case 'Planning': return 'mauve';
        default: return 'subtext0';
    }
}
