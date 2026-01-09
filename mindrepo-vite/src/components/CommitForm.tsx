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

        // "Ask anything" vibe: first line is title
        const lines = description.trim().split('\n');
        let title = lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '');

        // Fallback if title is too short, use random or just the text
        if (title.length < 5) title = (title + ".....").substring(0, 10); // Hacky quick fix for MVP validation

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
        <div className="commit-form-card">
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    {/* Category & Effort inputs embedded in top of card for smoother UX */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="text-xs bg-[var(--surface0)] text-[var(--text)] rounded p-1 border border-[var(--surface1)] focus:outline-none"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Gauge size={14} className="text-muted" />
                        <input
                            type="range" min="1" max="5" step="1"
                            value={effort}
                            onChange={(e) => setEffort(parseInt(e.target.value))}
                            className="w-24 accent-[var(--blue)] h-1 bg-[var(--surface1)] rounded-lg appearance-none cursor-pointer"
                            title={`Effort: ${effort}`}
                        />
                        <span className="text-xs text-muted">{effort}/5</span>
                    </div>
                </div>

                <textarea
                    className="commit-textarea"
                    placeholder="What did you do? (Minimum 5 chars for title)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ borderTop: 'none', borderRadius: '0' }}
                />

                <div className="form-actions">
                    <div className="flex-center">
                        <button type="button" className="action-btn">
                            <Hash size={16} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!description.trim()}
                        className="action-btn"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};
