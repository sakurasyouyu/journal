import React, { useState } from 'react';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useRPGStats } from '../hooks/useRPGStats';
import { supabase } from '../lib/supabase';

export const Arena = () => {
  const { entries } = useJournalEntries();
  const myStats = useRPGStats(entries);
  
  const [friendIdInput, setFriendIdInput] = useState('');
  const [opponent, setOpponent] = useState<any>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isBattling, setIsBattling] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('journal_user_name') || '');

  const myFriendId = localStorage.getItem('journal_friend_id');

  const saveName = () => {
    localStorage.setItem('journal_user_name', userName);
    alert('名前を保存しました。もう一度日記を保存するとクラウドに反映されます。');
  };

  const searchOpponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendIdInput) return;
    
    // Supabaseが未設定の場合のダミーエラー処理
    if (supabase['supabaseUrl'].includes('xxx')) {
      alert("⚠️ バックエンド（Supabaseデータベース）の初期設定が完了していないため、フレンドと通信できません。設定マニュアルを確認してください。");
      return;
    }

    const { data, error } = await supabase
      .from('arena_profiles')
      .select('*')
      .eq('friend_id', friendIdInput)
      .single();
      
    if (error || !data) {
      alert("フレンドが見つかりませんでした。IDを確認してください。");
      setOpponent(null);
    } else {
      setOpponent(data);
      setBattleLog([]);
    }
  };

  const startBattle = () => {
    if (!opponent) return;
    setIsBattling(true);
    setBattleLog(["バトル開始！"]);
    
    let myHp = myStats.maxHp;
    let opHp = opponent.max_hp;
    const logs: string[] = [`⚔️ ${localStorage.getItem('journal_user_name')||'あなた'} VS ${opponent.name}`];

    setTimeout(() => {
      // 5ターンのオートバトル
      for (let turn = 1; turn <= 5; turn++) {
        if (myHp <= 0 || opHp <= 0) break;

        logs.push(`--- ターン ${turn} ---`);
        
        // 攻撃計算
        let damage = Math.floor(myStats.attackPower * (0.8 + Math.random() * 0.4));
        const isCrit = Math.random() * 100 < myStats.criticalChance;
        if (isCrit) { damage *= 2; logs.push("🔥 クリティカルヒット！"); }
        opHp -= damage;
        logs.push(`あなたは ${damage} のダメージを与えた！ (相手HP: ${Math.max(0, opHp)})`);

        if (opHp <= 0) break;

        // 相手の攻撃
        let opDamage = Math.floor(opponent.attack_power * (0.8 + Math.random() * 0.4));
        const isOpCrit = Math.random() * 100 < opponent.critical_chance;
        if (isOpCrit) { opDamage *= 2; logs.push("⚠️ 痛恨の一撃を受けた！"); }
        myHp -= opDamage;
        logs.push(`${opponent.name} の反撃！ ${opDamage} のダメージを受けた。 (あなたのHP: ${Math.max(0, myHp)})`);
      }

      if (myHp > 0 && opHp <= 0) logs.push("🏆 あなたの勝利！日記を書く継続力で圧倒した！");
      else if (opHp > 0 && myHp <= 0) logs.push("💀 敗北... 日々の日記を書いてステータスを上げよう。");
      else logs.push("🤝 引き分け！お互いの継続力が拮抗している！");

      setBattleLog(logs);
      setIsBattling(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>🛡️ あなたのステータス</h2>
        <div style={{ marginBottom: '24px' }}>
          <input className="input-glass" value={userName} onChange={e=>setUserName(e.target.value)} placeholder="あなたの名前" style={{ width: '200px', marginRight: '10px' }}/>
          <button onClick={saveName}>設定</button>
        </div>
        <div style={{ fontSize: '1.2rem', marginBottom: '16px' }}>レベル: <strong>{myStats.level}</strong></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left', padding: '0 40px', fontSize: '0.95rem' }}>
          <div>❤️ 最大HP: {myStats.maxHp}</div>
          <div>⚔️ 攻撃力: {myStats.attackPower}</div>
          <div>✨ 会心率: {myStats.criticalChance}%</div>
          <div>🌟 総経験値: {myStats.totalXp}XP</div>
        </div>
        <div style={{ marginTop: '30px', padding: '20px', background: 'var(--glass-border)', borderRadius: '12px' }}>
          あなたのフレンド発行ID: <br/><strong style={{ fontSize: '2rem', letterSpacing: '4px' }}>{myFriendId}</strong><br/>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>※これを友達に伝えて対戦しよう！</span>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '16px' }}>🔍 フレンドを探してバトル</h2>
        <form onSubmit={searchOpponent} style={{ display: 'flex', gap: '10px' }}>
          <input className="input-glass" value={friendIdInput} onChange={e=>setFriendIdInput(e.target.value.toUpperCase())} placeholder="フレンドID (例: 1A2B3C)" required />
          <button type="submit">検索</button>
        </form>

        {opponent && (
          <div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '12px' }}>👾 対戦相手発見！</h3>
            <p style={{ fontSize: '1.1rem' }}><strong>{opponent.name}</strong> (Lv.{opponent.level})</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>HP: {opponent.max_hp} / 攻撃: {opponent.attack_power}</p>
            
            <button onClick={startBattle} disabled={isBattling} style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '1.1rem' }}>
              {isBattling ? '対戦中...' : '⚔️ バトル開始！'}
            </button>
          </div>
        )}
      </div>

      {battleLog.length > 0 && (
        <div className="glass-panel" style={{ background: 'var(--text-main)', color: 'var(--bg-gradient)' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--bg-gradient)' }}>📜 バトルログ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'monospace', fontSize: '1.05rem' }}>
            {battleLog.map((log, i) => (
              <div key={i} style={{ animation: `popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`, animationDelay: `${i * 0.4}s`, opacity: 0 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
