import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceDot,
} from "recharts";

interface CrashChartProps {
  multiplier: number;
  isCrashed: boolean;
  cashOutMultiplier: number | null;
}

const CrashChart: React.FC<CrashChartProps> = ({
  multiplier,
  isCrashed,
  cashOutMultiplier,
}) => {
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([
    { time: 0, multiplier: 1 },
  ]);
  const [cashOutTime, setCashOutTime] = useState<number | null>(null);
  const [endMultiplier, setEndMultiplier] = useState<number | null>(null);

  useEffect(() => {
    setData((prevData) => [...prevData, { time: prevData.length, multiplier }]);
    if (!isCrashed) {
      setEndMultiplier(multiplier);
    }
  }, [multiplier, isCrashed]);

  useEffect(() => {
    if (cashOutMultiplier !== null) {
      setCashOutTime(data.length - 1);
    }
  }, [cashOutMultiplier]);

  return (
    <div className="m-6 w-full h-[25rem] flex flex-col items-center justify-center">
      <div className="text-xl mb-4">
        <h2>Multiplier: {multiplier.toFixed(2)}x</h2>
        {isCrashed && <h2 className="text-red-500">The game has crashed!</h2>}
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[1, "dataMax + 1"]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="multiplier"
              stroke="#82ca9d"
              fillOpacity={0.3}
              fill="url(#colorPv)"
            />
            <Line type="monotone" dataKey="multiplier" stroke="#8884d8" />
            {cashOutTime !== null && cashOutMultiplier !== null && (
              <ReferenceDot
                x={cashOutTime}
                y={cashOutMultiplier}
                stroke="red"
              />
            )}
            {endMultiplier !== null && (
              <ReferenceDot
                x={data.length - 1}
                y={endMultiplier}
                stroke="black"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrashChart;
