import type { PropsWithChildren } from 'react';

export function SectionCard({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`glass-card rounded-3xl p-5 md:p-6 ${className}`}>{children}</section>;
}