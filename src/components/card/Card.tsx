import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
  className?: string;
  children: React.ReactNode;
}

const variants = {
  slate: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
  indigo: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40",
  emerald: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40",
  amber: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40",
  rose: "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40"
};

export const Card: React.FC<CardProps> = ({
  variant = 'slate',
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`rounded-lg border p-5 shadow-xs transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
