
export enum UpgradeType {
  CLICK = 'CLICK',
  AUTO = 'AUTO',
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  type: UpgradeType;
  value: number; // e.g., +1 per click or +0.5 per second
  costIncreaseFactor: number;
  icon: React.ReactNode;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}
