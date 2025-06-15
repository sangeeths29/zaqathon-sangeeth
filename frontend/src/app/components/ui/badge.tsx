import React from 'react';
export function Badge({ children, className = '', variant = 'default', ...props }: any) {
  let variants: any = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-blue-400 text-blue-700',
    secondary: 'bg-gray-100 text-gray-700',
    destructive: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${variants[variant] || ''} ${className}`} {...props}>{children}</span>;
} 