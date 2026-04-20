export function ErrorState({ message }: { message: string }) {
  return (
    <div className="auth-panel rounded-3xl p-6 text-slate-700">
      <p className="text-lg font-semibold text-slate-900">Unable to load jobs</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    </div>
  );
}