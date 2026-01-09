import React, { useState, useEffect } from 'react';
import { Plus, Flame, GitBranch } from 'lucide-react';
import type { NewCommit, Repository } from '../types';
import { useCommits } from '../hooks/useCommits';

interface CommitFormProps {
    onAdd: (commit: NewCommit) => void;
}

const CATEGORIES = ['Coding', 'Learning', 'Health', 'Meeting', 'Planning', 'Other'];

export const CommitForm: React.FC<CommitFormProps> = ({ onAdd }) => {
    const { repositories } = useCommits();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [effort, setEffort] = useState(3);
    const [repoId, setRepoId] = useState<number | undefined>(undefined);
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
        onAdd({
            title,
            description,
            category,
            effort,
            repository_id: repoId
        });
        // Reset
        setTitle('');
        setDescription('');
        setEffort(3);
        setShowError(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">New Commit</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Commit title e.g., Started DSA practice"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value.length >= 5) setShowError(false);
                        }}
                        className={`w-full bg-surface0 border ${showError ? 'border-red' : 'border-surface1'} rounded-md px-3 py-2 text-text placeholder-surface1 focus:outline-none focus:border-blue transition-colors`}
                    />
                    {showError && (
                        <div className="absolute top-full left-0 mt-1 text-xs text-red bg-red/10 px-2 py-1 rounded animate-in fade-in slide-in-from-top-1">
                            Title is required (min 5 characters)
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-surface0 border border-surface1 rounded-md px-3 py-2 text-text focus:outline-none focus:border-blue cursor-pointer"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Repository</label>
                    <div className="relative">
                        <GitBranch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext0" />
                        <select
                            value={repoId}
                            onChange={(e) => setRepoId(Number(e.target.value))}
                            className="w-full bg-surface0 border border-surface1 rounded-md pl-9 pr-3 py-2 text-text focus:outline-none focus:border-blue cursor-pointer appearance-none"
                            disabled={repositories.length === 0}
                        >
                            {repositories.length === 0 && <option>No repositories</option>}
                            {repositories.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-xs font-bold text-subtext0 uppercase tracking-wide">Effort</label>
                    <div className="flex items-center gap-1 text-xs font-mono text-yellow">
                        <Flame size={12} className="fill-yellow" />
                        <span>{effort}/5</span>
                    </div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="5"
                    value={effort}
                    onChange={(e) => setEffort(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface0 rounded-lg appearance-none cursor-pointer accent-blue"
                />
                <div className="flex justify-between text-[10px] text-subtext1 px-0.5">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>

            <div className="pt-2 border-t border-surface0/50">
                <label className="text-xs font-bold text-subtext0 uppercase tracking-wide block mb-1">Describe intent and context (optional)</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe intent context (optional)"
                        className="flex-1 bg-surface0 border border-surface1 rounded-md px-3 py-2 text-text placeholder-surface1 focus:outline-none focus:border-blue text-sm"
                    />
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tags"
                            className="w-full bg-surface0 border border-surface1 rounded-md px-3 py-2 text-text placeholder-surface1 focus:outline-none focus:border-blue text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-subtext0 hidden sm:block">Ctrl+Enter to commit</span>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue hover:bg-blue/90 text-crust font-bold py-2 px-6 rounded-md shadow-lg shadow-blue/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Commit
                    </button>
                </div>
            </div>
        </form>
    );
};
