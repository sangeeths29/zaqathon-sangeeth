export function toast({ title, description, variant }: { title: string; description?: string; variant?: string }) {
  console.log(`[${variant || 'info'}] ${title}: ${description || ''}`);
  if (variant === 'destructive') {
    alert(`${title}\n${description || ''}`);
  }
} 