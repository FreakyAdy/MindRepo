import React, { useState } from 'react';
import type { NewCommit } from '../types';
import { Send, Hash } from 'lucide-react';

interface CommitFormProps {
    onAdd: (commit: NewCommit) => void;
}

export const CommitForm: React.FC<CommitFormProps> = ({ onAdd }) => {
    const [description, setDescription] = useState('');

    // Hardcoded for "Ask anything" style simplicity
    const category = 'General';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        // For the "Ask anything" vibe, we'll extract the first line as title
        const lines = description.trim().split('\n');
        const title = lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '');

        onAdd({
            title,
            description: description,
            category,
            timestamp: new Date().toISOString(),
        });

        setDescription('');
    };

    return (
        <div className="commit-form-card">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="commit-textarea"
                    placeholder="Ask anything"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
