
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice, SearchCriteria, DailyPrice } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export async function getPricingAdvice(criteria: SearchCriteria, selectedDate: Date, estimatedPrice: number): Promise<AIAdvice> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // App.tsx から渡される文字列を優先して使用することで日付のズレを防ぐ
  const dateStr = criteria.departureDate;
  const prompt = `
    ANAの国内線航空券「${criteria.origin}から${criteria.destination}」の${dateStr}搭乗便の実際の運賃状況を検索して分析してください。
    
    以下の項目をJSON形式で回答してください：
    - recommendation: "BUY_NOW", "WAIT", "CAUTION"
    - reason: ${dateStr}搭乗便の実際の検索結果に基づく価格の妥当性（日本語）
    - priceTrend: 今後の価格変動予測（日本語）
    - tips: 最も安く買うための具体的なテクニック（日本語の配列）
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            reason: { type: Type.STRING },
            priceTrend: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["recommendation", "reason", "priceTrend", "tips"]
        }
      }
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || '参考リンク',
      uri: chunk.web?.uri || ''
    })) || [];

    const data = JSON.parse(text || '{}');
    return { ...data, sources };
  } catch (error) {
    console.error("Pricing Advice Error:", error);
    return {
      recommendation: 'CAUTION',
      reason: '最新の運賃情報を取得できませんでした。',
      priceTrend: '不明',
      tips: ['ANA公式サイトで直接確認してください。', '予約クラスによる価格差に注意してください。']
    };
  }
}

export async function getMonthlyPriceData(criteria: SearchCriteria, year: number, month: number): Promise<DailyPrice[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const monthStr = `${year}年${month + 1}月`;
  
  const prompt = `
    ANAの国内線「${criteria.origin}から${criteria.destination}」の${monthStr}の運賃カレンダー情報を検索し、代表的な運賃データを作成してください。
    空席連動の変動を考慮し、週末や祝日は高め、平日は安めの傾向を反映させてください。
    
    回答は必ず以下のJSON配列形式にしてください。代表的な価格（最低15日分程度）を含めてください。
    [{"date": "YYYY-MM-DD", "price": 15800, "isLowest": true}]
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              price: { type: Type.NUMBER },
              isLowest: { type: Type.BOOLEAN }
            },
            required: ["date", "price"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Monthly Price Fetch Error:", error);
    return [];
  }
}
