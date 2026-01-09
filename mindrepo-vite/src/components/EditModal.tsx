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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-base border border-surface0 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="p-4 border-b border-surface0 flex justify-between items-center bg-surface0/30">
                    <h2 className="font-bold text-text">Edit Commit</h2>
                    <button onClick={onClose} className="text-subtext0 hover:text-text transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-subtext0 uppercase mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-surface0 border border-surface1 rounded px-3 py-2 text-text focus:border-blue focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-subtext0 uppercase mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-surface0 border border-surface1 rounded px-3 py-2 text-text focus:border-blue focus:outline-none appearance-none cursor-pointer"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-subtext0 uppercase mb-1.5">Effort ({effort})</label>
                            <input
                                type="range" min="1" max="5"
                                value={effort}
                                onChange={e => setEffort(parseInt(e.target.value))}
                                className="w-full h-1 bg-surface1 rounded-lg appearance-none cursor-pointer accent-blue mt-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-subtext0 uppercase mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-surface0 border border-surface1 rounded px-3 py-2 text-text focus:border-blue focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface0">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-surface1 text-subtext0 hover:bg-surface0 hover:text-text transition-colors text-sm font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-green text-base font-bold hover:opacity-90 transition-opacity text-sm shadow-lg shadow-green/20">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
