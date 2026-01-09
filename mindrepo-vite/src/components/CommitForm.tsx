import React, { useState, useEffect } from 'react';
import { GitBranch } from 'lucide-react';
import type { NewCommit } from '../types';
import { useCommits } from '../hooks/useCommits';

interface CommitFormProps {
    onAdd: (commit: NewCommit) => void;
}

const CATEGORIES = ['Coding', 'Learning', 'Health', 'Meeting', 'Planning', 'Other'];

export const CommitForm: React.FC<CommitFormProps> = ({ onAdd }) => {
    const { repositories } = useCommits();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [effort, setEffort] = useState(3);
    const [repoId, setRepoId] = useState<number | undefined>(undefined);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showError, setShowError] = useState(false);

    // Set default repo based on category if possible
    useEffect(() => {
        if (repositories.length > 0) {
            const match = repositories.find(r => r.name.toLowerCase().includes(category.toLowerCase()));
            if (match) setRepoId(match.id);
            else setRepoId(repositories[0].id);
        }
    }, [category, repositories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.length < 5) {
            setShowError(true);
            return;
        }
        if (!repoId) {
            setShowError(true);
            return;
        }
        onAdd({
            title,
            description: '', // Merged into title for "Ask anything" feel, or add separate field if needed
            category,
            effort,
            repository_id: repoId
        });
        // Reset
        setTitle('');
        setEffort(3);
        setShowError(false);
        setIsExpanded(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">Ask anything</h2>
            </div>

            <div className="relative group">
                <textarea
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value.length >= 5) setShowError(false);
                    }}
                    onFocus={() => setIsExpanded(true)}
                    placeholder="Add a commit message — what changed and why?"
                    className="w-full bg-surface0/50 border border-surface1 rounded-lg p-4 text-text placeholder-surface1 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition-all resize-none min-h-[120px]"
                />
                {showError && (
                    <div className="absolute top-2 right-2 text-xs text-red bg-red/10 px-2 py-1 rounded animate-in fade-in">
                        {!repoId ? 'Select a repository' : 'Min 5 chars'}
                    </div>
                )}
            </div>

            <div className={`mt-4 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-6 items-end transition-all duration-300 ${isExpanded || title ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>

                {/* Category & Repo Selection */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-surface0 border border-surface1 rounded-md px-3 py-1.5 text-sm text-text focus:outline-none focus:border-blue cursor-pointer hover:border-blue/50 transition-colors"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Repository</label>
                        <div className="relative">
                            <GitBranch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-subtext0" />
                            <select
                                value={repoId}
                                onChange={(e) => setRepoId(Number(e.target.value))}
                                className="w-full bg-surface0 border border-surface1 rounded-md pl-8 pr-3 py-1.5 text-sm text-text focus:outline-none focus:border-blue cursor-pointer hover:border-blue/50 transition-colors appearance-none"
                                disabled={repositories.length === 0}
                            >
                                {repositories.length === 0 && <option>No repositories</option>}
                                {repositories.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Effort Slider */}
                <div className="space-y-1 w-full max-w-xs">
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Effort</label>
                        <span className="text-xs font-mono text-blue">{effort}/5</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={effort}
                            onChange={(e) => setEffort(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-surface0 rounded-lg appearance-none cursor-pointer accent-blue hover:accent-blue/80 transition-all"
                        />
                        <div className="absolute -bottom-4 w-full flex justify-between text-[10px] text-subtext0 font-medium px-0.5">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={title.length < 5 || !repoId}
                        className="bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-crust font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-blue/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Commit
                    </button>
                </div>
            </div>
        </form>
    );
};
