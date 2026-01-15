import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TrendChart } from '@/components/TrendChart';
import { PILLARS, mockLogs, getPillarScores, getScoreHistory, Pillar } from '@/lib/data';
import { cn } from '@/lib/utils';

const PillarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pillar = PILLARS.find(p => p.id === id);
  const scores = getPillarScores(mockLogs);
  const score = scores.find(s => s.pillar === id);
  const history = getScoreHistory(mockLogs, id as Pillar, 30);

  if (!pillar || !score) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Pillar not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  // Get raw data stats for the detail view
  const last30Days = mockLogs.slice(-30);
  
  const getDetailedStats = () => {
    switch (id) {
      case 'finance':
        return {
          metrics: [
            { label: 'Total Income', value: `$${last30Days.reduce((s, l) => s + l.finance.incomeAdded, 0).toLocaleString()}` },
            { label: 'Total Spent', value: `$${last30Days.reduce((s, l) => s + l.finance.moneySpent, 0).toLocaleString()}` },
            { label: 'Total Saved', value: `$${last30Days.reduce((s, l) => s + l.finance.savingsAdded, 0).toLocaleString()}` },
            { label: 'Avg Daily Spend', value: `$${Math.round(last30Days.reduce((s, l) => s + l.finance.moneySpent, 0) / 30)}` },
          ],
          explanation: 'This score reflects your savings-to-spending ratio. Higher savings relative to spending improves your score.',
        };
      case 'career':
        return {
          metrics: [
            { label: 'Total Study Time', value: `${last30Days.reduce((s, l) => s + l.career.minutesStudied, 0)} min` },
            { label: 'Skills Practiced', value: `${last30Days.reduce((s, l) => s + l.career.skillsPracticed, 0)} total` },
            { label: 'Project Days', value: `${last30Days.filter(l => l.career.projectWork).length} days` },
            { label: 'Avg Daily Study', value: `${Math.round(last30Days.reduce((s, l) => s + l.career.minutesStudied, 0) / 30)} min` },
          ],
          explanation: 'Calculated from study time and project work consistency. Regular practice and project engagement boost this score.',
        };
      case 'health':
        return {
          metrics: [
            { label: 'Avg Sleep', value: `${(last30Days.reduce((s, l) => s + l.health.sleepHours, 0) / 30).toFixed(1)} hrs` },
            { label: 'Workout Days', value: `${last30Days.filter(l => l.health.workoutDone).length} days` },
            { label: 'Avg Mood', value: `${(last30Days.reduce((s, l) => s + l.health.moodScale, 0) / 30).toFixed(1)}/5` },
            { label: 'Workout Rate', value: `${Math.round(last30Days.filter(l => l.health.workoutDone).length / 30 * 100)}%` },
          ],
          explanation: 'Combines sleep quality, workout frequency, and mood tracking. Balanced across all three areas leads to the highest scores.',
        };
      case 'spirituality':
        return {
          metrics: [
            { label: 'Prayer Days', value: `${last30Days.filter(l => l.spirituality.prayerDone).length} days` },
            { label: 'Total Reflection', value: `${last30Days.reduce((s, l) => s + l.spirituality.reflectionMinutes, 0)} min` },
            { label: 'Consistency', value: `${Math.round(last30Days.filter(l => l.spirituality.prayerDone).length / 30 * 100)}%` },
            { label: 'Avg Reflection', value: `${Math.round(last30Days.reduce((s, l) => s + l.spirituality.reflectionMinutes, 0) / 30)} min` },
          ],
          explanation: 'Based on prayer/meditation consistency and reflection time. Daily practice weighs more heavily than occasional long sessions.',
        };
      case 'hobbies':
        return {
          metrics: [
            { label: 'Total Practice', value: `${last30Days.reduce((s, l) => s + l.hobbies.practiceMinutes, 0)} min` },
            { label: 'Technique Days', value: `${last30Days.filter(l => l.hobbies.techniquePracticed).length} days` },
            { label: 'Avg Daily Practice', value: `${Math.round(last30Days.reduce((s, l) => s + l.hobbies.practiceMinutes, 0) / 30)} min` },
            { label: 'Engagement Rate', value: `${Math.round(last30Days.filter(l => l.hobbies.practiceMinutes > 0).length / 30 * 100)}%` },
          ],
          explanation: 'Measures time invested in personal interests and skill development. Regular, focused practice drives improvement.',
        };
      default:
        return { metrics: [], explanation: '' };
    }
  };

  const { metrics, explanation } = getDetailedStats();
  const trendIcon = score.trend === 'up' ? '↑' : score.trend === 'down' ? '↓' : '→';

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start gap-6">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
            'bg-gradient-to-br from-card to-muted/50 border border-border'
          )}>
            {pillar.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pillar.name}</h1>
            <p className="text-muted-foreground mt-1">{pillar.description}</p>
          </div>
        </div>

        {/* Score Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className={cn('text-5xl font-bold', pillar.colorClass)}>
                {score.score}
              </span>
              <span className="text-2xl text-muted-foreground ml-2">/100</span>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full',
              score.trend === 'up' ? 'bg-pillar-finance/10 text-pillar-finance' :
              score.trend === 'down' ? 'bg-pillar-health/10 text-pillar-health' :
              'bg-muted text-muted-foreground'
            )}>
              <span className="text-lg">{trendIcon}</span>
              <span className="font-medium">{Math.abs(score.change)} pts</span>
              <span className="text-sm opacity-80">vs last period</span>
            </div>
          </div>

          {/* Trend Chart */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Score Trend (30 days)</h3>
            <TrendChart data={history} pillar={id as Pillar} height={250} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Raw Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-medium mb-2">How this score is calculated</h3>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </div>
      </div>
    </Layout>
  );
};

export default PillarDetail;
