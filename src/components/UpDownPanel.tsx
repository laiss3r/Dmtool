import { useState } from 'react';
import { Tick } from '../types';

interface UpDownPanelProps {
  ticks: Tick[];
  index: string;
}

function UpDownPanel({ ticks, index }: UpDownPanelProps) {
  const [prediction, setPrediction] = useState<string | null>(null);

  const riseFallPrediction = () => {
    if (index !== 'R_100') return 'Switch to a different market';
    const last58 = ticks.slice(-58);
    if (last58.length < 58) return 'Switch to a different market';
    const upCount = last58.filter((tick, i) => i > 0 && tick.tick > last58[i - 1].tick).length;
    const downCount = last58.filter((tick, i) => i > 0 && tick.tick < last58[i - 1].tick).length;
    if (Math.abs(upCount - downCount) < 10) return 'Switch to a different market';
    return upCount > downCount ? 'Trade Rise' : 'Trade Fall';
  };

  return (
    <div>
      <button
        onClick={() => setPrediction(riseFallPrediction())}
        className="p-2 bg-blue-600 rounded"
      >
        Analyze
      </button>
      {prediction && <div className="mt-2 text-lg">{prediction}</div>}
    </div>
  );
}

export default UpDownPanel;
