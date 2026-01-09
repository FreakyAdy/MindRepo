import React, { useMemo } from 'react';
import type { Commit } from '../types';
import { Activity } from 'lucide-react';

interface InsightsProps {
    commits: Commit[];
}

export const Insights: React.FC<InsightsProps> = ({ commits }) => {
    const insights = useMemo(() => {
        if (commits.length < 3) return null;

        const categoryCounts: Record<string, number> = {};
        commits.forEach(c => {
            categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        });

        const entries = Object.entries(categoryCounts);
        const sortedCategories = entries.sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories[0];

        return {
            topCategory: topCategory ? topCategory[0] : 'None',
            totalCommits: commits.length,
        };
    }, [commits]);

    if (!insights) {
        return (
            <div className="insights-card" style={{ padding: '1rem' }}>
                <h3 className="section-title">Explore</h3>
                <p className="text-xs text-muted">Add more thoughts to unlock insights about your mind.</p>
            </div>
        );
    }

    return (
        <div className="insights-card">
            <div className="insights-header">
                <span>Latest from your mind</span>
            </div>
            <div className="insights-body">
                <div className="timeline-line"></div>

                <div className="insight-item">
                    <div className="insight-dot"></div>
                    <p className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>Focus</p>
                    <p className="text-sm font-bold">Mostly thinking about <span className="text-blue">{insights.topCategory}</span></p>
                </div>

                <div className="insight-item">
                    <div className="insight-dot"></div>
                    <p className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>Momentum</p>
                    <p className="text-sm font-bold"><span className="text-green">{insights.totalCommits}</span> thoughts captured</p>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <a href="#" className="text-xs font-bold text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        View changelog <Activity size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
};
