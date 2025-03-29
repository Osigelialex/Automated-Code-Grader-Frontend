import React from 'react'

interface ButtonProps {
  value: string;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  width?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  value, 
  type = 'button', 
  disabled = false, 
  loading = false, 
  width = 'w-full', 
  onClick,
  variant = 'primary',
  size = 'md',
  className = ''
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-secondary text-white hover:bg-secondary-700 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    ghost: 'text-primary bg-transparent hover:bg-primary/10 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      className={`
        relative 
        inline-flex 
        items-center 
        justify-center 
        rounded-md 
        font-medium 
        transition-all 
        duration-200 
        ease-in-out 
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${width}
        ${disabled || loading ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}
        ${className}
        outline-none
        shadow-sm
        hover:shadow-md
        focus:outline-none
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin h-5 w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <span className="flex items-center justify-center">
          {value}
        </span>
      )}
    </button>
  )
}