import { useEffect, useState, useCallback } from 'react'
import {
  TrendingUp, TrendingDown, ShoppingCart, Package,
  Users, RotateCcw, AlertTriangle, CheckCircle, XCircle, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import Header from '../components/Header'
import api from '../api/client'
import { fmtCurrency, fmtCurrencyShort, fmtDate, getStatusBadge, getStatusLabel } from '../lib/utils'
import { useAuthStore } from '../store/auth'

interface DashData {
  today_sales: number
  month_sales: number
  chart_data: { date: string; total: number }[]
  status_concluida: number
  status_cancelada: number
  low_stock_alerts: number
  pending_returns: number
  recent_sales: any[]
  total_products: number
  total_customers: number
}

function StatCard({ title, value, subtitle, icon, color, trend }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
        <p className="text-xs text-gray-500 mb-1">Dia {label}</p>
        <p className="text-sm font-bold text-primary-600">{fmtCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      const r = await api.get('/dashboard')
      setData(r.data)
      setLastRefresh(new Date())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => { load(false) }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => load(true), 30000)
    return () => clearInterval(interval)
  }, [load])

  // Refresh when tab/window regains focus
  useEffect(() => {
    const handleFocus = () => load(true)
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [load])



  const chartData = data?.chart_data.map(d => ({
    day: d.date.split('-')[2],
    total: d.total,
    date: d.date,
  })) ?? []

  if (loading) {
    return (
      <div>
        <Header title={`Bem-vindo, ${user?.name?.split(' ')[0] ?? ''}`} subtitle="Confira o resumo das suas finanças" />
        <div className="p-8 grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <Header
        title={`Bem-vindo, ${user?.name?.split(' ')[0] ?? ''}`}
        subtitle="Confira o resumo das suas finanças"
      />

      <div className="p-8 space-y-6">
        {/* Refresh bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Atualizado em {lastRefresh.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <button onClick={() => load(false)} disabled={refreshing}
            className={`btn-ghost text-xs flex items-center gap-1.5 ${refreshing ? 'opacity-50' : ''}`}>
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Atualizando...' : 'Atualizar agora'}
          </button>
        </div>

        {/* Hero Card */}

        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-500/20">
          {/* decorative circles */}
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -right-4 -bottom-12 w-36 h-36 bg-white/10 rounded-full" />
          <div className="relative">
            <p className="text-primary-100 text-sm font-medium">Saldo do Mês</p>
            <h2 className="text-5xl font-bold mt-2 tracking-tight">
              {fmtCurrency(data?.month_sales ?? 0)}
            </h2>
            <div className="flex items-center gap-8 mt-5">
              <div>
                <p className="text-primary-200 text-xs font-medium">Hoje</p>
                <p className="text-2xl font-bold mt-0.5">+{fmtCurrencyShort(data?.today_sales ?? 0)}</p>
              </div>
              <div className="w-px h-10 bg-primary-400" />
              <div>
                <p className="text-primary-200 text-xs font-medium">Produtos</p>
                <p className="text-2xl font-bold mt-0.5">{data?.total_products ?? 0}</p>
              </div>
              <div className="w-px h-10 bg-primary-400" />
              <div>
                <p className="text-primary-200 text-xs font-medium">Clientes</p>
                <p className="text-2xl font-bold mt-0.5">{data?.total_customers ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Vendas Concluídas"
            value={data?.status_concluida ?? 0}
            subtitle="Total histórico"
            icon={<CheckCircle size={20} className="text-emerald-600" />}
            color="bg-emerald-50"
          />
          <StatCard
            title="Vendas Canceladas"
            value={data?.status_cancelada ?? 0}
            subtitle="Total histórico"
            icon={<XCircle size={20} className="text-red-500" />}
            color="bg-red-50"
          />
          <StatCard
            title="Alertas de Estoque"
            value={data?.low_stock_alerts ?? 0}
            subtitle="Produtos abaixo do mín."
            icon={<AlertTriangle size={20} className="text-amber-500" />}
            color="bg-amber-50"
          />
          <StatCard
            title="Trocas Pendentes"
            value={data?.pending_returns ?? 0}
            subtitle="Aguardando resolução"
            icon={<RotateCcw size={20} className="text-blue-500" />}
            color="bg-blue-50"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area chart */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-5">Vendas — Últimos 30 Dias</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => 'R$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v)}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#colorSales)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#f97316' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status summary */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-5">Resumo Operacional</h3>
            <div className="space-y-4">
              {[
                { label: 'Vendas Concluídas', value: data?.status_concluida ?? 0, color: 'text-emerald-600' },
                { label: 'Vendas Canceladas', value: data?.status_cancelada ?? 0, color: 'text-red-500' },
                { label: 'Alertas de Estoque', value: data?.low_stock_alerts ?? 0, color: 'text-amber-500' },
                { label: 'Trocas Pendentes', value: data?.pending_returns ?? 0, color: 'text-blue-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-800">Transações Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Data/Hora</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Itens</th>
                  <th className="table-header">Valor</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table-cell text-center text-gray-400 py-8">
                      Nenhuma transação ainda
                    </td>
                  </tr>
                ) : (
                  data?.recent_sales.map((sale: any) => (
                    <tr key={sale.id} className="table-row">
                      <td className="table-cell text-gray-500">{fmtDate(sale.date)}</td>
                      <td className="table-cell font-medium">{sale.customer_name || 'Consumidor Final'}</td>
                      <td className="table-cell text-gray-500">
                        {(sale.items?.filter((it: any) => !it.cancelled).length ?? 0)} prod.
                        {sale.items?.some((it: any) => it.cancelled) && (
                          <span className="ml-1 text-xs text-amber-500">(c/ cancelados)</span>
                        )}
                      </td>
                      <td className="table-cell font-semibold">{fmtCurrency(sale.total)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={getStatusBadge(sale.status)}>
                            {getStatusLabel(sale.status)}
                          </span>
                          {sale.last_edited && sale.status !== 'cancelada' && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">Editada</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
