import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-[0.99] gap-2";

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-700/20",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700",
  outline: "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
  danger: "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700/20",
  ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-none"
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2"
};

const spinnerSizes = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5"
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  isLoading = false,
  loadingText,
  disabled,
  iconLeft,
  iconRight,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className={`btn-spinner ${isLoading ? 'inline-block' : 'hidden'}`}>
        <svg className={`animate-spin ${spinnerSizes[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      <span className={`btn-content inline-flex items-center justify-center gap-2 ${isLoading ? 'hidden' : ''}`}>
        {iconLeft && <span className="btn-icon-left inline-flex items-center">{iconLeft}</span>}
        <span className="btn-text">{children}</span>
        {iconRight && <span className="btn-icon-right inline-flex items-center">{iconRight}</span>}
      </span>
      {/* {isLoading && (
        <span className="btn-loading-text">{loadingText || 'Memproses...'}</span>
      )} */}
    </button>
  );
};

export default Button;
