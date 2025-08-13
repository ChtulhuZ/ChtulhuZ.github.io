import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Upgrade, UpgradeType } from './types';
import { INITIAL_UPGRADES } from './constants';
import Earth from './components/Earth';
import UpgradeStore from './components/UpgradeStore';
import SageAdvice from './components/SageAdvice';

const SAVE_KEY = 'terra-clicker-save';

interface GameState {
  score: number;
  upgrades: Upgrade[];
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const savedState = localStorage.getItem(SAVE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Integrity check: ensure saved upgrades match initial upgrades structure
        if (parsedState.upgrades && parsedState.upgrades.length === INITIAL_UPGRADES.length) {
            return parsedState;
        }
      }
    } catch (error) {
      console.error("Failed to load saved state:", error);
    }
    return { score: 0, upgrades: INITIAL_UPGRADES };
  });

  const { score, upgrades } = gameState;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }, [gameState]);


  const clickPower = useMemo(() => {
    return upgrades
      .filter(u => u.type === UpgradeType.CLICK && u.level > 0)
      .reduce((total, u) => total + u.value * u.level, 1);
  }, [upgrades]);

  const autoIncomePerSecond = useMemo(() => {
    return upgrades
      .filter(u => u.type === UpgradeType.AUTO && u.level > 0)
      .reduce((total, u) => total + u.value * u.level, 0);
  }, [upgrades]);

  const handleEarthClick = useCallback(() => {
    setGameState(current => ({
      ...current,
      score: current.score + clickPower
    }));
  }, [clickPower]);

  const handleBuyUpgrade = useCallback((id: string) => {
    setGameState(current => {
      const { score, upgrades } = current;
      const upgradeIndex = upgrades.findIndex(u => u.id === id);
      if (upgradeIndex === -1) return current;

      const upgrade = upgrades[upgradeIndex];
      if (score < upgrade.cost) return current;

      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: upgrade.cost * upgrade.costIncreaseFactor,
      };

      return {
        score: score - upgrade.cost,
        upgrades: newUpgrades,
      };
    });
  }, []);

  // Game tick for auto-income
  useEffect(() => {
    const gameTick = setInterval(() => {
      if (autoIncomePerSecond > 0) {
        setGameState(current => ({
            ...current,
            score: current.score + autoIncomePerSecond / 10
        }));
      }
    }, 100);

    return () => clearInterval(gameTick);
  }, [autoIncomePerSecond]);

  const handleResetProgress = () => {
    if (window.confirm("Sei sicuro di voler resettare tutti i progressi? Questa azione è irreversibile.")) {
        localStorage.removeItem(SAVE_KEY);
        setGameState({ score: 0, upgrades: INITIAL_UPGRADES });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-4">
        <h1 className="text-5xl font-bold text-green-300 drop-shadow-lg">Terra Clicker</h1>
        <p className="text-slate-400">Clicca sulla terra per darle nuova vita.</p>
      </header>

      <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-around gap-8">
        {/* Main Game Area */}
        <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center shadow-lg">
                <h2 className="text-4xl font-bold tracking-wider text-white">
                    {Math.floor(score).toLocaleString('it-IT')}
                </h2>
                <p className="text-sm text-green-400">
                    + {autoIncomePerSecond.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} al secondo
                </p>
            </div>
            <Earth onClick={handleEarthClick} score={score} clickPower={clickPower} />
        </div>
        
        {/* Upgrades Store */}
        <aside>
          <UpgradeStore
            upgrades={upgrades}
            onBuyUpgrade={handleBuyUpgrade}
            score={score}
          />
        </aside>
      </div>

      {/* Gemini Advice Section & Footer */}
      <footer className="mt-8 w-full flex flex-col items-center gap-4">
        <SageAdvice />
        <button onClick={handleResetProgress} className="text-xs text-slate-500 hover:text-red-400 transition-colors mt-2">
            Resetta Progressi
        </button>
      </footer>
    </div>
  );
};

export default App;
