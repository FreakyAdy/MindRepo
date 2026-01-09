import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CommitForm } from './components/CommitForm';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { RepoView } from './components/RepoView';
import { useCommits } from './hooks/useCommits';
import { BookMarked, Search, Filter, GitBranch, Calendar, Settings as SettingsIcon } from 'lucide-react';

// View Types
type View = 'dashboard' | 'repository' | 'settings';

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
  const { commits, addCommit, deleteCommit, updateCommit, refresh } = useCommits();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Dashboard Specific State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const debouncedSearch = useDebounceValue(searchTerm, 500);

  useEffect(() => {
    if (currentView === 'dashboard') {
      refresh(debouncedSearch, selectedCategory === 'All' ? undefined : selectedCategory);
    }
  }, [debouncedSearch, selectedCategory, refresh, currentView]);

  return (
    <Layout view={currentView} onNavigate={(v) => setCurrentView(v as View)}>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-8">

        {/* LEFT COLUMN: Navigation & Repos */}
        <div className="space-y-6">
          {/* Navigation Menu */}
          <div className="bg-mantle border border-surface0 rounded-lg p-2 shadow-sm">
            <NavItem
              icon={<Calendar size={16} />}
              label="Dashboard"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <NavItem
              icon={<GitBranch size={16} />}
              label="Repositories"
              active={currentView === 'repository'}
              onClick={() => setCurrentView('repository')}
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
              <span className="font-bold text-sm text-text">Top Repositories</span>
              <button className="bg-green text-base px-2 py-0.5 rounded text-xs font-bold hover:opacity-90 transition-opacity">New</button>
            </div>

            <div className="bg-mantle border border-surface0 rounded-lg overflow-hidden">
              <div className="p-2 space-y-1">
                <RepoItem name="mindrepo/ideas" onClick={() => setCurrentView('repository')} />
                <RepoItem name="mindrepo/journal" onClick={() => setCurrentView('repository')} />
                <RepoItem name="mindrepo/learning" onClick={() => setCurrentView('repository')} />
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
              <div className="bg-mantle border border-surface0 rounded-lg p-1 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue"></div>
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
            <RepoView />
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

          {currentView === 'repository' && (
            <div className="sticky top-24 space-y-4">
              <div className="bg-mantle border border-surface0 rounded-lg p-4">
                <h3 className="font-bold text-sm mb-3">About</h3>
                <p className="text-sm text-subtext0 mb-4">MindRepo repository for tracking daily thoughts and commits.</p>

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
    </Layout>
  );
}

// Helper Components for Cleaner Main App
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

const RepoItem = ({ name, onClick }: { name: string, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-surface0 transition-colors group"
  >
    <BookMarked size={14} className="text-subtext0 group-hover:text-blue transition-colors" />
    <span className="text-sm font-medium text-text group-hover:text-blue transition-colors">{name}</span>
  </div>
);

export default App;
