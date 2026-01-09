import type { Commit, NewCommit, Repository } from './types';

const API_URL = 'http://localhost:8000';

export async function fetchCommits(search?: string, category?: string, repository_id?: number): Promise<Commit[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (repository_id) params.append('repository_id', repository_id.toString());

    try {
        const res = await fetch(`${API_URL}/commits?${params.toString()}`);
        if (!res.ok) {
            console.error(`API Error (fetchCommits): ${res.status} ${res.statusText}`);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Network Error (fetchCommits):", error);
        return [];
    }
}

export async function createCommit(commit: NewCommit): Promise<Commit> {
    try {
        const res = await fetch(`${API_URL}/commits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commit),
        });
        if (!res.ok) {
            const errorMsg = await res.text();
            console.error(`API Error (createCommit): ${res.status} - ${errorMsg}`);
            throw new Error(`Failed to save commit: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Network Error (createCommit):", error);
        throw error;
    }
}

export async function deleteCommit(id: number): Promise<void> {
    await fetch(`${API_URL}/commits/${id}`, { method: 'DELETE' });
}

export async function updateCommit(id: number, commit: Partial<NewCommit>): Promise<Commit> {
    const res = await fetch(`${API_URL}/commits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commit),
    });
    return res.json();
}

export async function fetchRepositories(): Promise<Repository[]> {
    try {
        const res = await fetch(`${API_URL}/repositories`);
        if (!res.ok) {
            console.error(`API Error (fetchRepositories): ${res.status} ${res.statusText}`);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Network Error (fetchRepositories):", error);
        return [];
    }
}

export async function createRepository(name: string, description?: string): Promise<Repository> {
    const res = await fetch(`${API_URL}/repositories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
    });
    if (!res.ok) throw new Error('Failed to create repository');
    return res.json();
}

export async function fetchInsights() {
    const res = await fetch(`${API_URL}/insights`);
    return res.json();
}

export async function refreshInsights() {
    const res = await fetch(`${API_URL}/insights/refresh`, { method: 'POST' });
    return res.json();
}

export const api = {
    fetchCommits,
    createCommit,
    deleteCommit,
    updateCommit,
    fetchRepositories,
    createRepository,
    fetchInsights,
    refreshInsights,
};
