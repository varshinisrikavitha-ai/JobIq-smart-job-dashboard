import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function EmptyState({ title, description, actionLabel, actionTo }: { title: string; description: string; actionLabel: string; actionTo: string }) {
  return (
    <div className="auth-panel rounded-3xl p-8 text-center">
      <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      <Link to={actionTo} className="mt-6 inline-block">
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}