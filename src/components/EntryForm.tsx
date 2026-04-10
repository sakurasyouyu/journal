import type React from 'react';
import { useState } from 'react';

interface EntryFormProps {
  onAdd: (entry: {
    content: string;
    mood: 'amazing' | 'good' | 'meh' | 'bad' | 'awful';
    gratitude1: string;
    gratitude2: string;
    gratitude3: string;
    sleepHours: number | null;
  }) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAdd }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'amazing' | 'good' | 'meh' | 'bad' | 'awful'>('good');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [sleepHours, setSleepHours] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      content,
      mood,
      gratitude1,
      gratitude2,
      gratitude3,
      sleepHours: sleepHours === '' ? null : Number(sleepHours)
    });

    setContent('');
    setMood('good');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSleepHours('');
  };

  const moods = [
    { value: 'amazing', label: '最高' },
    { value: 'good', label: '良い' },
    { value: 'meh', label: '普通' },
    { value: 'bad', label: '悪い' },
    { value: 'awful', label: '最悪' }
  ];

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 600 }}>今日の記録を追加</h2>
      
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>今の気分は？</label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {moods.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value as any)}
              style={{
                background: mood === m.value ? 'var(--accent)' : 'transparent',
                color: mood === m.value ? 'var(--button-text)' : 'var(--text-main)',
                border: mood === m.value ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                flex: 1,
                minWidth: '65px',
                borderRadius: '12px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                opacity: mood === m.value ? 1 : 0.6
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>睡眠時間 (時間)</label>
        <input 
          type="number" 
          step="0.5"
          className="input-glass" 
          value={sleepHours} 
          onChange={e => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))} 
          placeholder="例: 7.5"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>今日良かったことを3つ（感謝の記録）</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input className="input-glass" value={gratitude1} onChange={e => setGratitude1(e.target.value)} placeholder="1. 良かったこと" />
          <input className="input-glass" value={gratitude2} onChange={e => setGratitude2(e.target.value)} placeholder="2. 良かったこと" />
          <input className="input-glass" value={gratitude3} onChange={e => setGratitude3(e.target.value)} placeholder="3. 良かったこと" />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>日記</label>
        <textarea 
          className="input-glass" 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          rows={5} 
          placeholder="今日あったできごとや、感じたことを自由に書いてください。"
          required
        />
      </div>

      <button type="submit" style={{ marginTop: '10px', padding: '16px', fontSize: '1.1rem' }}>保存する</button>
    </form>
  );
};
