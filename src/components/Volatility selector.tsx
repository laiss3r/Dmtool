import { useState } from 'react';

interface VolatilitySelectorProps {
  index: string;
  setIndex: (index: string) => void;
  currentTick: number | null;
}

const indices = ['R_10', 'R_10s', 'R_24', 'R_24s', 'R_75', 'R_75s', 'R_100', 'R_100s', 'R_150', 'R_150s'];

function VolatilitySelector({ index, setIndex, currentTick }: VolatilitySelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium">Select Volatility Index</label>
      <select
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        className="mt-2 p-2 bg-gray-800 border border-gray-600 rounded w-full"
      >
        {indices.map((idx) => (
          <option key={idx} value={idx}>
            {idx.replace('R_', 'V')}
          </option>
        ))}
      </select>
      <div className="mt-2 text-xl font-bold bg-blue-600 p-2 rounded">
        Current Tick: {currentTick !== null ? currentTick.toFixed(2) : 'Loading...'}
      </div>
    </div>
  );
}

export default VolatilitySelector;
