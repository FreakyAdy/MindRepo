import React, { useState, useEffect } from 'react';
import type { Commit, NewCommit } from '../types';
import { X } from 'lucide-react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, commit: Partial<NewCommit>) => void;
    commit: Commit | null;
}

const CATEGORIES = ['Coding', 'Learning', 'Health', 'Meeting', 'Planning', 'Other'];

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, commit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Coding');
    const [effort, setEffort] = useState(1);

    useEffect(() => {
        if (commit) {
            setTitle(commit.title);
            setDescription(commit.description || '');
            setCategory(commit.category);
            setEffort(commit.effort || 1);
        }
    }, [commit]);

    if (!isOpen || !commit) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(commit.id, { title, description, category, effort });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--base)] border border-[var(--border-color)] rounded-lg w-full max-w-lg shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--subtext0)] hover:text-[var(--text)]">
                    <X size={20} />
                </button>

                <h2 className="text-lg font-bold mb-4 text-[var(--text)]">Edit Commit</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--subtext1)] mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-[var(--surface0)] border border-[var(--surface1)] rounded p-2 text-[var(--text)] focus:border-[var(--blue)] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--subtext1)] mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[var(--surface0)] border border-[var(--surface1)] rounded p-2 text-[var(--text)] focus:border-[var(--blue)] focus:outline-none"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--subtext1)] mb-1">Effort ({effort})</label>
                        <input
                            type="range" min="1" max="5"
                            value={effort}
                            onChange={e => setEffort(parseInt(e.target.value))}
                            className="w-full accent-[var(--blue)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--subtext1)] mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-[var(--surface0)] border border-[var(--surface1)] rounded p-2 text-[var(--text)] focus:border-[var(--blue)] focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-[var(--surface1)] text-[var(--subtext0)] hover:bg-[var(--surface0)]">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded bg-[var(--blue)] text-[var(--base)] font-semibold hover:opacity-90">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
