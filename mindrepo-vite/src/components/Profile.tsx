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
        <div className="animate-in fade-in duration-500 max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[296px_1fr] gap-8">

                {/* 1. LEFT SIDEBAR (User Profile) */}
                <div className="md:-mt-8">
                    <div className="relative group">
                        <div className="w-[296px] h-[296px] rounded-full overflow-hidden border border-surface1 bg-surface0 shadow-sm relative z-10 transition-transform">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-10 right-0 z-20 bg-base border border-surface1 rounded-full p-2 shadow-sm text-subtext0 hover:text-blue cursor-pointer transition-colors">
                            <span className="text-lg">☺</span>
                        </div>
                    </div>

                    <div className="pt-4 pb-4">
                        <h1 className="text-[26px] font-bold text-text leading-tight">FreakyAdy</h1>
                        <div className="text-xl text-subtext0 font-light mb-4">freakyady</div>

                        <p className="text-text mb-4">Tracking personal growth through commits. Building MindRepo.</p>

                        <button className="w-full bg-surface0 border border-surface1 text-text font-medium py-1.5 rounded-md hover:bg-surface1 transition-colors text-sm mb-4">
                            Edit profile
                        </button>

                        <div className="flex items-center gap-4 text-sm text-subtext0 mb-6">
                            <div className="flex items-center gap-1 hover:text-blue cursor-pointer">
                                <span className="font-bold text-text">3</span> followers
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue cursor-pointer">
                                <span className="font-bold text-text">2</span> following
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-surface1 pt-4">
                            <h3 className="font-bold text-text text-sm mb-2">Organizations</h3>
                            <div className="flex gap-2">
                                <div className="w-9 h-9 bg-surface0 border border-surface1 rounded-md flex items-center justify-center cursor-pointer hover:border-blue transition-colors" title="MindRepo Org">
                                    <Activity size={20} className="text-blue" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT CONTENT */}
                <div className="space-y-6">

                    {/* Popular Repositories */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-normal text-text">Popular repositories</h2>
                            <span className="text-xs text-subtext0 hover:text-blue cursor-pointer">Customize your pins</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.repo_summaries.slice(0, 6).map((repo) => (
                                <div
                                    key={repo.id}
                                    onClick={() => onNavigateRepo(repo.id)}
                                    className="bg-base border border-surface1 rounded-md p-4 flex flex-col justify-between hover:border-subtext0 cursor-pointer transition-colors h-[100px]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-blue text-sm hover:underline">{repo.name}</span>
                                        <span className="text-xs border border-surface1 rounded-full px-2 py-0.5 text-subtext0">Public</span>
                                    </div>
                                    <div className="text-xs text-subtext0 mt-2 truncate">
                                        {repo.primary_category ? `${repo.primary_category} related tasks` : "No description"}
                                    </div>
                                    <div className="flex items-center gap-4 mt-auto text-xs text-subtext0 pt-3">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded-full bg-blue"></div>
                                            <span>TypeScript</span>
                                        </div>
                                        {repo.total_commits > 0 && (
                                            <div className="flex items-center gap-1 hover:text-blue">
                                                <GitCommit size={14} />
                                                <span>{repo.total_commits}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {stats.repo_summaries.length === 0 && (
                                <div className="text-sm text-subtext0 italic">No repositories yet. Create one to see it here!</div>
                            )}
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-normal text-text">{stats.total_commits} contributions in the last year</h2>
                            <div className="flex items-center gap-4 text-xs text-blue cursor-pointer">
                                <span>Contribution settings</span>
                            </div>
                        </div>

                        <div className="bg-mantle border border-surface0 rounded-lg p-4 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                {/* Heatmap Grid */}
                                <div className="overflow-x-auto pb-2 flex-1">
                                    <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[700px]">
                                        {fullHeatmap.map((day) => (
                                            <div
                                                key={day.date}
                                                className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]} hover:ring-1 hover:ring-text/50 transition-all cursor-pointer`}
                                                title={`${day.date}: ${day.count} commits`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Year Selector (Visual only for now) */}
                                <div className="ml-6 flex flex-col gap-2">
                                    <button className="bg-blue text-crust text-xs font-medium py-1.5 px-4 rounded-l-md w-full text-left">2026</button>
                                    <button className="text-subtext0 hover:bg-surface0 text-xs font-medium py-1.5 px-4 rounded-l-md w-full text-left transition-colors">2025</button>
                                    <button className="text-subtext0 hover:bg-surface0 text-xs font-medium py-1.5 px-4 rounded-l-md w-full text-left transition-colors">2024</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 text-xs text-subtext0 border-t border-surface0/50 pt-3">
                                <a href="#" className="hover:text-blue">Learn how we count contributions</a>
                                <div className="flex items-center gap-2">
                                    <span>Less</span>
                                    <div className="flex gap-1">
                                        {LEVEL_COLORS.map(c => <div key={c} className={`w-[10px] h-[10px] rounded-[2px] ${c}`}></div>)}
                                    </div>
                                    <span>More</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Breakdown (Mini) */}
                        <div className="mt-8">
                            <h2 className="text-base font-normal text-text mb-4">Contribution activity</h2>
                            <div className="relative border-l border-surface1 ml-4 space-y-6 pb-4">
                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-surface1"></div>
                                <div className="pl-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-text bg-surface0 px-2 py-0.5 rounded-md">January 2026</span>
                                    </div>
                                    {stats.category_breakdown.map((cat) => (
                                        <div key={cat.category} className="flex items-center gap-3 py-1 group">
                                            <div className="p-1.5 rounded-full bg-surface1 text-text group-hover:bg-blue group-hover:text-crust transition-colors">
                                                <GitCommit size={14} />
                                            </div>
                                            <div className="text-sm">
                                                Created {cat.count} commits in <span className="font-bold text-text">{cat.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.category_breakdown.length === 0 && (
                                        <div className="text-sm text-subtext0 italic">No activity yet this month.</div>
                                    )}
                                </div>
                            </div>
                        </div>
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
