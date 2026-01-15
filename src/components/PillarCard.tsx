import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PillarConfig, PillarScore } from '@/lib/data';

interface PillarCardProps {
  pillar: PillarConfig;
  score: PillarScore;
}

export const PillarCard = ({ pillar, score }: PillarCardProps) => {
  const trendIcon = score.trend === 'up' ? '↑' : score.trend === 'down' ? '↓' : '→';
  const trendColor = score.trend === 'up' 
    ? 'text-pillar-finance' 
    : score.trend === 'down' 
    ? 'text-pillar-health' 
    : 'text-muted-foreground';

  return (
    <Link 
      to={`/pillar/${pillar.id}`}
      className="group block"
    >
      <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{pillar.icon}</span>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {pillar.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pillar.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className={cn('text-3xl font-bold', pillar.colorClass)}>
              {score.score}
            </span>
            <span className="text-muted-foreground text-sm ml-1">/100</span>
          </div>
          
          <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
            <span>{trendIcon}</span>
            <span>{Math.abs(score.change)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn('h-full rounded-full transition-all duration-500', pillar.bgColorClass)}
            style={{ width: `${score.score}%`, opacity: 0.7 }}
          />
        </div>
      </div>
    </Link>
  );
};
