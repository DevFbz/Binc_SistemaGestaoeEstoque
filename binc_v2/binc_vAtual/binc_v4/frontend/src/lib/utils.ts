// Format currency BRL
export function fmtCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

// Format currency short (1.8M, 12.5K — abrevia só acima de R$ 10.000)
export function fmtCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 10_000) return `R$ ${(value / 1_000).toFixed(1)}K`
  return fmtCurrency(value)
}

// Format date ISO -> DD/MM/YYYY HH:MM
export function fmtDate(iso: string, showTime = true): string {
  if (!iso) return '--'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    if (!showTime) return `${dd}/${mm}/${yyyy}`
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`
  } catch {
    return iso
  }
}

// Format date for input[type=date]
export function toInputDate(iso: string): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

// Get status badge class
export function getStatusBadge(status: string): string {
  switch (status) {
    case 'concluida': return 'badge-green'
    case 'cancelada': return 'badge-red'
    case 'devolvida': return 'badge-blue'
    case 'pendente': return 'badge-yellow'
    case 'devolvido_estoque': return 'badge-blue'
    case 'descartado': return 'badge-red'
    default: return 'badge-gray'
  }
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    concluida: 'Concluída',
    cancelada: 'Cancelada',
    devolvida: 'Devolvida',
    pendente: 'Pendente',
    devolvido_estoque: 'Devolvido p/ Estoque',
    descartado: 'Descartado',
  }
  return map[status] ?? status
}

// Role label
export function getRoleLabel(role: string): string {
  return role === 'admin' ? 'Administrador' : 'Operador'
}

// Initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
