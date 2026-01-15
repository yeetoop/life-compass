import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PILLARS } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Settings = () => {
  const [pillarVisibility, setPillarVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(PILLARS.map(p => [p.id, true]))
  );

  const [weights, setWeights] = useState<Record<string, Record<string, number>>>({
    finance: { savingsRatio: 60, incomeGrowth: 40 },
    career: { studyTime: 50, projectWork: 50 },
    health: { sleep: 35, workout: 35, mood: 30 },
    spirituality: { consistency: 60, reflectionTime: 40 },
    hobbies: { practiceTime: 60, techniqueWork: 40 },
  });

  const handleWeightChange = (pillar: string, key: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [pillar]: {
        ...prev[pillar],
        [key]: value,
      },
    }));
  };

  const handleSaveWeights = () => {
    toast.success('Scoring weights updated', {
      description: 'Your custom weights will be applied to future calculations.',
    });
  };

  const handleExportData = () => {
    toast.success('Data exported', {
      description: 'Your data has been downloaded as JSON.',
    });
  };

  const handleResetData = () => {
    toast('Data reset', {
      description: 'All logged data has been cleared.',
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize how your scores are calculated
          </p>
        </div>

        {/* Pillar Visibility */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Pillar Visibility</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Toggle which pillars appear on your dashboard
          </p>
          <div className="space-y-4">
            {PILLARS.map(pillar => (
              <div key={pillar.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{pillar.icon}</span>
                  <span className="font-medium">{pillar.name}</span>
                </div>
                <Switch
                  checked={pillarVisibility[pillar.id]}
                  onCheckedChange={(checked) => 
                    setPillarVisibility(prev => ({ ...prev, [pillar.id]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Score Weights */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Score Weights</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Adjust how much each input contributes to its pillar score. 
            Scores are relative to your own data, not absolute standards.
          </p>

          <div className="space-y-8">
            {/* Finance */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">💰</span>
                <h3 className="font-medium">Finance</h3>
              </div>
              <div className="space-y-4 pl-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Savings Ratio</Label>
                    <span className="text-sm font-medium">{weights.finance.savingsRatio}%</span>
                  </div>
                  <Slider
                    value={[weights.finance.savingsRatio]}
                    onValueChange={([v]) => handleWeightChange('finance', 'savingsRatio', v)}
                    max={100}
                    step={5}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Income Growth</Label>
                    <span className="text-sm font-medium">{weights.finance.incomeGrowth}%</span>
                  </div>
                  <Slider
                    value={[weights.finance.incomeGrowth]}
                    onValueChange={([v]) => handleWeightChange('finance', 'incomeGrowth', v)}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Health */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🧘</span>
                <h3 className="font-medium">Health</h3>
              </div>
              <div className="space-y-4 pl-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Sleep Quality</Label>
                    <span className="text-sm font-medium">{weights.health.sleep}%</span>
                  </div>
                  <Slider
                    value={[weights.health.sleep]}
                    onValueChange={([v]) => handleWeightChange('health', 'sleep', v)}
                    max={100}
                    step={5}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Workout Frequency</Label>
                    <span className="text-sm font-medium">{weights.health.workout}%</span>
                  </div>
                  <Slider
                    value={[weights.health.workout]}
                    onValueChange={([v]) => handleWeightChange('health', 'workout', v)}
                    max={100}
                    step={5}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Mood Tracking</Label>
                    <span className="text-sm font-medium">{weights.health.mood}%</span>
                  </div>
                  <Slider
                    value={[weights.health.mood]}
                    onValueChange={([v]) => handleWeightChange('health', 'mood', v)}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Career */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📈</span>
                <h3 className="font-medium">Career</h3>
              </div>
              <div className="space-y-4 pl-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Study Time</Label>
                    <span className="text-sm font-medium">{weights.career.studyTime}%</span>
                  </div>
                  <Slider
                    value={[weights.career.studyTime]}
                    onValueChange={([v]) => handleWeightChange('career', 'studyTime', v)}
                    max={100}
                    step={5}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Project Work</Label>
                    <span className="text-sm font-medium">{weights.career.projectWork}%</span>
                  </div>
                  <Slider
                    value={[weights.career.projectWork]}
                    onValueChange={([v]) => handleWeightChange('career', 'projectWork', v)}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveWeights}>
              Save Weights
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Data Management</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Export or reset your logged data
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExportData}>
              Export Data (JSON)
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              Reset All Data
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
          <p>
            LifeOS is a personal analytics tool. Scores are relative to your 
            own patterns and are meant to surface trends, not judge performance.
          </p>
          <p className="text-xs">
            Your data is stored locally and never shared.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
