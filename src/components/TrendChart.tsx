import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Pillar } from '@/lib/data';

interface TrendChartProps {
  data: { date: string; score: number }[];
  pillar: Pillar;
  height?: number;
}

const pillarColors: Record<Pillar, string> = {
  finance: 'var(--pillar-finance)',
  career: 'var(--pillar-career)',
  health: 'var(--pillar-health)',
  spirituality: 'var(--pillar-spirituality)',
  hobbies: 'var(--pillar-hobbies)',
};

export const TrendChart = ({ data, pillar, height = 200 }: TrendChartProps) => {
  const color = pillarColors[pillar];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${pillar}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${color})`} stopOpacity={0.3} />
              <stop offset="100%" stopColor={`hsl(${color})`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            ticks={[0, 25, 50, 75, 100]}
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
            formatter={(value: number) => [`${value}`, 'Score']}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={`hsl(${color})`}
            strokeWidth={2}
            fill={`url(#gradient-${pillar})`}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: `hsl(${color})`,
              strokeWidth: 0 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
