import React from 'react'

interface ButtonProps {
  value: string;
  type: 'button' | 'submit' | 'reset';
  onClick: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button type={props.type} onClick={props.onClick} className='bg-primary text-white px-4 py-2 rounded-md w-full my-1'>
      {props.value}
    </button>
  )
}
