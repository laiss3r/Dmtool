import { Tick } from '../types';

interface ExpertInsightsProps {
  ticks: Tick[];
}

function ExpertInsights({ ticks }: ExpertInsightsProps) {
  const last10 = ticks.slice(-10);
  const evenCount = last10.filter((tick) => (Math.floor(tick.tick) % 10) % 2 === 0).length;
  return (
    <div className="mb-4 p-2 bg-gray-800 rounded">
      <h2 className="text-lg font-medium">Expert Insights</h2>
      <p>Recent streak: {evenCount} Even digits in last 10 ticks</p>
    </div>
  );
}

export default ExpertInsights;
