export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="glass-card animate-pulse rounded-3xl p-5">
          <div className="mb-4 h-5 w-24 rounded-full bg-blue-50" />
          <div className="h-8 w-3/4 rounded-2xl bg-blue-50" />
          <div className="mt-4 h-4 w-full rounded-full bg-blue-50" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-blue-50" />
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 rounded-full bg-blue-50" />
            <div className="h-8 w-16 rounded-full bg-blue-50" />
          </div>
        </div>
      ))}
    </div>
  );
}