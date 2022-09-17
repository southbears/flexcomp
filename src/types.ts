
export enum AmountUnit {
  USD = 'USD'
}

export interface AmountRange {
  min: number;
  max: number;
  unit: AmountUnit;
  frequency: 'monthly' | 'yearly' | 'once';
}

export enum PerkType {
  SIGNING_BONUS = 'SIGNING_BONUS'
}

export interface Perk {
  type: PerkType;
  name: string;
  amount: AmountRange;
}

export interface OfferData {
  id: string;
  candidate: {
    firstName: string;
  };
  company: {
    name: string;
    imageUrl: string;
  };
  cash: AmountRange;
  equity: AmountRange;
  perks: Perk[];
  default: number;
  growthProjections: {
    default?: boolean;
    label: string;
    rate: number;
  }[]
}
