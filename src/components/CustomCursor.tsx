import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // ボタンやリンクにホバーしているか判定
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.closest('button') ||
        target.tagName.toLowerCase() === 'a'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* メインのカーソル（小さな点） */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '6px', height: '6px',
        backgroundColor: 'var(--text-main)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${position.x - 3}px, ${position.y - 3}px)`,
        zIndex: 9999,
        transition: 'transform 0.05s linear' // 高速で追従
      }} />
      
      {/* アニメーションする外枠（遅れて追従し、ホバーで変化） */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '32px', height: '32px',
        border: '1px solid var(--text-muted)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isHovering ? 1.4 : 1})`,
        zIndex: 9998,
        transition: 'transform 0.15s ease-out, background-color 0.2s',
        opacity: isHovering ? 0.4 : 0.6,
        backgroundColor: isHovering ? 'var(--text-muted)' : 'transparent'
      }} />
    </>
  );
};
