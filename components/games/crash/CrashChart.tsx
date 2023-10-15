import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ReferenceDot } from 'recharts';

interface CrashChartProps {
  multiplier: number;
  isCrashed: boolean;
  cashOutMultiplier: number | null;
}

const CrashChart: React.FC<CrashChartProps> = ({ multiplier, isCrashed, cashOutMultiplier }) => {
  const [data, setData] = useState<{time: number, multiplier: number}[]>([{time: 0, multiplier: 1}]);
  const [cashOutTime, setCashOutTime] = useState<number | null>(null);

  useEffect(() => {
    setData((prevData) => [...prevData, { time: prevData.length, multiplier }]);
  }, [multiplier]);

  useEffect(() => {
    if (cashOutMultiplier !== null) {
      setCashOutTime(data.length - 1);
    }
  }, [cashOutMultiplier]);

  useEffect(() => {
    if (isCrashed) {
      setData([{ time: 0, multiplier: 1 }]);
      setCashOutTime(null);
    }
  }, [isCrashed]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Multiplier: {multiplier.toFixed(2)}x</h2>
      {isCrashed && <h2>The game has crashed!</h2>}
      <ResponsiveContainer width="80%" height="100%" className="mx-auto">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={[1, 'dataMax + 1']} />
          <Tooltip />
          <Area type='monotone' dataKey='multiplier' stroke='#82ca9d' fillOpacity={0.3} fill='url(#colorPv)' />
          <Line type="monotone" dataKey="multiplier" stroke="#8884d8" />
          {cashOutTime !== null && cashOutMultiplier !== null && <ReferenceDot x={cashOutTime} y={cashOutMultiplier} stroke="red" />}
          {isCrashed && <ReferenceDot x={data.length - 1} y={multiplier} stroke="black" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrashChart;
