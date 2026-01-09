import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CommitForm } from './components/CommitForm';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { useCommits } from './hooks/useCommits';
import { BookMarked, Search, Filter } from 'lucide-react';

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

  useEffect(() => {
    refresh(debouncedSearch, selectedCategory === 'All' ? undefined : selectedCategory);
  }, [debouncedSearch, selectedCategory, refresh]);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-6">

        {/* Left Column: Top Repositories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">Top repositories</span>
            <button className="text-xs font-bold text-base bg-green px-2 py-1 rounded flex items-center gap-1 hover:opacity-90 transition-opacity">
              <BookMarked size={12} /> New
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface0 transition-colors" onClick={() => setSelectedCategory('All')}>
              <div className="w-4 h-4 rounded-full bg-subtext0 opacity-50"></div>
              <span className="text-sm font-bold">All Activity</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface0 transition-colors" onClick={() => setSelectedCategory('Coding')}>
              <div className="w-4 h-4 rounded-full bg-blue opacity-50"></div>
              <span className="text-sm font-bold">Coding</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface0 transition-colors" onClick={() => setSelectedCategory('Learning')}>
              <div className="w-4 h-4 rounded-full bg-yellow opacity-50"></div>
              <span className="text-sm font-bold">Learning</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface0">
            <h3 className="font-bold text-sm">Recent filters</h3>
          </div>
        </div>

        {/* Center Column: Feed */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Home</h2>
            <CommitForm onAdd={addCommit} />
          </div>

          <div>
            <div className="mb-4">
              <div className="flex items-center gap-4 w-full">
                <span className="whitespace-nowrap font-bold">Feed</span>

                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtext0" />
                  <input
                    type="text"
                    placeholder="Find a commit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-base border border-surface1 rounded py-1 pl-8 pr-2 text-sm focus:border-blue focus:outline-none transition-colors placeholder:text-subtext0"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-base border border-surface1 rounded py-1 pl-3 pr-8 text-sm focus:border-blue focus:outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Filter size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-subtext0 pointer-events-none" />
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
        <div className="space-y-4">
          <Insights refreshTrigger={commits.length} />

          <div className="px-2 text-xs text-subtext0">
            <p>© 2026 MindRepo</p>
            <div className="flex gap-2 mt-2">
              <a href="#" className="hover:text-blue hover:underline">Blog</a>
              <a href="#" className="hover:text-blue hover:underline">About</a>
              <a href="#" className="hover:text-blue hover:underline">Privacy</a>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default App;
