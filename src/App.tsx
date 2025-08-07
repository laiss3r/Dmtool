import { useState, useEffect } from 'react';
import VolatilitySelector from './components/VolatilitySelector';
import TradeTypeSelector from './components/TradeTypeSelector';
import DigitsPanel from './components/DigitsPanel';
import UpDownPanel from './components/UpDownPanel';
import ExpertInsights from './components/ExpertInsights';
import { Tick } from './types';

function App() {
  const [index, setIndex] = useState('R_100'); // Default: Volatility 100
  const [currentTick, setCurrentTick] = useState<number | null>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [tradeType, setTradeType] = useState<'Digits' | 'UpDown'>('Digits');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.deriv.com/websockets/v3?app_id=1089');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ ticks: index }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tick) {
        setCurrentTick(data.tick.tick);
        setTicks((prev) => [...prev.slice(-100), { tick: data.tick.tick, epoch: data.tick.epoch }]);
      }
    };

    return () => ws.close();
  }, [index]);

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">MasterD Analysis</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-blue-600 rounded"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <ExpertInsights ticks={ticks} />
        <VolatilitySelector index={index} setIndex={setIndex} currentTick={currentTick} />
        <TradeTypeSelector tradeType={tradeType} setTradeType={setTradeType} />
        {tradeType === 'Digits' ? (
          <DigitsPanel ticks={ticks} currentTick={currentTick} />
        ) : (
          <UpDownPanel ticks={ticks} index={index} />
        )}
      </div>
    </div>
  );
}

export default App;
