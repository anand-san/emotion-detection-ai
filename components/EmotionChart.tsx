import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnalysisData } from "../types";
import { EMOTION_HEX_COLORS } from "../constants";

interface EmotionChartProps {
  history: AnalysisData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = EMOTION_HEX_COLORS[data.emotion] || "#94a3b8";
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-xl min-w-[150px]">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <p className="font-bold text-sm text-white">{data.emotion}</p>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400 text-xs flex justify-between">
            <span>Intensity:</span>
            <span className="text-slate-200 font-mono">
              {data.confidence.toFixed(0)}%
            </span>
          </p>
          <p className="text-slate-500 text-[10px] pt-1 font-mono text-right">
            {new Date(data.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = EMOTION_HEX_COLORS[payload.emotion] || "#94a3b8";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      stroke={color}
      strokeWidth={2}
      fill="#1e293b"
    />
  );
};

const EmotionChart: React.FC<EmotionChartProps> = ({ history }) => {
  // Normalize data for chart
  const data = history.map((h) => ({
    ...h,
    confidence: h.confidence * 100,
  }));

  // Get unique detected emotions for legend
  const detectedEmotions = Array.from(new Set(history.map((h) => h.emotion)));

  return (
    <div className="h-[280px] w-full bg-slate-800/30 rounded-xl border border-slate-700/50 p-5 mt-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              ></path>
            </svg>
            Emotional Timeline
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">
            Real-time emotion tracking over session duration
          </p>
        </div>

        {/* Dynamic Legend */}
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 max-w-[50%]">
          {detectedEmotions.map((emotion) => (
            <div
              key={emotion}
              className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: EMOTION_HEX_COLORS[emotion] }}
              ></span>
              <span className="text-[10px] text-slate-400 font-medium">
                {emotion}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
              opacity={0.5}
            />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString([], {
                  minute: "2-digit",
                  second: "2-digit",
                })
              }
              stroke="#475569"
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fill: "#64748b", fontSize: 10 }}
              width={30}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#475569",
                strokeDasharray: "5 5",
                opacity: 0.5,
              }}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              dot={<CustomDot />}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmotionChart;
