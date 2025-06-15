import React from 'react';
export function Button({ children, className = '', variant = 'default', size = 'md', ...props }: any) {
  let base = 'rounded px-4 py-2 font-semibold focus:outline-none transition';
  let variants: any = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  let sizes: any = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base',
    lg: 'text-lg py-3 px-6',
  };
  return (
    <button className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`} {...props}>
      {children}
    </button>
  );
} 