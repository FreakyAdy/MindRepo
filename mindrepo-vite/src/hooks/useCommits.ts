import { useState, useEffect, useCallback } from 'react';
import { fetchCommits, createCommit, deleteCommit as apiDeleteCommit, updateCommit as apiUpdateCommit, fetchRepositories, createRepository as apiCreateRepository, deleteRepository as apiDeleteRepository } from '../api';
import type { Commit, NewCommit, Repository } from '../types';

export function useCommits() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [repositories, setRepositories] = useState<Repository[]>([]);

    const refresh = useCallback(async (search?: string, category?: string, repository_id?: number) => {
        const data = await fetchCommits(search, category, repository_id);
        setCommits(data);
    }, []);

    const refreshRepos = useCallback(async () => {
        const data = await fetchRepositories();
        setRepositories(data);
    }, []);

    useEffect(() => {
        refresh();
        refreshRepos();
    }, [refresh, refreshRepos]);

    const addCommit = async (commit: NewCommit) => {
        const newCommit = await createCommit(commit);
        setCommits((prev) => [newCommit, ...prev]);
    };

    const deleteCommit = async (id: number) => {
        await apiDeleteCommit(id);
        setCommits((prev) => prev.filter((c) => c.id !== id));
    };

    const updateCommit = async (id: number, commit: Partial<NewCommit>) => {
        const updated = await apiUpdateCommit(id, commit);
        setCommits(prev => prev.map(c => c.id === id ? updated : c));
    };

    const createRepository = async (name: string, description?: string) => {
        const newRepo = await apiCreateRepository(name, description);
        setRepositories(prev => [...prev, newRepo]);
        return newRepo;
    };

    const deleteRepository = async (id: number) => {
        await apiDeleteRepository(id);
        setRepositories(prev => prev.filter(r => r.id !== id));
        // Also remove commits from this repository
        setCommits(prev => prev.filter(c => c.repository_id !== id));
    };

    return { commits, repositories, addCommit, deleteCommit, updateCommit, createRepository, deleteRepository, refresh, refreshRepos };
}
