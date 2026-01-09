import React from 'react';
import type { Commit } from '../types';
import { Star, GitCommit, MoreHorizontal } from 'lucide-react';

interface TimelineProps {
    commits: Commit[];
    onDelete: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ commits, onDelete }) => {
    if (commits.length === 0) {
        return (
            <div className="feed-card" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
                <p className="text-muted">No activity yet.</p>
            </div>
        );
    }

    return (
        <div className="timeline-feed">
            {commits.map((commit) => {
                const date = new Date(commit.timestamp);
                const timeAgo = getTimeAgo(date);

                return (
                    <div key={commit.id} className="feed-card">
                        <div className="feed-header">
                            <div style={{ marginTop: '0.25rem' }}>
                                <div className="feed-icon">
                                    <GitCommit size={16} />
                                </div>
                            </div>

                            <div className="feed-content">
                                <div className="feed-meta">
                                    <div>
                                        <span className="font-bold">You</span>
                                        <span className="text-muted"> commited a thought</span>
                                        <span className="text-muted" style={{ margin: '0 0.25rem' }}>•</span>
                                        <span className="text-muted text-xs">{timeAgo}</span>
                                    </div>
                                    <button
                                        onClick={() => onDelete(commit.id)}
                                        className="icon-btn"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>

                                <div className="commit-box">
                                    <div className="commit-title">
                                        {commit.title}
                                    </div>
                                    <div className="commit-desc">
                                        {commit.description}
                                    </div>
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
