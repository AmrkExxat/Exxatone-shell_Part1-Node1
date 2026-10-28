import { AlertTriangle, CircleX, FileText, Users } from 'lucide-react';
import { schedulesNeedsAttentionMetrics } from '../../config/schedules';
import { schedulesChrome } from './schedulesTypography';

const METRIC_ICONS = {
  toBeScheduled: Users,
  notCompliant: FileText,
  canceled: CircleX,
} as const;

export function SchedulesNeedsAttentionStrip() {
  return (
    <section className={schedulesChrome.needsAttentionPanel} aria-label="Needs attention summary">
      <div className={schedulesChrome.needsAttentionHeader}>
        <AlertTriangle className="size-3.5 shrink-0 text-[#ea580c]" strokeWidth={2} aria-hidden />
        <span>Needs Attention</span>
      </div>
      <div className={schedulesChrome.needsAttentionMetrics}>
        {schedulesNeedsAttentionMetrics.map((metric) => {
          const Icon = METRIC_ICONS[metric.id];
          return (
            <div key={metric.id} className={schedulesChrome.needsAttentionMetric}>
              <div className={`${schedulesChrome.needsAttentionIconWrap} ${metric.iconWrapClass}`}>
                <Icon className={`size-4 ${metric.iconClass}`} strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className={schedulesChrome.needsAttentionMetricTitle}>
                  <span className="font-semibold text-[#212121]">{metric.count}</span> {metric.label}
                </p>
                <button type="button" className={schedulesChrome.needsAttentionViewLink}>
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
