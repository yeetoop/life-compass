import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { PillarScore, PILLARS } from '@/lib/data';

interface RadarChartProps {
  scores: PillarScore[];
  previousScores?: PillarScore[];
  showComparison?: boolean;
}

export const RadarChart = ({ scores, previousScores, showComparison = false }: RadarChartProps) => {
  const data = PILLARS.map((pillar) => {
    const currentScore = scores.find((s) => s.pillar === pillar.id)?.score || 0;
    const prevScore = previousScores?.find((s) => s.pillar === pillar.id)?.score || 0;
    
    return {
      subject: pillar.name,
      current: currentScore,
      previous: prevScore,
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 12,
              fontWeight: 500 
            }}
            tickLine={false}
          />
          {showComparison && previousScores && (
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              fill="hsl(var(--muted))"
              fillOpacity={0.2}
              dot={false}
            />
          )}
          <Radar
            name="Current"
            dataKey="current"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="hsl(var(--primary))"
            fillOpacity={0.15}
            dot={{ 
              r: 4, 
              fill: 'hsl(var(--primary))',
              strokeWidth: 0,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              padding: '8px 12px',
            }}
            labelStyle={{
              color: 'hsl(var(--foreground))',
              fontWeight: 600,
              marginBottom: '4px',
            }}
            itemStyle={{
              color: 'hsl(var(--muted-foreground))',
              fontSize: '13px',
            }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};
