import { useState, useEffect } from 'react';
import { Tick, Prediction } from '../types';

interface DigitsPanelProps {
  ticks: Tick[];
  currentTick: number | null;
}

function DigitsPanel({ ticks, currentTick }: DigitsPanelProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [result, setResult] = useState<'Won' | 'Lost' | null>(null);

  const calculateDigitDistribution = () => {
    const last100 = ticks.slice(-100);
    const distribution = Array(10).fill(0);
    last100.forEach((tick) => {
      const digit = Math.floor(tick.tick) % 10;
      distribution[digit]++;
    });
    return distribution.map((count) => (count / last100.length) * 100);
  };

  const evenOddPrediction = (recentTicks: Tick[]) => {
    const last12 = recentTicks.slice(-12);
    const evenCount = last12.filter((tick) => (Math.floor(tick.tick) % 10) % 2 === 0).length;
    const oddCount = last12.length - evenCount;
    const maxRuns = Math.max(evenCount, oddCount) > 6 ? 10 : 5;
    return {
      type: 'EvenOdd' as const,
      recommendation: evenCount > oddCount ? 'Trade Even' : 'Trade Odd',
      maxRuns,
    };
  };

  const overUnderPrediction = () => {
    const distribution = calculateDigitDistribution();
    const maxDigit = distribution.indexOf(Math.max(...distribution));
    const isOver = distribution[maxDigit] > 50;
    return {
      type: 'OverUnder' as const,
      recommendation: `Trade ${isOver ? 'Over' : 'Under'} ${maxDigit}`,
      maxRuns: distribution[maxDigit] > 60 ? 10 : 7,
    };
  };

  const matchesDiffersPrediction = () => {
    const distribution = calculateDigitDistribution();
    const maxDigit = distribution.indexOf(Math.max(...distribution));
    const isMatch = distribution[maxDigit] > 15;
    return {
      type: 'MatchesDiffers' as const,
      recommendation: `${isMatch ? 'Match' : 'Differ'} ${maxDigit}`,
    };
  };

  const handleAnalyze = (type: 'EvenOdd' | 'OverUnder' | 'MatchesDiffers') => {
    if (type === 'EvenOdd') setPrediction(evenOddPrediction(ticks));
    else if (type === 'OverUnder') setPrediction(overUnderPrediction());
    else {
      setPrediction(matchesDiffersPrediction());
      setTimer(10);
      setResult(null);
    }
  };

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && prediction?.type === 'MatchesDiffers') {
      const lastDigit = currentTick !== null ? Math.floor(currentTick) % 10 : null;
      const predictedDigit = parseInt(prediction.recommendation.split(' ')[1]);
      const isMatch = prediction.recommendation.startsWith('Match');
      setResult(lastDigit === predictedDigit && isMatch ? 'Won' : 'Lost');
    }
  }, [timer, currentTick, prediction]);

  const distribution = calculateDigitDistribution();
  const lastDigit = currentTick !== null ? Math.floor(currentTick) % 10 : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {distribution.map((percent, i) => (
          <div
            key={i}
            className={`p-2 text-center rounded ${
              lastDigit === i ? 'bg-blue-600' : 'bg-gray-800'
            }`}
          >
            {i}: {percent.toFixed(1)}%
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => handleAnalyze('EvenOdd')}
          className="p-2 bg-blue-600 rounded"
        >
          Analyze Even/Odd
        </button>
        <button
          onClick={() => handleAnalyze('OverUnder')}
          className="p-2 bg-blue-600 rounded"
        >
          Analyze Over/Under
        </button>
        <button
          onClick={() => handleAnalyze('MatchesDiffers')}
          className="p-2 bg-blue-600 rounded"
        >
          Analyze Matches/Differs
        </button>
      </div>
      <div className="text-lg">
        {prediction && (
          <div>
            {prediction.recommendation}
            {prediction.maxRuns && ` (up to ${prediction.maxRuns} runs)`}
          </div>
        )}
        {timer !== null && (
          <div>Timer: {timer}s {result && ` - ${result}`}</div>
        )}
        <div className="flex space-x-2 mt-2">
          {ticks.slice(-8).map((tick, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded ${
                (Math.floor(tick.tick) % 10) % 2 === 0 ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {(Math.floor(tick.tick) % 10) % 2 === 0 ? 'E' : 'O'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DigitsPanel;
