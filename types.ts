
export type Airport = {
  code: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
};

export type FareType = {
  id: string;
  name: string;
  daysAdvance: number;
  discountRate: number; // Percentage of base price
};

export type DailyPrice = {
  date: string; // ISO string
  price: number;
  isLowest?: boolean;
};

export type SearchCriteria = {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  advanceDays: number;
};

export type AIAdvice = {
  recommendation: 'BUY_NOW' | 'WAIT' | 'CAUTION';
  reason: string;
  priceTrend: string;
  tips: string[];
  sources?: { title: string; uri: string }[];
};
