import React, { createContext, useContext, useState } from 'react';
const TabsContext = createContext<any>(null);
export function Tabs({ defaultValue, children, className = '' }: any) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}
export function TabsList({ children, className = '' }: any) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}
export function TabsTrigger({ value, children, className = '' }: any) {
  const { value: active, setValue } = useContext(TabsContext);
  return (
    <button
      className={`px-4 py-2 rounded font-semibold ${active === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} ${className}`}
      onClick={() => setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className = '' }: any) {
  const { value: active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
} 