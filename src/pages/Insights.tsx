import { Layout } from '@/components/Layout';
import { InsightCard } from '@/components/InsightCard';
import { useLogs } from '@/context/LogContext';
import { PILLARS, getPillarScores, getScoreHistory } from '@/lib/data';
import { TrendChart } from '@/components/TrendChart';

const Insights = () => {
  const { logs } = useLogs();
  const scores = getPillarScores(logs);
  const last30Days = logs.slice(-30);
  const last7Days = logs.slice(-7);
  const hasData = logs.length > 0;

  // Generate analytical insights
  const generateInsights = () => {
    if (logs.length < 3) return [];
    
    const insights = [];

    // Sleep-Health correlation
    const lowSleepDays = last30Days.filter(l => l.health.sleepHours < 6).length;
    const healthScore = scores.find(s => s.pillar === 'health')?.score || 0;
    if (lowSleepDays >= 3 && healthScore < 60) {
      insights.push({
        title: 'Sleep Pattern Correlation',
        description: `Your health score tends to drop when sleep falls below 6 hours. You've had ${lowSleepDays} such days in the past month.`,
        type: 'negative' as const,
        pillar: 'Health',
      });
    }

    // Consistency patterns
    const studyDays = last30Days.filter(l => l.career.minutesStudied > 0).length;
    if (studyDays >= 20) {
      insights.push({
        title: 'Study Consistency',
        description: `You've studied on ${studyDays} out of ${last30Days.length} days. This regular engagement is the primary driver of your career score.`,
        type: 'positive' as const,
        pillar: 'Career',
      });
    } else if (studyDays < 10 && last30Days.length >= 10) {
      insights.push({
        title: 'Study Frequency',
        description: `Study sessions logged on only ${studyDays} days recently. Increasing frequency, even with shorter sessions, may improve your career trajectory.`,
        type: 'negative' as const,
        pillar: 'Career',
      });
    }

    // Savings behavior
    const savingDays = last30Days.filter(l => l.finance.savingsAdded > 0).length;
    const totalSaved = last30Days.reduce((s, l) => s + l.finance.savingsAdded, 0);
    const totalSpent = last30Days.reduce((s, l) => s + l.finance.moneySpent, 0);
    
    if (totalSaved > totalSpent * 0.2 && totalSaved > 0) {
      insights.push({
        title: 'Positive Savings Ratio',
        description: `You're saving more than 20% of what you spend. This healthy ratio contributes strongly to your finance score.`,
        type: 'positive' as const,
        pillar: 'Finance',
      });
    }

    // Mood tracking
    if (last7Days.length >= 7) {
      const avgMood = last7Days.reduce((s, l) => s + l.health.moodScale, 0) / 7;
      const prevWeek = logs.slice(-14, -7);
      if (prevWeek.length >= 7) {
        const prevWeekMood = prevWeek.reduce((s, l) => s + l.health.moodScale, 0) / 7;
        
        if (avgMood > prevWeekMood + 0.5) {
          insights.push({
            title: 'Mood Improvement',
            description: `Your average mood this week (${avgMood.toFixed(1)}/5) is higher than last week (${prevWeekMood.toFixed(1)}/5). Review what changed.`,
            type: 'positive' as const,
            pillar: 'Health',
          });
        } else if (avgMood < prevWeekMood - 0.5) {
          insights.push({
            title: 'Mood Shift',
            description: `Your average mood declined from ${prevWeekMood.toFixed(1)} to ${avgMood.toFixed(1)} this week. Consider what factors may have contributed.`,
            type: 'neutral' as const,
            pillar: 'Health',
          });
        }
      }
    }

    // Spirituality consistency
    if (last30Days.length >= 10) {
      const prayerRate = last30Days.filter(l => l.spirituality.prayerDone).length / last30Days.length;
      if (prayerRate >= 0.7) {
        insights.push({
          title: 'Spiritual Consistency',
          description: `Prayer/meditation maintained on ${Math.round(prayerRate * 100)}% of days. This consistency is the foundation of your spirituality score.`,
          type: 'positive' as const,
          pillar: 'Spirituality',
        });
      }
    }

    // Hobby engagement
    if (last30Days.length >= 10) {
      const hobbyDays = last30Days.filter(l => l.hobbies.practiceMinutes > 0).length;
      const avgPractice = hobbyDays > 0 ? last30Days.reduce((s, l) => s + l.hobbies.practiceMinutes, 0) / hobbyDays : 0;
      
      if (hobbyDays >= 15 && avgPractice >= 30) {
        insights.push({
          title: 'Active Hobby Practice',
          description: `Averaging ${Math.round(avgPractice)} minutes per session across ${hobbyDays} days shows meaningful engagement with your interests.`,
          type: 'positive' as const,
          pillar: 'Hobbies',
        });
      }
    }

    // Cross-pillar correlation
    if (last30Days.length >= 15) {
      const workoutDays = last30Days.filter(l => l.health.workoutDone).length;
      const productiveDays = last30Days.filter(l => l.career.projectWork).length;
      
      if (workoutDays >= 15 && productiveDays >= 15) {
        insights.push({
          title: 'Exercise-Productivity Link',
          description: `Days with workouts often correlate with productive career days. Both metrics are strong this month.`,
          type: 'positive' as const,
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  // Weekly summary
  const weeklyData = last7Days.length > 0 ? {
    avgSleep: (last7Days.reduce((s, l) => s + l.health.sleepHours, 0) / last7Days.length).toFixed(1),
    workoutDays: last7Days.filter(l => l.health.workoutDone).length,
    studyMinutes: last7Days.reduce((s, l) => s + l.career.minutesStudied, 0),
    reflectionMinutes: last7Days.reduce((s, l) => s + l.spirituality.reflectionMinutes, 0),
  } : null;

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground mt-1">
            Patterns and observations from your data
          </p>
        </div>

        {/* Empty State */}
        {!hasData && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No Insights Yet</h2>
            <p className="text-muted-foreground mb-4">
              Log a few days of data to start seeing patterns and insights.
            </p>
            <a 
              href="/log" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Logging →
            </a>
          </div>
        )}

        {/* Weekly Summary */}
        {weeklyData && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">This Week at a Glance</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">Avg Sleep</p>
                <p className="text-2xl font-semibold">{weeklyData.avgSleep} hrs</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">Workouts</p>
                <p className="text-2xl font-semibold">{weeklyData.workoutDays} days</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-2xl font-semibold">{weeklyData.studyMinutes} min</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">Reflection</p>
                <p className="text-2xl font-semibold">{weeklyData.reflectionMinutes} min</p>
              </div>
            </div>
          </div>
        )}

        {/* All Pillars Overview */}
        {hasData && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">30-Day Trends</h2>
            <div className="grid gap-6">
              {PILLARS.map(pillar => {
                const history = getScoreHistory(logs, pillar.id, 30);
                return (
                  <div key={pillar.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{pillar.icon}</span>
                      <span className="text-sm font-medium">{pillar.name}</span>
                    </div>
                    {history.length > 0 ? (
                      <TrendChart data={history} pillar={pillar.id} height={120} />
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
                        Need more data to show trends
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytical Insights */}
        {hasData && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Observations</h2>
            {insights.length > 0 ? (
              <div className="grid gap-3">
                {insights.map((insight, i) => (
                  <InsightCard key={i} {...insight} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">
                  Continue logging data to generate meaningful insights. At least 3 days of data needed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Methodology Note */}
        {hasData && (
          <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
            <p>
              Insights are derived algorithmically from your logged data. 
              They reflect patterns, not judgments.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Insights;
