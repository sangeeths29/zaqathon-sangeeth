import React from 'react';
export function Textarea({ className = '', ...props }: any) {
  return <textarea className={`rounded border border-gray-300 p-2 w-full ${className}`} {...props} />;
} 