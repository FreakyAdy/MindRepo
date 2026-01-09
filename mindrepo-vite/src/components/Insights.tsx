import React, { useState, useEffect } from 'react';
import type { Insight } from '../types'; // Updated type
import { api } from '../api';
import { Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface InsightsProps {
    // We fetch insights internally or pass them? Logic says fetch from API. 
    // passing trigger to refresh might be good.
    refreshTrigger?: number;
}

export const Insights: React.FC<InsightsProps> = ({ refreshTrigger }) => {
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(false);
    const [showExplain, setShowExplain] = useState(false);

    useEffect(() => {
        loadInsights();
    }, [refreshTrigger]);

    const loadInsights = async () => {
        setLoading(true);
        try {
            const data = await api.fetchInsights();
            setInsight(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = await api.refreshInsights();
            setInsight(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading && !insight) {
        return (
            <div className="insights-card p-4 animate-pulse">
                <div className="h-4 bg-[var(--surface0)] rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-[var(--surface0)] rounded w-full"></div>
            </div>
        );
    }

    if (!insight) return null;

    return (
        <div className="insights-card">
            <div className="insights-header flex justify-between items-center">
                <span>MindRepo Intelligence</span>
                <button onClick={handleRefresh} disabled={loading} className="text-[var(--subtext0)] hover:text-[var(--text)]">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <div className="insights-body">
                <div className="timeline-line"></div>

                <div className="insight-item">
                    <div className={`insight-dot bg-[var(--${insight.severity === 'high' ? 'red' : insight.severity === 'medium' ? 'yellow' : 'green'})]`}></div>

                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-1.5 rounded uppercase tracking-wider ${insight.severity === 'high' ? 'bg-[var(--red)] text-[var(--base)]' :
                            insight.severity === 'medium' ? 'bg-[var(--yellow)] text-[var(--base)]' :
                                'bg-[var(--green)] text-[var(--base)]'
                            }`}>
                            {insight.severity}
                        </span>
                        <span className="text-xs text-muted">{new Date(insight.generated_at).toLocaleTimeString()}</span>
                    </div>

                    <p className="text-sm font-bold text-[var(--text)] mb-2">{insight.summary}</p>

                    <button
                        onClick={() => setShowExplain(!showExplain)}
                        className="text-xs flex items-center gap-1 text-[var(--blue)] hover:underline mb-2"
                    >
                        {showExplain ? "Hide reasoning" : "Explain why"}
                        {showExplain ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {showExplain && (
                        <ul className="text-xs text-[var(--subtext0)] list-disc pl-4 space-y-1 mb-2 bg-[var(--mantle)] p-2 rounded">
                            {insight.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    )}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div className="text-xs font-bold text-muted flex items-center gap-1">
                        <Zap size={12} /> Powered by SimpleLogic™
                    </div>
                </div>
            </div>
        </div>
    );
};
