
import { Airport, FareType } from './types';

export const AIRPORTS: Airport[] = [
  // 北海道
  { code: 'CTS', name: '新千歳', city: '札幌', region: '北海道', lat: 42.775, lng: 141.692 },
  { code: 'HKD', name: '函館', city: '函館', region: '北海道', lat: 41.770, lng: 140.822 },
  { code: 'AKJ', name: '旭川', city: '旭川', region: '北海道', lat: 43.670, lng: 142.447 },
  { code: 'KUH', name: '釧路', city: '釧路', region: '北海道', lat: 43.041, lng: 144.193 },
  { code: 'WKJ', name: '稚内', city: '稚内', region: '北海道', lat: 45.403, lng: 141.802 },
  { code: 'MMB', name: '女満別', city: '大空', region: '北海道', lat: 43.880, lng: 144.164 },
  { code: 'OBO', name: '帯広', city: '帯広', region: '北海道', lat: 42.733, lng: 143.217 },
  { code: 'SHB', name: '中標津', city: '中標津', region: '北海道', lat: 43.577, lng: 144.959 },
  // 東北
  { code: 'SDJ', name: '仙台', city: '仙台', region: '東北', lat: 38.139, lng: 140.916 },
  { code: 'AOJ', name: '青森', city: '青森', region: '東北', lat: 40.734, lng: 140.690 },
  { code: 'AXT', name: '秋田', city: '秋田', region: '東北', lat: 39.489, lng: 140.218 },
  { code: 'MSW', name: '三沢', city: '三沢', region: '東北', lat: 40.703, lng: 141.368 },
  { code: 'ONJ', name: '大館能代', city: '北秋田', region: '東北', lat: 40.191, lng: 140.372 },
  // 関東・中部
  { code: 'HND', name: '羽田', city: '東京', region: '関東', lat: 35.549, lng: 139.779 },
  { code: 'NRT', name: '成田', city: '成田', region: '関東', lat: 35.771, lng: 140.392 },
  { code: 'NGO', name: '中部', city: '名古屋', region: '中部', lat: 34.858, lng: 136.805 },
  { code: 'KIJ', name: '新潟', city: '新潟', region: '中部', lat: 37.956, lng: 139.111 },
  { code: 'KMQ', name: '小松', city: '小松', region: '中部', lat: 36.394, lng: 136.407 },
  { code: 'TOY', name: '富山', city: '富山', region: '中部', lat: 36.648, lng: 137.187 },
  // 関西
  { code: 'ITM', name: '伊丹', city: '大阪', region: '関西', lat: 34.785, lng: 135.438 },
  { code: 'KIX', name: '関西', city: '大阪', region: '関西', lat: 34.434, lng: 135.244 },
  { code: 'UKB', name: '神戸', city: '神戸', region: '関西', lat: 34.632, lng: 135.223 },
  // 中国・四国
  { code: 'HIJ', name: '広島', city: '広島', region: '中国', lat: 34.436, lng: 132.919 },
  { code: 'OKJ', name: '岡山', city: '岡山', region: '中国', lat: 34.757, lng: 133.855 },
  { code: 'UBJ', name: '山口宇部', city: '宇部', region: '中国', lat: 33.931, lng: 131.267 },
  { code: 'YGJ', name: '米子', city: '米子', region: '中国', lat: 35.492, lng: 133.236 },
  { code: 'IZO', name: '出雲', city: '出雲', region: '中国', lat: 35.413, lng: 132.890 },
  { code: 'IWK', name: '岩国', city: '岩国', region: '中国', lat: 34.143, lng: 132.236 },
  { code: 'TAK', name: '高松', city: '高松', region: '四国', lat: 34.214, lng: 134.015 },
  { code: 'MYJ', name: '松山', city: '松山', region: '四国', lat: 33.827, lng: 132.699 },
  { code: 'KCZ', name: '高知', city: '高知', region: '四国', lat: 33.546, lng: 133.669 },
  { code: 'TKS', name: '徳島', city: '松茂', region: '四国', lat: 34.132, lng: 134.606 },
  // 九州
  { code: 'FUK', name: '福岡', city: '福岡', region: '九州', lat: 33.584, lng: 130.450 },
  { code: 'NGS', name: '長崎', city: '長崎', region: '九州', lat: 32.916, lng: 129.913 },
  { code: 'KMJ', name: '熊本', city: '熊本', region: '九州', lat: 32.837, lng: 130.855 },
  { code: 'OIT', name: '大分', city: '大分', region: '九州', lat: 33.479, lng: 131.737 },
  { code: 'KMI', name: '宮崎', city: '宮崎', region: '九州', lat: 31.877, lng: 131.448 },
  { code: 'KOJ', name: '鹿児島', city: '鹿児島', region: '九州', lat: 31.803, lng: 130.719 },
  { code: 'HSG', name: '佐賀', city: '佐賀', region: '九州', lat: 33.150, lng: 130.301 },
  { code: 'TSU', name: '対馬', city: '対馬', region: '九州', lat: 34.285, lng: 129.333 },
  // 沖縄
  { code: 'OKA', name: '那覇', city: '那覇', region: '沖縄', lat: 26.204, lng: 127.646 },
  { code: 'ISG', name: '新石垣', city: '石垣', region: '沖縄', lat: 24.396, lng: 124.244 },
  { code: 'MMY', name: '宮古', city: '宮古', region: '沖縄', lat: 24.782, lng: 125.295 },
];

