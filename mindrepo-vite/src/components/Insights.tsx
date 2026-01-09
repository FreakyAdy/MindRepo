import React, { useState, useEffect } from 'react';
import type { Insight } from '../types';
import { api } from '../api';
import { RefreshCw, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface InsightsProps {
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
            <div className="bg-mantle border border-surface0 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-surface0 rounded w-1/2 mb-3"></div>
                <div className="h-16 bg-surface0 rounded w-full"></div>
            </div>
        );
    }

    if (!insight) return null;

    const severityColor =
        insight.severity === 'high' ? 'text-red bg-red/10 border-red/20' :
            insight.severity === 'medium' ? 'text-yellow bg-yellow/10 border-yellow/20' :
                'text-green bg-green/10 border-green/20';

    return (
        <div className="bg-mantle border border-surface0 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-surface0 flex justify-between items-center bg-surface0/20">
                <span className="font-bold text-sm">MindRepo Intelligence</span>
                <button onClick={handleRefresh} disabled={loading} className="text-subtext0 hover:text-text transition-colors">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${severityColor}`}>
                        {insight.severity}
                    </span>
                    <span className="text-xs text-subtext0">{new Date(insight.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <p className="font-bold text-text mb-3 leading-snug">{insight.summary}</p>

                <div className="bg-surface0/30 rounded p-3">
                    <button
                        onClick={() => setShowExplain(!showExplain)}
                        className="w-full flex justify-between items-center text-xs font-medium text-blue hover:text-blue/80 transition-colors"
                    >
                        <span>{showExplain ? "Hide Analysis" : "Show Analysis"}</span>
                        {showExplain ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showExplain && (
                        <ul className="mt-3 text-sm text-subtext0 list-disc pl-4 space-y-1">
                            {insight.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-surface0 flex items-center gap-1.5 text-xs font-medium text-subtext1 opacity-75">
                    <Zap size={12} className="fill-current" />
                    <span>Powered by SimpleLogic™</span>
                </div>
            </div>
        </div>
    );
};
