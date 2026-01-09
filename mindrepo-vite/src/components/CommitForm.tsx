import React, { useState } from 'react';
import type { NewCommit } from '../types';
import { Send, Hash, Gauge } from 'lucide-react';

interface CommitFormProps {
    onAdd: (commit: NewCommit) => void;
}

const CATEGORIES = ['Coding', 'Learning', 'Health', 'Meeting', 'Planning', 'Other'];

export const CommitForm: React.FC<CommitFormProps> = ({ onAdd }) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Coding');
    const [effort, setEffort] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        const lines = description.trim().split('\n');
        let title = lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '');
        if (title.length < 5) title = (title + ".....").substring(0, 10);

        onAdd({
            title,
            description: description,
            category,
            effort,
            timestamp: new Date().toISOString(),
        });

        setDescription('');
        setEffort(1);
    };

    return (
        <div className="bg-mantle border border-surface0 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit}>
                <div className="px-4 pt-2 pb-2 flex gap-4 items-center border-b border-surface0 mb-2">
                    <div className="flex items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="text-xs bg-surface0 text-text rounded p-1.5 border border-surface1 focus:outline-none focus:border-blue transition-colors cursor-pointer"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2" title={`Effort Level: ${effort}/5`}>
                        <Gauge size={14} className="text-subtext0" />
                        <input
                            type="range" min="1" max="5" step="1"
                            value={effort}
                            onChange={(e) => setEffort(parseInt(e.target.value))}
                            className="w-24 h-1 bg-surface1 rounded-lg appearance-none cursor-pointer accent-blue"
                        />
                        <span className="text-xs text-subtext0 font-mono w-6">{effort}/5</span>
                    </div>
                </div>

                <textarea
                    className="w-full bg-transparent text-text p-4 min-h-[100px] focus:outline-none resize-y placeholder:text-subtext0"
                    placeholder="What did you do? (First line becomes title)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="p-2 flex justify-between items-center bg-surface0/30 rounded-b-lg">
                    <div className="flex items-center px-2">
                        <button type="button" className="text-subtext0 hover:text-text transition-colors p-1" title="Add tags (Coming soon)">
                            <Hash size={16} />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!description.trim()}
                        className="bg-green text-base px-4 py-1.5 rounded-md font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Commit <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};
