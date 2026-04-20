import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
}

export function Button({ children, className = '', variant = 'primary', ...props }: PropsWithChildren<ButtonProps>) {
  const variants = {
    primary:
      'bg-blue-600 text-slate-50 shadow-[0_8px_18px_rgba(37,99,235,0.18)] hover:bg-blue-500',
    ghost: 'border border-blue-100 bg-white text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800',
    outline: 'border border-blue-100 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800',
  } as const;

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}