// ANAの主要路線の簡易マッピング（ハブから地方へ）
export const ANA_FLIGHT_ROUTES: Record<string, string[]> = {
  'HND': ['CTS', 'HKD', 'AKJ', 'KUH', 'WKJ', 'MMB', 'OBO', 'SHB', 'SDJ', 'AOJ', 'AXT', 'MSW', 'ONJ', 'NGO', 'TOY', 'KMQ', 'ITM', 'KIX', 'HIJ', 'OKJ', 'UBJ', 'YGJ', 'IZO', 'IWK', 'TAK', 'MYJ', 'KCZ', 'TKS', 'FUK', 'NGS', 'KMJ', 'OIT', 'KMI', 'KOJ', 'HSG', 'OKA', 'ISG', 'MMY'],
  'ITM': ['HND', 'CTS', 'HKD', 'AOJ', 'AXT', 'SDJ', 'KIJ', 'KCZ', 'MYJ', 'FUK', 'OIT', 'NGS', 'KMJ', 'KMI', 'KOJ', 'OKA'],
  'KIX': ['HND', 'CTS', 'FUK', 'OKA', 'ISG'],
  'CTS': ['HND', 'ITM', 'KIX', 'NGO', 'SDJ', 'AOJ', 'AXT', 'KIJ', 'KMQ', 'HIJ', 'FUK', 'OKA'],
  'NGO': ['HND', 'CTS', 'AOJ', 'AXT', 'SDJ', 'KIJ', 'MYJ', 'FUK', 'KOJ', 'OKA', 'ISG'],
  'FUK': ['HND', 'ITM', 'KIX', 'NGO', 'CTS', 'SDJ', 'KIJ', 'KMQ', 'MYJ', 'TSU', 'OKA'],
  'OKA': ['HND', 'ITM', 'KIX', 'NGO', 'CTS', 'SDJ', 'HIJ', 'FUK', 'ISG', 'MMY'],
};

// 地方空港からのルートはハブ（羽田、伊丹、中部、福岡、那覇、千歳）への逆引きで生成
export const getDestinationsFor = (originCode: string): string[] => {
  if (ANA_FLIGHT_ROUTES[originCode]) return ANA_FLIGHT_ROUTES[originCode];
  
  // 地方空港の場合は、その空港が目的地に含まれているハブ空港を抽出
  const hubs = Object.keys(ANA_FLIGHT_ROUTES).filter(hub => 
    ANA_FLIGHT_ROUTES[hub].includes(originCode)
  );
  return hubs;
};

export const FARE_TYPES: FareType[] = [
  { id: 'sv75', name: 'ANAスーパーバリュー 75', daysAdvance: 75, discountRate: 0.25 },
  { id: 'sv55', name: 'ANAスーパーバリュー 55', daysAdvance: 55, discountRate: 0.35 },
  { id: 'sv45', name: 'ANAスーパーバリュー 45', daysAdvance: 45, discountRate: 0.45 },
  { id: 'sv28', name: 'ANAスーパーバリュー 28', daysAdvance: 28, discountRate: 0.55 },
  { id: 'sv21', name: 'ANAスーパーバリュー 21', daysAdvance: 21, discountRate: 0.65 },
  { id: 'flex', name: 'ANA FLEX', daysAdvance: 0, discountRate: 1.0 },
];

export const HOLIDAYS_2025 = [
  '2025-01-01', '2025-01-13', '2025-02-11', '2025-02-23', '2025-02-24',
  '2025-03-20', '2025-04-29', '2025-05-03', '2025-05-04', '2025-05-05',
  '2025-05-06', '2025-07-21', '2025-08-11', '2025-09-15', '2025-09-23',
  '2025-10-13', '2025-11-03', '2025-11-23', '2025-11-24'
];
