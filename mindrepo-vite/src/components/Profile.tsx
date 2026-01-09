import { useState, useEffect } from 'react';
import { api } from '../api';
import type { ProfileStats, HeatmapPoint } from '../types';
import { GitCommit, Calendar, Layers, Activity } from 'lucide-react';

const LEVEL_COLORS = [
    'bg-surface0', // 0 commits
    'bg-green/30', // 1-2 commits
    'bg-green/60', // 3-5 commits
    'bg-green',    // 6+ commits
];

export function Profile({ onNavigateRepo }: { onNavigateRepo: (repoId: number) => void }) {
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const data = await api.fetchProfile();
        setStats(data);
        setLoading(false);
    };

    if (loading) return <div className="text-center p-8 text-subtext0">Loading profile...</div>;
    if (!stats) return <div className="text-center p-8 text-red">Failed to load profile.</div>;

    // Heatmap Logic: Fill in missing days for the last 365 days
    const today = new Date();
    const heatmapMap = new Map<string, HeatmapPoint>();
    stats.heatmap_data.forEach(p => heatmapMap.set(p.date, p));

    const fullHeatmap: { date: string, count: number, level: number }[] = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        if (heatmapMap.has(dateStr)) {
            fullHeatmap.push(heatmapMap.get(dateStr)!);
        } else {
            fullHeatmap.push({ date: dateStr, count: 0, level: 0 });
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* 1. HEADER SECTION */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-surface0 border-2 border-surface1 flex items-center justify-center text-4xl">
                    🧑‍💻
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-text">Aditya</h1>
                    <p className="text-subtext0 mb-4">Tracking personal growth through commits</p>

                    <div className="flex flex-wrap gap-4">
                        <StatBadge icon={<Layers size={16} />} label="Total Repos" value={stats.total_repos} />
                        <StatBadge icon={<GitCommit size={16} />} label="Total Commits" value={stats.total_commits} />
                        <StatBadge icon={<Calendar size={16} />} label="Active Days" value={stats.active_days} />
                        <StatBadge icon={<Activity size={16} />} label="Top Category" value={stats.most_active_category || 'N/A'} />
                    </div>
                </div>
            </div>

            {/* 2. ACTIVITY CONTRIBUTION GRAPH */}
            <div className="bg-mantle border border-surface0 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-text mb-4">Contribution Activity</h2>
                <div className="overflow-x-auto pb-2">
                    <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[700px] w-full">
                        {fullHeatmap.map((day) => (
                            <div
                                key={day.date}
                                className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[day.level]} hover:ring-1 hover:ring-text transition-all cursor-pointer relative group`}
                                title={`${day.date}: ${day.count} commits`}
                            >
                                {/* Simple Tooltip */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2 text-xs text-subtext0">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {LEVEL_COLORS.map(c => <div key={c} className={`w-3 h-3 rounded-sm ${c}`}></div>)}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 3. REPOSITORY SUMMARY SECTION */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-text">Repositories</h2>
                    <div className="bg-mantle border border-surface0 rounded-lg overflow-hidden">
                        {stats.repo_summaries.map((repo) => (
                            <div
                                key={repo.id}
                                onClick={() => onNavigateRepo(repo.id)}
                                className="flex items-center justify-between p-3 border-b border-surface0 last:border-0 hover:bg-surface0/50 cursor-pointer transition-colors"
                            >
                                <div>
                                    <div className="font-medium text-text">{repo.name}</div>
                                    <div className="text-xs text-subtext0">{repo.primary_category || 'No activity'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-text">{repo.total_commits}</div>
                                    <div className="text-xs text-subtext0">commits</div>
                                </div>
                            </div>
                        ))}
                        {stats.repo_summaries.length === 0 && (
                            <div className="p-4 text-center text-subtext0 text-sm">No repositories yet.</div>
                        )}
                    </div>
                </div>

                {/* 4. ACTIVITY BREAKDOWN */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-text">Activity Breakdown</h2>
                    <div className="bg-mantle border border-surface0 rounded-lg p-4 space-y-3">
                        {stats.category_breakdown.map((cat) => (
                            <div key={cat.category} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium text-text">
                                    <span>{cat.category}</span>
                                    <span>{cat.count}</span>
                                </div>
                                <div className="w-full h-2 bg-surface0 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue"
                                        style={{ width: `${(cat.count / stats.total_commits) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {stats.category_breakdown.length === 0 && (
                            <div className="text-center text-subtext0 text-sm">No activity data.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatBadge = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-center gap-2 bg-mantle border border-surface0 px-3 py-1.5 rounded-full shadow-sm">
        <div className="text-blue">{icon}</div>
        <div className="flex flex-col leading-none">
            <span className="text-[10px] text-subtext0 uppercase font-bold">{label}</span>
            <span className="text-sm font-bold text-text">{value}</span>
        </div>
    </div>
);
