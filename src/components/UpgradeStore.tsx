import React from 'react';
import { Upgrade } from '../types';
import UpgradeItem from './UpgradeItem';

interface UpgradeStoreProps {
  upgrades: Upgrade[];
  onBuyUpgrade: (id: string) => void;
  score: number;
}

const UpgradeStore: React.FC<UpgradeStoreProps> = ({ upgrades, onBuyUpgrade, score }) => {
  return (
    <div className="w-full max-w-sm h-[400px] md:h-auto md:max-h-[500px] lg:max-h-[600px] bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-300">Miglioramenti</h2>
      <div className="overflow-y-auto h-[calc(100%-48px)] pr-2">
        {upgrades.map(upgrade => (
          <UpgradeItem
            key={upgrade.id}
            upgrade={upgrade}
            onBuy={onBuyUpgrade}
            score={score}
          />
        ))}
      </div>
    </div>
  );
};

export default UpgradeStore;
