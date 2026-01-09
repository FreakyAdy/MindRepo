import { useState, useEffect, useCallback } from 'react';
import type { Commit, NewCommit } from '../types';
import { api } from '../api';

export const useCommits = () => {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCommits = useCallback(async (search?: string, category?: string) => {
        setLoading(true);
        try {
            const data = await api.fetchCommits(search, category);
            setCommits(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch commits');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommits();
    }, [fetchCommits]);

    const addCommit = async (newCommit: NewCommit) => {
        try {
            await api.createCommit(newCommit);
            fetchCommits(); // Refresh list
        } catch (err) {
            console.error(err);
            setError('Failed to add commit');
        }
    };

    const updateCommit = async (id: number, commit: Partial<NewCommit>) => {
        try {
            await api.updateCommit(id, commit);
            fetchCommits();
        } catch (err) {
            console.error(err);
            setError('Failed to update commit');
        }
    };

    const deleteCommit = async (id: number) => { // Changed id to number
        try {
            await api.deleteCommit(id);
            fetchCommits();
        } catch (err) {
            console.error(err);
            setError('Failed to delete commit');
        }
    };

    const refresh = (search?: string, category?: string) => fetchCommits(search, category);

    return { commits, loading, error, addCommit, updateCommit, deleteCommit, refresh };
};
