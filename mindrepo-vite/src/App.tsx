import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CommitForm } from './components/CommitForm';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { useCommits } from './hooks/useCommits';
import { BookMarked, Search, Filter } from 'lucide-react';

// Custom debounce hook for MVP simplicity inside App if file not created
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const debouncedSearch = useDebounceValue(searchTerm, 500);

  // Effect to trigger search when defaults change
  useEffect(() => {
    refresh(debouncedSearch, selectedCategory === 'All' ? undefined : selectedCategory);
  }, [debouncedSearch, selectedCategory, refresh]);

  return (
    <Layout>
      <div className="dashboard-grid">

        {/* Left Column: Top Repositories (Mock) */}
        <div className="sidebar-left">
          <div className="section-title">
            <span>Top repositories</span>
            <button className="text-xs font-bold text-bg-app bg-green px-2 py-1 rounded flex-center gap-1 opacity-hover" style={{ backgroundColor: 'var(--green)', color: 'var(--base)', borderRadius: '4px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookMarked size={12} /> New
            </button>
          </div>

          <div className="flex-col gap-2">
            <div className="repo-item" onClick={() => setSelectedCategory('All')}>
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--subtext0)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">All Activity</span>
            </div>
            <div className="repo-item" onClick={() => setSelectedCategory('Coding')}>
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--blue)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">Coding</span>
            </div>
            <div className="repo-item" onClick={() => setSelectedCategory('Learning')}>
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--yellow)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">Learning</span>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 className="section-title">Recent filters</h3>
          </div>
        </div>

        {/* Center Column: Feed */}
        <div className="feed-column">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Home</h2>
            <CommitForm onAdd={addCommit} />
          </div>

          <div>
            <div className="section-title" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-4 w-full">
                <span className="whitespace-nowrap">Feed</span>

                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--subtext0)]" />
                  <input
                    type="text"
                    placeholder="Find a commit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--base)] border border-[var(--border-color)] rounded py-1 pl-7 pr-2 text-sm focus:border-[var(--blue)] focus:outline-none"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[var(--base)] border border-[var(--border-color)] rounded py-1 px-2 text-sm focus:border-[var(--blue)] focus:outline-none appearance-none pr-6 cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Filter size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--subtext0)] pointer-events-none" />
                </div>
              </div>
            </div>

            <Timeline
              commits={commits}
              onDelete={deleteCommit}
              onUpdate={updateCommit}
            />
          </div>
        </div>

        {/* Right Column: Insights & Sidebar */}
        <div className="sidebar-right">
          <div className="flex-col gap-4">
            {/* Pass commits length as refreshTrigger to auto-refresh insights when commits change */}
            <Insights refreshTrigger={commits.length} />

            <div className="text-xs text-muted" style={{ padding: '0 0.5rem' }}>
              <p>© 2026 MindRepo</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <a href="#">Blog</a>
                <a href="#">About</a>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default App;
