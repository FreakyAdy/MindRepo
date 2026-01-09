import { Layout } from './components/Layout';
import { CommitForm } from './components/CommitForm';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { useCommits } from './hooks/useCommits';
import { BookMarked, Code2 } from 'lucide-react';

function App() {
  const { commits, addCommit, deleteCommit } = useCommits();

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
            <div className="repo-item">
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--subtext0)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">mindrepo/ideas</span>
            </div>
            <div className="repo-item">
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--subtext0)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">mindrepo/journal</span>
            </div>
            <div className="repo-item">
              <div className="avatar-small" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--subtext0)', opacity: 0.5 }}></div>
              <span className="text-sm font-bold">mindrepo/learning</span>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 className="section-title">Recent activity</h3>
            <div style={{ padding: '0.75rem', borderRadius: '6px', border: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--subtext0)', backgroundColor: 'var(--mantle)' }}>
              When you have activity, it will show up here.
            </div>
          </div>
        </div>

        {/* Center Column: Feed */}
        <div className="feed-column">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Home</h2>
            <CommitForm onAdd={addCommit} />
          </div>

          <div>
            <div className="section-title">
              <span>Feed</span>
              <button className="text-xs text-muted hover-blue" style={{ color: 'var(--subtext0)', cursor: 'pointer' }}>Filter</button>
            </div>
            <Timeline commits={commits} onDelete={deleteCommit} />
          </div>
        </div>

        {/* Right Column: Insights & Sidebar */}
        <div className="sidebar-right">
          <div className="flex-col gap-4">
            <Insights commits={commits} />

            <div className="insights-card" style={{ padding: '1rem' }}>
              <h3 className="section-title">Explore</h3>
              <div className="flex-col gap-2">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Code2 size={20} color="var(--mauve)" />
                  <div>
                    <p className="text-xs font-bold">MindRepo Pro</p>
                    <p className="text-xs text-muted">Upgrade to unlock advanced neural insights and graph views.</p>
                  </div>
                </div>
              </div>
            </div>

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
