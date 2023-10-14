import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CrashChartProps {
  multiplier: number;
  isCrashed: boolean;
}

const CrashChart: React.FC<CrashChartProps> = ({ multiplier, isCrashed }) => {
  const [data, setData] = useState<{time: number, multiplier: number}[]>([{time: 0, multiplier: 1}]);

  useEffect(() => {
    setData((prevData) => [...prevData, { time: prevData.length, multiplier }]);
  }, [multiplier]);

  useEffect(() => {
    if (isCrashed) {
      setData([{ time: 0, multiplier: 1 }]);
    }
  }, [isCrashed]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Multiplier: {multiplier.toFixed(2)}x</h2>
      {isCrashed && <h2>The game has crashed!</h2>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="time" />
          <YAxis domain={[1, 'dataMax + 1']} />
          <Tooltip />
          <Line type="monotone" dataKey="multiplier" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrashChart;
