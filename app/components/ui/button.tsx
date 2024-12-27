import React from 'react'

interface ButtonProps {
  value: string;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  width?: string;
  onClick?: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button 
      disabled={props.disabled}
      type={props.type}
      onClick={props.onClick}
      className={`bg-primary text-white px-4 py-2 rounded-md w-full my-1 ${props.width} ${props.disabled && 'opacity-50'}`}>
        {props.loading ? (
          <span className="loading loading-dots loading-xs"></span>
        ) :
          props.value
        }
    </button>
  )
}
