import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CommitForm } from './components/CommitForm';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { RepoView } from './components/RepoView';
import { Profile } from './components/Profile';
import { useCommits } from './hooks/useCommits';
import { BookMarked, Search, Filter, GitBranch, Calendar, Settings as SettingsIcon } from 'lucide-react';
import type { Repository } from './types';

// View Types
type View = 'dashboard' | 'repository' | 'settings' | 'profile';

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CATEGORIES = ['All', 'Coding', 'Learning', 'Health', 'Meeting', 'Planning', 'Other'];

function App() {
  const { commits, repositories, addCommit, deleteCommit, updateCommit, createRepository, deleteRepository, refresh } = useCommits();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeRepo, setActiveRepo] = useState<Repository | undefined>(undefined);

  // Dashboard Specific State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const debouncedSearch = useDebounceValue(searchTerm, 500);

  // New Repo Modal State
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Repo Confirmation State
  const [repoToDelete, setRepoToDelete] = useState<Repository | null>(null);

  useEffect(() => {
    if (currentView === 'dashboard') {
      refresh(debouncedSearch, selectedCategory === 'All' ? undefined : selectedCategory);
    }
  }, [debouncedSearch, selectedCategory, refresh, currentView]);

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to create repo:", newRepoName);
    if (!newRepoName) {
      console.log("Repo name is empty, aborting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRepository(newRepoName, newRepoDesc);
      console.log("Repo created successfully");
      setIsRepoModalOpen(false);
      setNewRepoName('');
      setNewRepoDesc('');
    } catch (error) {
      console.error("Failed to create repo:", error);
      alert("Failed to create repository. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRepo = async () => {
    if (!repoToDelete) return;
    await deleteRepository(repoToDelete.id);
    // If the deleted repo was active, clear it
    if (activeRepo?.id === repoToDelete.id) {
      setActiveRepo(undefined);
      setCurrentView('dashboard');
    }
    setRepoToDelete(null);
  };

  return (
    <Layout
      view={currentView}
      onNavigate={(v) => setCurrentView(v as View)}
      onPlusClick={() => setIsRepoModalOpen(true)}
      onProfileClick={() => setCurrentView('profile')}
    >
      {currentView === 'profile' ? (
        <Profile
          onNavigateRepo={(repoId) => {
            const repo = repositories.find(r => r.id === repoId);
            if (repo) {
              setActiveRepo(repo);
              setCurrentView('repository');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-8">

          {/* LEFT COLUMN: Navigation & Repos */}
          <div className="space-y-6">
            {/* Navigation Menu */}
            <div className="bg-mantle border border-surface0 rounded-lg p-2 shadow-sm">
              <NavItem
                icon={<Calendar size={16} />}
                label="Dashboard"
                active={currentView === 'dashboard'}
                onClick={() => { setCurrentView('dashboard'); setActiveRepo(undefined); }}
              />
              <NavItem
                icon={<GitBranch size={16} />}
                label="Repositories"
                active={currentView === 'repository' && !activeRepo}
                onClick={() => { setCurrentView('repository'); setActiveRepo(undefined); }}
              />
              <NavItem
                icon={<SettingsIcon size={16} />}
                label="Settings"
                active={currentView === 'settings'}
                onClick={() => setCurrentView('settings')}
              />
            </div>

            {/* Top Repos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-sm text-text">Repositories</span>
                <button
                  onClick={() => setIsRepoModalOpen(true)}
                  className="bg-green hover:bg-green/90 text-crust text-xs px-2 py-0.5 rounded font-bold transition-all"
                >
                  New
                </button>
              </div>

              <div className="bg-mantle border border-surface0 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                <div className="p-2 space-y-1">
                  {repositories.map(repo => (
                    <RepoItem
                      key={repo.id}
                      name={repo.name}
                      active={activeRepo?.id === repo.id}
                      onClick={() => {
                        setActiveRepo(repo);
                        setCurrentView('repository');
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setRepoToDelete(repo);
                      }}
                    />
                  ))}
                  {repositories.length === 0 && (
                    <div className="text-xs text-subtext0 p-2 text-center">No repositories found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Categories Wrapper */}
            {currentView === 'dashboard' && (
              <div className="bg-mantle border border-surface0 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-sm mb-3 text-text">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(1).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${selectedCategory === cat
                        ? 'bg-blue text-base border-blue'
                        : 'bg-surface0 text-subtext0 border-surface1 hover:border-subtext0'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CENTER COLUMN: Main Content */}
          <div className="min-h-[500px]">
            {currentView === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-mantle border border-surface0 rounded-lg shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/50 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-blue/50 to-transparent opacity-50"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue/5 rounded-full blur-3xl pointer-events-none"></div>
                  <CommitForm onAdd={addCommit} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-mantle border border-surface0 rounded-lg p-2 shadow-sm">
                    <div className="flex items-center gap-3 px-2 flex-1">
                      <Search size={16} className="text-subtext0" />
                      <input
                        type="text"
                        placeholder="Filter by commit message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-subtext0 text-text"
                      />
                    </div>
                    <div className="h-6 w-px bg-surface0"></div>
                    <div className="px-2">
                      <Filter size={16} className="text-subtext0 cursor-pointer hover:text-text transition-colors" />
                    </div>
                  </div>

                  <Timeline
                    commits={commits}
                    onDelete={deleteCommit}
                    onUpdate={updateCommit}
                  />
                </div>
              </div>
            )}

            {currentView === 'repository' && (
              <RepoView repository={activeRepo} />
            )}

            {currentView === 'settings' && (
              <div className="bg-mantle border border-surface0 rounded-lg p-8 text-center animate-in zoom-in-95 duration-300">
                <SettingsIcon size={48} className="mx-auto text-surface1 mb-4" />
                <h2 className="text-xl font-bold text-text mb-2">Settings</h2>
                <p className="text-subtext0">Configuration options coming soon.</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Insights) */}
          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <div className="sticky top-24">
                <Insights refreshTrigger={commits.length} />

                <div className="mt-8 p-4 bg-gradient-to-br from-blue/10 to-mauve/10 border border-blue/20 rounded-lg">
                  <h4 className="font-bold text-sm text-text mb-1">Pro Tip</h4>
                  <p className="text-xs text-subtext0">Drag the effort slider to track your mental energy levels accurately.</p>
                </div>

                <footer className="mt-8 text-xs text-subtext0 flex flex-wrap gap-x-4 gap-y-2 px-2">
                  <a href="#" className="hover:text-blue">About</a>
                  <a href="#" className="hover:text-blue">Blog</a>
                  <a href="#" className="hover:text-blue">Terms</a>
                  <a href="#" className="hover:text-blue">Privacy</a>
                  <span>© 2026 MindRepo</span>
                </footer>
              </div>
            )}

            {currentView === 'repository' && activeRepo && (
              <div className="sticky top-24 space-y-4 animate-in slide-in-from-right-4">
                <div className="bg-mantle border border-surface0 rounded-lg p-4">
                  <h3 className="font-bold text-sm mb-3">About</h3>
                  <p className="text-sm text-subtext0 mb-4">{activeRepo.description || "No description."}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-subtext0">
                      <BookMarked size={14} />
                      <span>Readme</span>
                    </div>
                    <div className="flex items-center gap-2 text-subtext0">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue"></div>
                      <span>TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW REPO MODAL */}
      {isRepoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-crust/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-mantle border border-surface0 rounded-lg p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-text mb-1">Create a new repository</h2>
            <p className="text-sm text-subtext0 mb-4">A repository contains all your commits and history.</p>

            <form onSubmit={handleCreateRepo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1">Name <span className="text-red">*</span></label>
                <input
                  type="text"
                  required
                  value={newRepoName}
                  onChange={e => setNewRepoName(e.target.value)}
                  placeholder="e.g. mindrepo/ideas"
                  className="w-full bg-surface0 border border-surface1 rounded py-2 px-3 text-text focus:border-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newRepoDesc}
                  onChange={e => setNewRepoDesc(e.target.value)}
                  placeholder="Short description of this repo"
                  className="w-full bg-surface0 border border-surface1 rounded py-2 px-3 text-text focus:border-blue focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRepoModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-subtext0 hover:text-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green hover:bg-green/90 disabled:opacity-70 disabled:cursor-not-allowed text-crust font-bold rounded text-sm transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : 'Create Repository'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE REPO CONFIRMATION MODAL */}
      {repoToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-crust/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-mantle border border-red/30 rounded-lg p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-red mb-2">Delete Repository?</h2>
            <p className="text-sm text-subtext0 mb-4">
              Are you sure you want to delete <strong className="text-text">{repoToDelete.name}</strong>?
              This will also delete all associated commits. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRepoToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-subtext0 hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRepo}
                className="px-4 py-2 bg-red hover:bg-red/90 text-crust font-bold rounded text-sm transition-colors"
              >
                Delete Repository
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

// Helper Components
const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${active
      ? 'bg-surface0 text-text font-bold shadow-sm'
      : 'text-subtext0 hover:bg-surface0/50 hover:text-text'
      }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue"></div>}
  </button>
);

const RepoItem = ({ name, active, onClick, onDelete }: { name: string, active: boolean, onClick: () => void, onDelete: (e: React.MouseEvent) => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors group ${active ? 'bg-surface0/80 border border-surface1' : 'hover:bg-surface0 border border-transparent'
      }`}
  >
    <BookMarked size={14} className={`${active ? 'text-blue' : 'text-subtext0'} group-hover:text-blue transition-colors`} />
    <span className={`text-sm font-medium flex-1 ${active ? 'text-text' : 'text-subtext0'} group-hover:text-text transition-colors truncate`}>{name}</span>
    <button
      onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red/20 rounded transition-all"
      title="Delete repository"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </button>
  </div>
);

export default App;
