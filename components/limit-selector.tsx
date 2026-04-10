// Componente Client: LimitSelector.tsx
"use client"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LimitSelector({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

 const handleLimitChange = (value: string | null) => {
  if (!value) return; // Si es null, no hacemos nada

  const params = new URLSearchParams(searchParams);
  params.set('limit', value);
  params.set('page', '1');
  router.push(`${pathname}?${params.toString()}`);
};

  return (
    <Select onValueChange={handleLimitChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 registros</SelectItem>
        <SelectItem value="10">10 registros</SelectItem>
      </SelectContent>
    </Select>
  );
}