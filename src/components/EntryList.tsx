import type React from 'react';
import type { JournalEntry } from '../types';

interface EntryListProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}

const moodLabels: Record<string, string> = {
  amazing: '最高',
  good: '良い',
  meh: '普通',
  bad: '悪い',
  awful: '最悪'
};

export const EntryList: React.FC<EntryListProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px' }}>
        <p>まだ記録がありません。</p>
        <p>最初の日記を書いてみましょう！</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {entries.map(entry => {
        const date = new Date(entry.createdAt).toLocaleDateString('ja-JP', {
          year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
        });

        const hasGratitude = entry.gratitude1 || entry.gratitude2 || entry.gratitude3;

        return (
          <div key={entry.id} className="glass-panel" style={{ position: 'relative', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } } as any}>
            <button 
              onClick={() => onDelete(entry.id)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                padding: '6px 12px',
                minWidth: 'auto',
                boxShadow: 'none',
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}
              title="削除"
            >
              削除
            </button>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '6px 14px', background: 'var(--text-main)', color: 'var(--bg-gradient)', borderRadius: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
                {moodLabels[entry.mood]}
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{date}</div>
                {entry.sleepHours && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>睡眠: {entry.sleepHours}時間</div>}
              </div>
            </div>

            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', marginBottom: hasGratitude ? '20px' : '0', color: 'var(--text-main)' }}>
              {entry.content}
            </p>

            {hasGratitude && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.15)', 
                backdropFilter: 'blur(10px)',
                padding: '16px', 
                borderRadius: '16px',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>今日の感謝・良かったこと</div>
                <ul style={{ listStyleType: 'disc', paddingLeft: '24px', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                  {entry.gratitude1 && <li>{entry.gratitude1}</li>}
                  {entry.gratitude2 && <li>{entry.gratitude2}</li>}
                  {entry.gratitude3 && <li>{entry.gratitude3}</li>}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
