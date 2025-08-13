
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Upgrade, UpgradeType } from './types';
import { INITIAL_UPGRADES } from './constants';
import Earth from './components/Earth';
import UpgradeStore from './components/UpgradeStore';
import SageAdvice from './components/SageAdvice';

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);

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
    setScore(currentScore => currentScore + clickPower);
  }, [clickPower]);

  const handleBuyUpgrade = useCallback((id: string) => {
    setUpgrades(currentUpgrades => {
      const upgradeIndex = currentUpgrades.findIndex(u => u.id === id);
      if (upgradeIndex === -1) return currentUpgrades;

      const upgrade = currentUpgrades[upgradeIndex];
      if (score < upgrade.cost) return currentUpgrades;

      setScore(currentScore => currentScore - upgrade.cost);

      const newUpgrades = [...currentUpgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: upgrade.cost * upgrade.costIncreaseFactor,
      };

      return newUpgrades;
    });
  }, [score]);

  useEffect(() => {
    const gameTick = setInterval(() => {
      if (autoIncomePerSecond > 0) {
        setScore(currentScore => currentScore + autoIncomePerSecond);
      }
    }, 1000);

    return () => clearInterval(gameTick);
  }, [autoIncomePerSecond]);

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

      {/* Gemini Advice Section */}
      <footer className="mt-8 w-full flex justify-center">
        <SageAdvice />
      </footer>
    </div>
  );
};

export default App;
