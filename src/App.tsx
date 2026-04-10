import { EntryForm } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { useJournalEntries } from './hooks/useJournalEntries';

function App() {
  const { entries, addEntry, deleteEntry } = useJournalEntries();

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      <header className="glass-panel" style={{ textAlign: 'center', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '12px', letterSpacing: '-0.5px', fontWeight: 300 }}>
          Serenity Journal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          シンプルで清楚なUIで、日々の生活の質（QoL）とメンタルヘルスを育む記録を。
        </p>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        <section>
          <EntryForm onAdd={addEntry} />
        </section>
        
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', paddingLeft: '12px', fontWeight: 600 }}>あなたの記録</h2>
          <EntryList entries={entries} onDelete={deleteEntry} />
        </section>
      </main>
    </div>
  );
}

export default App;
