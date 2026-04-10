import { useMemo, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { supabase } from '../lib/supabase';

export interface RPGStats {
  level: number;
  maxHp: number;
  currentHp: number;
  attackPower: number;
  criticalChance: number;
  totalXp: number;
}

export const calculateStats = (entries: JournalEntry[]): RPGStats => {
  // 経験値： 日記1件につき150XP ＋ 感謝1件につき50XPのボーナス
  const totalXp = entries.length * 150 + entries.reduce((acc, e) => {
    return acc + (e.gratitude1 ? 50 : 0) + (e.gratitude2 ? 50 : 0) + (e.gratitude3 ? 50 : 0);
  }, 0);
  
  // レベル計算
  const level = Math.floor(Math.sqrt(totalXp / 100)) + 1;
  const maxHp = 500 + (level * 120);

  let attackPower = 50 + (level * 15);
  let criticalChance = 5;

  if (entries.length > 0) {
    const latest = entries[0]; // 直近の日記のモチベーションが攻撃力に影響！
    if (latest.mood === 'amazing') attackPower = Math.floor(attackPower * 1.5);
    else if (latest.mood === 'good') attackPower = Math.floor(attackPower * 1.2);
    else if (latest.mood === 'awful') attackPower = Math.floor(attackPower * 0.8);

    const gratitudes = (latest.gratitude1 ? 1 : 0) + (latest.gratitude2 ? 1 : 0) + (latest.gratitude3 ? 1 : 0);
    criticalChance += gratitudes * 15; // 最大+45%のクリティカル率
  }

  return { level, maxHp, currentHp: maxHp, attackPower, criticalChance, totalXp };
};

export const useRPGStats = (entries: JournalEntry[]) => {
  const stats = useMemo(() => calculateStats(entries), [entries]);
  
  // 自動的にSupabaseに同期する仕組み (フレンドIDとセット)
  useEffect(() => {
    let friendId = localStorage.getItem('journal_friend_id');
    const userName = localStorage.getItem('journal_user_name') || '匿名プレイヤー';
    
    if (!friendId) {
      friendId = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('journal_friend_id', friendId);
    }

    const syncStats = async () => {
      // まだSupabaseのURLが初期値のままの場合は通信をストップ
      if (import.meta.env.VITE_SUPABASE_URL === undefined && supabase['supabaseUrl'].includes('xxx')) return;

      try {
        await supabase.from('arena_profiles').upsert({
          friend_id: friendId,
          name: userName,
          level: stats.level,
          max_hp: stats.maxHp,
          attack_power: stats.attackPower,
          critical_chance: stats.criticalChance,
          last_updated: new Date().toISOString()
        });
      } catch (err) {
        console.error("クラウド同期エラー: ", err);
      }
    };
    
    syncStats();
  }, [stats]);

  return stats;
};
