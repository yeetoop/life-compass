export type Pillar = 'finance' | 'career' | 'health' | 'spirituality' | 'hobbies';

export interface PillarConfig {
  id: Pillar;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
}

export const PILLARS: PillarConfig[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Income, spending, and savings patterns',
    icon: '💰',
    colorClass: 'pillar-finance',
    bgColorClass: 'bg-pillar-finance',
  },
  {
    id: 'career',
    name: 'Career',
    description: 'Education and professional growth',
    icon: '📈',
    colorClass: 'pillar-career',
    bgColorClass: 'bg-pillar-career',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Physical and mental wellbeing',
    icon: '🧘',
    colorClass: 'pillar-health',
    bgColorClass: 'bg-pillar-health',
  },
  {
    id: 'spirituality',
    name: 'Spirituality',
    description: 'Reflection and inner growth',
    icon: '✨',
    colorClass: 'pillar-spirituality',
    bgColorClass: 'bg-pillar-spirituality',
  },
  {
    id: 'hobbies',
    name: 'Hobbies',
    description: 'Personal interests and creativity',
    icon: '🎨',
    colorClass: 'pillar-hobbies',
    bgColorClass: 'bg-pillar-hobbies',
  },
];

export interface DailyLog {
  date: string;
  finance: {
    incomeAdded: number;
    moneySpent: number;
    savingsAdded: number;
  };
  career: {
    minutesStudied: number;
    skillsPracticed: number;
    projectWork: boolean;
  };
  health: {
    sleepHours: number;
    workoutDone: boolean;
    moodScale: number; // 1-5
  };
  spirituality: {
    prayerDone: boolean;
    reflectionMinutes: number;
  };
  hobbies: {
    practiceMinutes: number;
    techniquePracticed: boolean;
  };
}

export interface PillarScore {
  pillar: Pillar;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

// Generate mock historical data
const generateMockData = (): DailyLog[] => {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 60; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    logs.push({
      date: date.toISOString().split('T')[0],
      finance: {
        incomeAdded: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 100 : 0,
        moneySpent: Math.floor(Math.random() * 100) + 20,
        savingsAdded: Math.random() > 0.5 ? Math.floor(Math.random() * 200) : 0,
      },
      career: {
        minutesStudied: Math.floor(Math.random() * 120),
        skillsPracticed: Math.floor(Math.random() * 3),
        projectWork: Math.random() > 0.4,
      },
      health: {
        sleepHours: 5 + Math.random() * 4,
        workoutDone: Math.random() > 0.5,
        moodScale: Math.floor(Math.random() * 5) + 1,
      },
      spirituality: {
        prayerDone: Math.random() > 0.3,
        reflectionMinutes: Math.floor(Math.random() * 30),
      },
      hobbies: {
        practiceMinutes: Math.floor(Math.random() * 60),
        techniquePracticed: Math.random() > 0.6,
      },
    });
  }
  
  return logs;
};

export const mockLogs = generateMockData();

// Calculate pillar score from logs
export const calculatePillarScore = (logs: DailyLog[], pillar: Pillar, days: number = 30): number => {
  const recentLogs = logs.slice(-days);
  
  switch (pillar) {
    case 'finance': {
      const avgSavings = recentLogs.reduce((sum, log) => sum + log.finance.savingsAdded, 0) / days;
      const avgSpending = recentLogs.reduce((sum, log) => sum + log.finance.moneySpent, 0) / days;
      const ratio = avgSavings / (avgSpending + 1);
      return Math.min(100, Math.max(0, ratio * 30 + 40));
    }
    case 'career': {
      const avgStudy = recentLogs.reduce((sum, log) => sum + log.career.minutesStudied, 0) / days;
      const projectDays = recentLogs.filter(log => log.career.projectWork).length;
      return Math.min(100, (avgStudy / 60) * 40 + (projectDays / days) * 60);
    }
    case 'health': {
      const avgSleep = recentLogs.reduce((sum, log) => sum + log.health.sleepHours, 0) / days;
      const workoutDays = recentLogs.filter(log => log.health.workoutDone).length;
      const avgMood = recentLogs.reduce((sum, log) => sum + log.health.moodScale, 0) / days;
      const sleepScore = Math.min(1, avgSleep / 7.5) * 35;
      const workoutScore = (workoutDays / days) * 35;
      const moodScore = (avgMood / 5) * 30;
      return Math.min(100, sleepScore + workoutScore + moodScore);
    }
    case 'spirituality': {
      const prayerDays = recentLogs.filter(log => log.spirituality.prayerDone).length;
      const avgReflection = recentLogs.reduce((sum, log) => sum + log.spirituality.reflectionMinutes, 0) / days;
      return Math.min(100, (prayerDays / days) * 60 + Math.min(40, avgReflection * 2));
    }
    case 'hobbies': {
      const avgPractice = recentLogs.reduce((sum, log) => sum + log.hobbies.practiceMinutes, 0) / days;
      const techniqueDays = recentLogs.filter(log => log.hobbies.techniquePracticed).length;
      return Math.min(100, (avgPractice / 45) * 60 + (techniqueDays / days) * 40);
    }
  }
};

export const getPillarScores = (logs: DailyLog[]): PillarScore[] => {
  return PILLARS.map(pillar => {
    const currentScore = calculatePillarScore(logs, pillar.id, 30);
    const previousScore = calculatePillarScore(logs.slice(0, -30), pillar.id, 30);
    const change = currentScore - previousScore;
    
    return {
      pillar: pillar.id,
      score: Math.round(currentScore),
      trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
      change: Math.round(change),
    };
  });
};

export const getScoreHistory = (logs: DailyLog[], pillar: Pillar, days: number = 30): { date: string; score: number }[] => {
  const history: { date: string; score: number }[] = [];
  
  for (let i = days; i >= 0; i--) {
    const slicedLogs = logs.slice(0, logs.length - i);
    if (slicedLogs.length >= 7) {
      const score = calculatePillarScore(slicedLogs, pillar, 7);
      history.push({
        date: logs[logs.length - 1 - i]?.date || '',
        score: Math.round(score),
      });
    }
  }
  
  return history;
};
