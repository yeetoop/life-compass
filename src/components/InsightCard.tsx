import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  pillar?: string;
}

export const InsightCard = ({ title, description, type, pillar }: InsightCardProps) => {
  const borderColor = type === 'positive' 
    ? 'border-l-pillar-finance' 
    : type === 'negative' 
    ? 'border-l-pillar-health' 
    : 'border-l-muted-foreground';

  return (
    <div className={cn(
      'glass-card rounded-lg p-4 border-l-4',
      borderColor
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-medium text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        {pillar && (
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
            {pillar}
          </span>
        )}
      </div>
    </div>
  );
};
