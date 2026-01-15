import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { RadarChart } from '@/components/RadarChart';
import { PillarCard } from '@/components/PillarCard';
import { InsightCard } from '@/components/InsightCard';
import { mockLogs, getPillarScores, PILLARS, calculatePillarScore } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Dashboard = () => {
  const [showComparison, setShowComparison] = useState(false);
  
  const currentScores = getPillarScores(mockLogs);
  const previousScores = getPillarScores(mockLogs.slice(0, -30));

  // Generate insights based on data
  const topPillar = [...currentScores].sort((a, b) => b.score - a.score)[0];
  const lowestPillar = [...currentScores].sort((a, b) => a.score - b.score)[0];
  const trendingUp = currentScores.filter(s => s.trend === 'up');
  const trendingDown = currentScores.filter(s => s.trend === 'down');

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Life Overview</h1>
            <p className="text-muted-foreground mt-1">
              Current state across all pillars
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="comparison" 
              checked={showComparison}
              onCheckedChange={setShowComparison}
            />
            <Label htmlFor="comparison" className="text-sm text-muted-foreground cursor-pointer">
              Compare to last 30 days
            </Label>
          </div>
        </div>

        {/* Main Radar Chart */}
        <div className="glass-card rounded-2xl p-6 lg:p-8">
          <RadarChart 
            scores={currentScores} 
            previousScores={previousScores}
            showComparison={showComparison}
          />
        </div>

        {/* Pillar Cards Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Pillars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PILLARS.map((pillar) => {
              const score = currentScores.find(s => s.pillar === pillar.id)!;
              return (
                <PillarCard 
                  key={pillar.id} 
                  pillar={pillar} 
                  score={score} 
                />
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Current Insights</h2>
          <div className="grid gap-3">
            {trendingUp.length > 0 && (
              <InsightCard
                title="Upward Trends"
                description={`${trendingUp.map(s => PILLARS.find(p => p.id === s.pillar)?.name).join(' and ')} ${trendingUp.length === 1 ? 'is' : 'are'} trending upward this month. Consistent effort is paying off.`}
                type="positive"
              />
            )}
            {trendingDown.length > 0 && (
              <InsightCard
                title="Areas to Watch"
                description={`${trendingDown.map(s => PILLARS.find(p => p.id === s.pillar)?.name).join(' and ')} ${trendingDown.length === 1 ? 'shows' : 'show'} a slight decline. Consider reviewing your inputs in these areas.`}
                type="negative"
              />
            )}
            <InsightCard
              title="Strongest Pillar"
              description={`${PILLARS.find(p => p.id === topPillar.pillar)?.name} is currently your highest scoring area at ${topPillar.score}/100.`}
              type="neutral"
              pillar={PILLARS.find(p => p.id === topPillar.pillar)?.name}
            />
            <InsightCard
              title="Growth Opportunity"
              description={`${PILLARS.find(p => p.id === lowestPillar.pillar)?.name} at ${lowestPillar.score}/100 offers the most room for improvement.`}
              type="neutral"
              pillar={PILLARS.find(p => p.id === lowestPillar.pillar)?.name}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
