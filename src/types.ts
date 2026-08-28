export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'TAG';

export type CardCategory =
  | 'Pokemon'
  | 'Basketball'
  | 'Baseball'
  | 'Football'
  | 'Magic: The Gathering'
  | 'Yu-Gi-Oh!'
  | 'Marvel'
  | 'Other';

export type RarityTier = 'Trophy' | 'Pinnacle' | 'Blue Chip' | 'Investment' | 'Core' | 'Grail';

export interface Subgrades {
  centering?: number;
  corners?: number;
  edges?: number;
  surface?: number;
  isBlackLabel?: boolean;
}

export interface PopReport {
  popAtGrade: number;
  popHigher: number;
  totalPopulation: number;
}

export interface MarketComp {
  id: string;
  date: string;
  price: number;
  auctionHouse: 'Goldin' | 'PWCC' | 'Heritage' | 'eBay' | 'Fanatics Collect';
  url?: string;
  notes?: string;
}

export interface Slab {
  id: string;
  cardName: string;
  setName: string;
  year: number;
  cardNumber?: string;
  gradingCompany: GradingCompany;
  grade: number; // e.g. 10, 9.5, 9, 8
  gradeModifier?: 'GEM MT' | 'MINT' | 'NM-MT' | 'PRISTINE' | 'BLACK LABEL' | 'AUTHENTIC';
  certNumber: string;
  purchasePrice: number;
  purchaseDate: string;
  currentMarketValue: number;
  historicalComps: MarketComp[];
  subgrades?: Subgrades;
  popReport?: PopReport;
  imageUrl: string;
  backImageUrl?: string;
  notes?: string;
  isHolyGrail?: boolean;
  isTrophyAsset?: boolean;
  rarityTier: RarityTier;
  category: CardCategory;
  insuranceValuation?: number;
  estimatedAppreciation?: number; // % change 1yr
  isCustomUploaded?: boolean;
}

export type DisplayMount =
  | 'lit-acrylic'
  | 'pedestal'
  | 'floating-wall'
  | 'armored-tray'
  | 'gold-stanchion'
  | 'cyber-claw'
  | 'velvet-easel'
  | 'carbon-dock'
  | 'triumph-rail'
  | 'unmounted';
export type DisplayTheme = 'cyber-cyan' | 'neon-magenta' | 'vault-gold' | 'stealth-obsidian' | 'emerald-matrix' | 'ultraviolet' | 'triumph-amber';
export type DisplayBackground = 'obsidian-titanium' | 'dark-velvet' | 'cyber-grid' | 'carbon-weave' | 'cosmic-galaxy' | 'triumph-vault';
export type DisplayLayout = 'gallery-grid' | 'spotlight-hero' | 'horizontal-shelf' | 'quad-monolith' | 'triumph-monolith';

export interface DisplaySettings {
  mount: DisplayMount;
  theme: DisplayTheme;
  background: DisplayBackground;
  layout: DisplayLayout;
  showSubgrades: boolean;
  showLiveComps: boolean;
  showLightingHalo: boolean;
  tiltEffect: boolean;
  spacing: 'compact' | 'normal' | 'spacious';
  heroSlabId?: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalCostBasis: number;
  totalGainLoss: number;
  percentageGainLoss: number;
  highestValuedCard: Slab;
  totalCards: number;
  averageGrade: number;
  companyDistribution: Record<GradingCompany, number>;
  categoryDistribution: Record<CardCategory, number>;
  sevenDayChange: number;
  thirtyDayChange: number;
}

export type MembershipTier = 'free' | 'weekly_vip' | 'yearly_founder';
