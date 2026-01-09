import type { Commit, NewCommit, Insight } from './types';

const API_URL = 'http://localhost:8000';

export const api = {
    fetchCommits: async (search?: string, category?: string, limit: number = 20): Promise<Commit[]> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (limit) params.append('limit', limit.toString());

        const res = await fetch(`${API_URL}/commits?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch commits');
        return res.json();
    },

    createCommit: async (commit: NewCommit): Promise<Commit> => {
        const res = await fetch(`${API_URL}/commits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commit),
        });
        if (!res.ok) throw new Error('Failed to create commit');
        return res.json();
    },

    updateCommit: async (id: number, commit: Partial<NewCommit>): Promise<Commit> => {
        const res = await fetch(`${API_URL}/commits/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commit),
        });
        if (!res.ok) throw new Error('Failed to update commit');
        return res.json();
    },

    deleteCommit: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/commits/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete commit');
    },

    fetchInsights: async (): Promise<Insight> => {
        const res = await fetch(`${API_URL}/insights`);
        if (!res.ok) throw new Error('Failed to fetch insights');
        return res.json();
    },

    refreshInsights: async (): Promise<Insight> => {
        const res = await fetch(`${API_URL}/insights/refresh`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to refresh insights');
        return res.json();
    }
};
