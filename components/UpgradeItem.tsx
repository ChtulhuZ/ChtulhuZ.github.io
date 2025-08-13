import React from 'react';
import { Upgrade } from '../types';
import { ShovelIcon, WaterDropIcon, LeafIcon, TractorIcon } from './IconComponents';

interface UpgradeItemProps {
  upgrade: Upgrade;
  onBuy: (id: string) => void;
  score: number;
}

const ICONS: { [key: string]: React.ReactNode } = {
  ShovelIcon: <ShovelIcon />,
  WaterDropIcon: <WaterDropIcon />,
  LeafIcon: <LeafIcon />,
  TractorIcon: <TractorIcon />,
};

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, onBuy, score }) => {
  const canAfford = score >= upgrade.cost;
  const iconElement = ICONS[upgrade.icon] || null;

  return (
    <button
      onClick={() => onBuy(upgrade.id)}
      disabled={!canAfford}
      className={`w-full flex items-center p-3 mb-2 rounded-lg border-2 transition-all duration-200 ${
        canAfford 
          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:border-green-500 cursor-pointer' 
          : 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className={`mr-4 p-2 rounded-md ${canAfford ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
        {iconElement}
      </div>
      <div className="flex-grow text-left">
        <h3 className="font-bold text-md">{upgrade.name}</h3>
        <p className="text-sm text-slate-400">{upgrade.description}</p>
        <p className="text-xs text-slate-400">Livello: {upgrade.level}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${canAfford ? 'text-green-400' : 'text-red-500'}`}>
          {Math.ceil(upgrade.cost).toLocaleString('it-IT')}
        </p>
        <p className="text-xs text-slate-500">punti</p>
      </div>
    </button>
  );
};

export default UpgradeItem;