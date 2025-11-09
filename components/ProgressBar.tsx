
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animate the bar on mount
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-slate-700">{label}</span>
        <span className="text-sm font-medium text-blue-700">{value}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
