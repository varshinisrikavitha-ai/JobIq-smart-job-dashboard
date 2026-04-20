import { scoreLabel, scoreTone } from '../../utils/scoring';

export function ScoreBadge({ score }: { score: number }) {
  const tone = scoreTone(score);

  const toneStyles = {
    green: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/20',
    yellow: 'bg-amber-400/15 text-amber-200 ring-amber-300/20',
    red: 'bg-rose-400/15 text-rose-200 ring-rose-300/20',
  }[tone];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneStyles}`}>
      <span>{score}% match</span>
      <span className="opacity-80">•</span>
      <span>{scoreLabel(score)}</span>
    </div>
  );
}