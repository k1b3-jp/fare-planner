
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, Plane, Info, TrendingDown, ChevronLeft, ChevronRight, Timer, MapPin, ExternalLink, RefreshCw, MousePointer2, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { AIRPORTS, FARE_TYPES, getDestinationsFor } from './constants';
import { SearchCriteria, AIAdvice, DailyPrice, FareType } from './types';
import { calculatePrice, getMonthDays, formatPrice, formatDateSafe } from './utils/priceUtils';
import { getPricingAdvice, getMonthlyPriceData } from './services/geminiService';

const App: React.FC = () => {
  const TODAY = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  
  const initialDeparture = useMemo(() => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() + 2);
    return formatDateSafe(d);
  }, [TODAY]);

  const [criteria, setCriteria] = useState<SearchCriteria>({
    origin: 'HND',
    destination: 'CTS',
    departureDate: initialDeparture,
    advanceDays: 75,
  });

  const [currentViewDate, setCurrentViewDate] = useState(new Date(TODAY)); 
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  const availableDestinations = useMemo(() => {
    const codes = getDestinationsFor(criteria.origin);
    return AIRPORTS.filter(a => codes.includes(a.code));
  }, [criteria.origin]);

  useEffect(() => {
    if (!availableDestinations.find(d => d.code === criteria.destination)) {
      if (availableDestinations.length > 0) {
        setCriteria(prev => ({ ...prev, destination: availableDestinations[0].code }));
      }
    }
    setAdvice(null);
  }, [criteria.origin]);

  const departureDateObj = useMemo(() => {
    const [y, m, d] = criteria.departureDate.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
  }, [criteria.departureDate]);

  const days = useMemo(() => getMonthDays(currentViewDate.getFullYear(), currentViewDate.getMonth()), [currentViewDate]);

  // 購入期限日の計算
  const fareDeadlines = useMemo(() => {
    const deadlines = new Map<string, string>();
    FARE_TYPES.forEach(fare => {
      if (fare.daysAdvance > 0) {
        const d = new Date(departureDateObj);
        d.setDate(d.getDate() - fare.daysAdvance);
        // "ANAスーパーバリュー 75" -> "SV75"
        const shortName = fare.name.replace('ANAスーパーバリュー ', 'SV');
        deadlines.set(formatDateSafe(d), shortName);
      }
    });
    return deadlines;
  }, [departureDateObj]);

  const handleAnalyze = async () => {
    setIsLoadingAdvice(true);
    try {
      const adviceRes = await getPricingAdvice(criteria, departureDateObj, 0);
      setAdvice(adviceRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handlePrevMonth = () => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    if (date < TODAY) return; 
    const dateStr = formatDateSafe(date);
    setCriteria(prev => ({ ...prev, departureDate: dateStr }));
    setAdvice(null);
  };

  const getPriceForPurchaseDate = (purchaseDate: Date) => {
    const diffTime = departureDateObj.getTime() - purchaseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null; 
    
    return calculatePrice(criteria.origin, criteria.destination, departureDateObj, diffDays);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8] text-slate-900">
      <header className="bg-[#003194] text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded shadow-inner">
              <Plane className="text-[#003194] w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight italic">ANA FARE NAVI</h1>
              <p className="text-[9px] opacity-70 font-bold tracking-widest uppercase">Purchase Timing Simulator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] font-bold">
            <span className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 flex items-center backdrop-blur-sm">
              <Timer className="w-3.5 h-3.5 mr-2 text-blue-300" />
              本日: {TODAY.toLocaleDateString('ja-JP', {year:'numeric', month:'2-digit', day:'2-digit'})}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-blue-600" />
                <h2 className="font-black text-sm text-slate-700">検索条件</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-blue-500" /> 出発地
                  </label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all outline-none"
                    value={criteria.origin}
                    onChange={e => setCriteria({...criteria, origin: e.target.value})}
                  >
                    {AIRPORTS.map(a => (
                      <option key={a.code} value={a.code}>{a.region}: {a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-emerald-500" /> 到着地
                  </label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all outline-none"
                    value={criteria.destination}
                    onChange={e => setCriteria({...criteria, destination: e.target.value})}
                  >
                    {availableDestinations.map(a => (
                      <option key={a.code} value={a.code}>{a.region}: {a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">出発予定日</label>
                <div className="relative">
                  <input 
                    type="date"
                    className="w-full bg-blue-600 border-none rounded-2xl p-4 text-lg font-black text-white focus:ring-4 focus:ring-blue-100 cursor-pointer shadow-lg shadow-blue-100"
                    value={criteria.departureDate}
                    min={formatDateSafe(TODAY)}
                    onChange={e => setCriteria({...criteria, departureDate: e.target.value})}
                  />
                  <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                </div>
                <p className="mt-3 text-[10px] text-blue-500 font-bold flex items-center">
                  <Info className="w-3 h-3 mr-1" /> 右のカレンダーをタップしても変更できます
                </p>
              </div>
            </div>
          </section>

          {/* AI Card */}
          <section className={`rounded-3xl p-6 shadow-xl border-2 transition-all duration-500 ${
            advice?.recommendation === 'BUY_NOW' ? 'bg-[#003194] border-[#003194] text-white shadow-blue-200' : 'bg-white border-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-base flex items-center">
                <Sparkles className={`w-5 h-5 mr-2 ${advice?.recommendation === 'BUY_NOW' ? 'text-yellow-300' : 'text-blue-600'}`} />
                AI価格分析
              </h3>
            </div>

            {!advice ? (
              <div className="text-center py-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={isLoadingAdvice}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 ${
                    isLoadingAdvice ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  {isLoadingAdvice ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>検索中...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>AIで最安値を分析する</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center space-x-3">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    advice.recommendation === 'BUY_NOW' ? 'bg-yellow-400 text-[#003194]' : 'bg-blue-600 text-white'
                  }`}>
                    {advice.recommendation === 'BUY_NOW' ? '今すぐ購入推奨' : advice.recommendation === 'CAUTION' ? '価格変動に注意' : 'まだ待てる'}
                  </div>
                  <button onClick={handleAnalyze} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                    <RefreshCw className={`w-4 h-4 ${isLoadingAdvice ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="p-3 bg-white/10 rounded-xl mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">分析対象日</p>
                   <p className="text-xs font-black">{criteria.departureDate}</p>
                </div>
                <p className="text-sm font-bold leading-relaxed opacity-95">{advice.reason}</p>
                <div className={`${advice.recommendation === 'BUY_NOW' ? 'bg-white/10' : 'bg-slate-50'} p-4 rounded-2xl`}>
                  <p className="text-[9px] font-black uppercase opacity-60 mb-2 tracking-widest">予測トレンド</p>
                  <p className="text-xs font-bold leading-relaxed">{advice.priceTrend}</p>
                </div>
              </div>
            )}
          </section>
        </aside>

        {/* Right Panel: Calendar */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                  {currentViewDate.getFullYear()}年 {currentViewDate.getMonth() + 1}月
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter flex items-center">
                    <Plane className="w-3 h-3 mr-1" /> 搭乗日: {departureDateObj.toLocaleDateString('ja-JP', {month:'short', day:'numeric'})}
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    カレンダーの金額は「その日に買った場合」の推定運賃です
                  </span>
                </div>
              </div>
              <div className="flex bg-slate-100 p-2 rounded-2xl space-x-1 shadow-inner">
                <button onClick={handlePrevMonth} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90 text-slate-600">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNextMonth} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90 text-slate-600">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-7 gap-3 sm:gap-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                  <div key={d} className={`pb-4 text-center text-[10px] font-black tracking-[0.2em] ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-300'}`}>
                    {d}
                  </div>
                ))}
                
                {Array.from({ length: days[0].getDay() }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-[4/5] bg-slate-50/50 rounded-2xl" />
                ))}

                {days.map((date) => {
                  const dateSafeStr = formatDateSafe(date);
                  const dateStr = date.toDateString();
                  const isToday = dateStr === TODAY.toDateString();
                  const isDeparture = dateStr === departureDateObj.toDateString();
                  const isPast = date < TODAY;
                  const price = getPriceForPurchaseDate(date);
                  const deadlineLabel = fareDeadlines.get(dateSafeStr);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`relative aspect-[4/5] p-2 sm:p-3 rounded-2xl border-2 flex flex-col transition-all group select-none
                        ${isPast ? 'bg-slate-50 border-transparent opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        ${isDeparture ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 z-10 scale-105 ring-4 ring-white' : 
                          isToday ? 'bg-slate-900 border-slate-900 text-white shadow-lg' :
                          deadlineLabel ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-50' :
                          'bg-white border-slate-50 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-auto">
                        <span className={`text-xs font-black ${
                          isDeparture || isToday ? 'text-white' : 
                          date.getDay() === 0 ? 'text-red-500' : date.getDay() === 6 ? 'text-blue-500' : 'text-slate-400'
                        }`}>
                          {date.getDate()}
                        </span>
                        
                        {/* 期限バッジ */}
                        {deadlineLabel && !isDeparture && (
                          <div className={`text-[7px] sm:text-[8px] font-black px-1 py-0.5 rounded shadow-sm ${
                            isPast ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white'
                          }`}>
                            {deadlineLabel}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-2 right-2">
                        {isDeparture && <Plane className="w-4 h-4" />}
                        {isToday && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />}
                      </div>

                      {price !== null && (
                        <div className="mt-auto text-right space-y-0.5">
                          <p className={`text-[8px] font-black uppercase tracking-tighter opacity-50 ${isDeparture || isToday ? 'text-white' : 'text-slate-400'}`}>
                            {isToday ? '今買うと' : deadlineLabel ? '期限価格' : '購入価格'}
                          </p>
                          <p className={`text-[10px] sm:text-[11px] font-black leading-none tracking-tight ${
                            isDeparture || isToday ? 'text-white' : deadlineLabel ? 'text-emerald-700' : 'text-blue-700'
                          }`}>
                            {formatPrice(price).replace('￥', '¥')}
                          </p>
                        </div>
                      )}
                      
                      {!isPast && !isDeparture && (
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-2xl transition-colors" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-[11px] font-black text-slate-400 border-t border-slate-100">
               <div className="flex items-center"><div className="w-3.5 h-3.5 bg-blue-600 rounded-lg mr-2 shadow-sm"></div> 出発日 (フライト当日)</div>
               <div className="flex items-center"><div className="w-3.5 h-3.5 bg-slate-900 rounded-lg mr-2 shadow-sm"></div> 本日 (現在の購入価格)</div>
               <div className="flex items-center"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-lg mr-2 shadow-sm"></div> 購入期限日 (SV75等)</div>
               <div className="flex items-center"><div className="w-3.5 h-3.5 bg-white border-2 border-slate-200 rounded-lg mr-2"></div> その他の購入タイミング</div>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 flex items-start space-x-4">
            <Clock className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-sm text-emerald-900 mb-1">スーパーバリューの仕組み</h4>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                カレンダーに表示されている<b>SV75, SV55...</b>などのラベルは、その日に買うのが最もおトクな期限日であることを示しています。<br/>
                この日を過ぎると、適用される割引率が下がり、チケット価格が一段階跳ね上がります。
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-[11px] text-slate-400 font-black max-w-2xl mx-auto leading-relaxed tracking-wide">
             本アプリのシミュレーションおよびAI分析は参考情報です。実際の空席数やANAの料金改定、燃料調整費、予約タイミングにより価格は変動します。
             最終的な価格は必ずANA公式サイトの予約画面でご確認ください。
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
