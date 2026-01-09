
import { AIRPORTS, FARE_TYPES, HOLIDAYS_2025 } from '../constants';

// ハバーシン公式による2点間の距離計算 (km)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球の半径
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * タイムゾーンのズレを考慮せず、純粋にローカルの日付を YYYY-MM-DD 形式で返す
 */
export function formatDateSafe(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculatePrice(originCode: string, destinationCode: string, date: Date, advanceDays: number): number {
  const origin = AIRPORTS.find(a => a.code === originCode);
  const destination = AIRPORTS.find(a => a.code === destinationCode);
  
  if (!origin || !destination) return 30000;

  const distance = getDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  
  // 基準価格の計算: 基本料金(12,000円) + 距離単価(20円/km)
  let base = 12000 + (distance * 25);

  // 1. Seasonality & Holidays
  const month = date.getMonth();
  const dayOfWeek = date.getDay(); // 0: Sun, 6: Sat
  const dateStr = formatDateSafe(date);
  const isHoliday = HOLIDAYS_2025.includes(dateStr);

  // Peak seasons
  if ([2, 4, 7, 11].includes(month)) base *= 1.4;
  
  // Weekend surcharge
  if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) {
    base *= 1.2;
  }

  // 2. Fare Type Discount
  const fare = FARE_TYPES.find(f => advanceDays >= f.daysAdvance) || FARE_TYPES[FARE_TYPES.length - 1];
  
  return Math.round(base * fare.discountRate / 100) * 100; // 100円単位で丸め
}

export function getMonthDays(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}
