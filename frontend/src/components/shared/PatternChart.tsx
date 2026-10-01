import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import type { TopicMastery } from '../../types';

interface PatternChartProps {
  data: TopicMastery[];
}

export const PatternChart: React.FC<PatternChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">No data available</div>;
  }

  const chartData = data.map(item => ({
    subject: item.topicName,
    A: item.percentage,
    fullMark: 100,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #27272a', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Radar name="Mastery" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
