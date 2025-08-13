
import React, { useState, useCallback } from 'react';
import { FloatingText } from '../types';

interface EarthProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  score: number;
  clickPower: number;
}

const Earth: React.FC<EarthProps> = ({ onClick, score, clickPower }) => {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const handleAnimationEnd = useCallback((id: number) => {
    setFloatingTexts(currentTexts => currentTexts.filter(text => text.id !== id));
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick(e);
    const newText: FloatingText = {
      id: Date.now(),
      x: e.nativeEvent.offsetX - 15,
      y: e.nativeEvent.offsetY - 20,
      value: clickPower,
    };
    setFloatingTexts(currentTexts => [...currentTexts, newText]);
    
    // Auto-remove after animation duration
    setTimeout(() => {
        handleAnimationEnd(newText.id);
    }, 1500);
  };

  const getEarthStyle = () => {
    if (score < 100) return 'from-yellow-900 to-orange-900';
    if (score < 500) return 'from-yellow-800 to-orange-800';
    if (score < 2000) return 'from-green-900/40 to-yellow-800';
    if (score < 10000) return 'from-green-800/60 to-yellow-700';
    if (score < 50000) return 'from-teal-800 to-green-700';
    if (score < 250000) return 'from-sky-700 to-green-600';
    return 'from-blue-600 to-emerald-500';
  };
  
  const getEarthText = () => {
    if (score < 2000) return <span className="text-3xl font-bold text-yellow-200 opacity-50">ARIDA</span>;
    if (score < 50000) return <span className="text-3xl font-bold text-green-200 opacity-70"> GERMOGLIO </span>;
    return <span className="text-3xl font-bold text-blue-200">OASI</span>;
  }

  return (
    <div 
      className={`relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br ${getEarthStyle()} flex items-center justify-center cursor-pointer select-none transition-all duration-1000 ease-in-out shadow-2xl shadow-black/50 active:scale-95 transform hover:scale-105 border-4 border-white/10`}
      onClick={handleClick}
    >
      {getEarthText()}
      {floatingTexts.map(text => (
        <div
          key={text.id}
          className="floating-text text-2xl"
          style={{ left: `${text.x}px`, top: `${text.y}px` }}
        >
          +{text.value.toLocaleString('it-IT')}
        </div>
      ))}
    </div>
  );
};

export default Earth;
