import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  showCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  placeholder = '',
  value,
  error,
  helperText,
  required = false,
  rows = 3,
  maxLength,
  showCount = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className="text-[10px] text-slate-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`w-full bg-white dark:bg-slate-900 border rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 resize-y ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20 hover:border-slate-400 dark:hover:border-slate-600'
        } ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export default TextArea;
