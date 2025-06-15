export function Card({ children, className = "", ...props }: any) {
  return <div className={`bg-white rounded-xl shadow p-4 ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = "", ...props }: any) {
  return <div className={`p-2 ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className = "", ...props }: any) {
  return <div className={`mb-2 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = "", ...props }: any) {
  return <h2 className={`text-lg font-bold ${className}`} {...props}>{children}</h2>;
} 