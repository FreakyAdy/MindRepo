import { useState, useEffect } from 'react';
import type { Commit, NewCommit } from '../types';

const API_URL = 'http://localhost:8000';

export const useCommits = () => {
    const [commits, setCommits] = useState<Commit[]>([]);

    const fetchCommits = async () => {
        try {
            const response = await fetch(`${API_URL}/commits`);
            if (response.ok) {
                const data = await response.json();
                setCommits(data);
            }
        } catch (error) {
            console.error('Failed to fetch commits:', error);
        }
    };

    useEffect(() => {
        fetchCommits();
    }, []);

    const addCommit = async (newCommit: NewCommit) => {
        try {
            const response = await fetch(`${API_URL}/commits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCommit),
            });
            if (response.ok) {
                // Refresh entire list to ensure sync (or append result)
                fetchCommits();
            }
        } catch (error) {
            console.error('Failed to add commit:', error);
        }
    };

    const deleteCommit = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/commits/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCommits();
            }
        } catch (error) {
            console.error('Failed to delete commit:', error);
        }
    };

    return { commits, addCommit, deleteCommit };
};
