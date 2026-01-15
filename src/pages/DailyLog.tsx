import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { PILLARS, DailyLog as DailyLogType } from '@/lib/data';
import { useLogs } from '@/context/LogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const createEmptyLog = (date: string): DailyLogType => ({
  date,
  finance: { incomeAdded: 0, moneySpent: 0, savingsAdded: 0 },
  career: { minutesStudied: 0, skillsPracticed: 0, projectWork: false },
  health: { sleepHours: 7, workoutDone: false, moodScale: 3 },
  spirituality: { prayerDone: false, reflectionMinutes: 0 },
  hobbies: { practiceMinutes: 0, techniquePracticed: false },
});

const DailyLog = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [openSections, setOpenSections] = useState<string[]>(PILLARS.map(p => p.id));
  const { addLog, getLogByDate } = useLogs();
  
  const [formData, setFormData] = useState<DailyLogType>(() => 
    getLogByDate(today) || createEmptyLog(today)
  );

  // Update form when date changes
  useEffect(() => {
    const existingLog = getLogByDate(selectedDate);
    if (existingLog) {
      setFormData(existingLog);
    } else {
      setFormData(createEmptyLog(selectedDate));
    }
  }, [selectedDate, getLogByDate]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    addLog({ ...formData, date: selectedDate });
    toast.success('Day logged successfully', {
      description: `Entry saved for ${new Date(selectedDate).toLocaleDateString()}`,
    });
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    suffix,
    min = 0,
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
    suffix?: string;
    min?: number;
  }) => {
    const [localValue, setLocalValue] = useState(value.toString());
    
    useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);
    
    const handleBlur = () => {
      const numValue = parseFloat(localValue) || 0;
      const finalValue = Math.max(min, numValue);
      onChange(finalValue);
      setLocalValue(finalValue.toString());
    };

    return (
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <div className="relative">
          <Input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBlur();
              }
            }}
            className="bg-background/50 pr-12"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  const ToggleField = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <Label className="text-sm text-muted-foreground cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Daily Log</h1>
          <p className="text-muted-foreground mt-1">
            Record today's inputs • Takes under 2 minutes
          </p>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <Label className="text-sm text-muted-foreground mb-2 block">Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-card w-48"
          />
        </div>

        {/* Pillar Sections */}
        <div className="space-y-3">
          {/* Finance */}
          <Collapsible 
            open={openSections.includes('finance')}
            onOpenChange={() => toggleSection('finance')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'glass-card rounded-xl p-4 flex items-center justify-between transition-all',
                openSections.includes('finance') && 'rounded-b-none border-b-0'
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <span className="font-medium">Finance</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openSections.includes('finance') ? '−' : '+'}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="glass-card rounded-b-xl p-4 pt-0 border-t-0 space-y-4">
                <InputField
                  label="Income Added"
                  value={formData.finance.incomeAdded}
                  onChange={(val) => setFormData({
                    ...formData,
                    finance: { ...formData.finance, incomeAdded: val }
                  })}
                  suffix="$"
                />
                <InputField
                  label="Money Spent"
                  value={formData.finance.moneySpent}
                  onChange={(val) => setFormData({
                    ...formData,
                    finance: { ...formData.finance, moneySpent: val }
                  })}
                  suffix="$"
                />
                <InputField
                  label="Savings Added"
                  value={formData.finance.savingsAdded}
                  onChange={(val) => setFormData({
                    ...formData,
                    finance: { ...formData.finance, savingsAdded: val }
                  })}
                  suffix="$"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Career */}
          <Collapsible 
            open={openSections.includes('career')}
            onOpenChange={() => toggleSection('career')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'glass-card rounded-xl p-4 flex items-center justify-between transition-all',
                openSections.includes('career') && 'rounded-b-none border-b-0'
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📈</span>
                  <span className="font-medium">Career</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openSections.includes('career') ? '−' : '+'}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="glass-card rounded-b-xl p-4 pt-0 border-t-0 space-y-4">
                <InputField
                  label="Minutes Studied"
                  value={formData.career.minutesStudied}
                  onChange={(val) => setFormData({
                    ...formData,
                    career: { ...formData.career, minutesStudied: val }
                  })}
                  suffix="min"
                />
                <InputField
                  label="Skills Practiced"
                  value={formData.career.skillsPracticed}
                  onChange={(val) => setFormData({
                    ...formData,
                    career: { ...formData.career, skillsPracticed: val }
                  })}
                  suffix="count"
                />
                <ToggleField
                  label="Project Work Done"
                  checked={formData.career.projectWork}
                  onChange={(val) => setFormData({
                    ...formData,
                    career: { ...formData.career, projectWork: val }
                  })}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Health */}
          <Collapsible 
            open={openSections.includes('health')}
            onOpenChange={() => toggleSection('health')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'glass-card rounded-xl p-4 flex items-center justify-between transition-all',
                openSections.includes('health') && 'rounded-b-none border-b-0'
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧘</span>
                  <span className="font-medium">Health</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openSections.includes('health') ? '−' : '+'}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="glass-card rounded-b-xl p-4 pt-0 border-t-0 space-y-4">
                <InputField
                  label="Sleep Hours"
                  value={formData.health.sleepHours}
                  onChange={(val) => setFormData({
                    ...formData,
                    health: { ...formData.health, sleepHours: val }
                  })}
                  suffix="hrs"
                />
                <ToggleField
                  label="Workout Done"
                  checked={formData.health.workoutDone}
                  onChange={(val) => setFormData({
                    ...formData,
                    health: { ...formData.health, workoutDone: val }
                  })}
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Mood Scale</Label>
                    <span className="text-sm font-medium">{formData.health.moodScale}/5</span>
                  </div>
                  <Slider
                    value={[formData.health.moodScale]}
                    onValueChange={([val]) => setFormData({
                      ...formData,
                      health: { ...formData.health, moodScale: val }
                    })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Spirituality */}
          <Collapsible 
            open={openSections.includes('spirituality')}
            onOpenChange={() => toggleSection('spirituality')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'glass-card rounded-xl p-4 flex items-center justify-between transition-all',
                openSections.includes('spirituality') && 'rounded-b-none border-b-0'
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <span className="font-medium">Spirituality</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openSections.includes('spirituality') ? '−' : '+'}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="glass-card rounded-b-xl p-4 pt-0 border-t-0 space-y-4">
                <ToggleField
                  label="Prayer / Meditation Done"
                  checked={formData.spirituality.prayerDone}
                  onChange={(val) => setFormData({
                    ...formData,
                    spirituality: { ...formData.spirituality, prayerDone: val }
                  })}
                />
                <InputField
                  label="Reflection Minutes"
                  value={formData.spirituality.reflectionMinutes}
                  onChange={(val) => setFormData({
                    ...formData,
                    spirituality: { ...formData.spirituality, reflectionMinutes: val }
                  })}
                  suffix="min"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Hobbies */}
          <Collapsible 
            open={openSections.includes('hobbies')}
            onOpenChange={() => toggleSection('hobbies')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'glass-card rounded-xl p-4 flex items-center justify-between transition-all',
                openSections.includes('hobbies') && 'rounded-b-none border-b-0'
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎨</span>
                  <span className="font-medium">Hobbies</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openSections.includes('hobbies') ? '−' : '+'}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="glass-card rounded-b-xl p-4 pt-0 border-t-0 space-y-4">
                <InputField
                  label="Practice Minutes"
                  value={formData.hobbies.practiceMinutes}
                  onChange={(val) => setFormData({
                    ...formData,
                    hobbies: { ...formData.hobbies, practiceMinutes: val }
                  })}
                  suffix="min"
                />
                <ToggleField
                  label="Technique Practiced"
                  checked={formData.hobbies.techniquePracticed}
                  onChange={(val) => setFormData({
                    ...formData,
                    hobbies: { ...formData.hobbies, techniquePracticed: val }
                  })}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} size="lg" className="px-8">
            Save Day
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DailyLog;
