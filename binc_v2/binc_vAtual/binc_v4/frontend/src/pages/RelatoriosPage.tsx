import { useEffect, useState } from 'react'
import { BarChart2, TrendingUp, DollarSign, ShoppingBag, FileDown } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import api from '../api/client'
import { fmtCurrency } from '../lib/utils'

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16']

export default function RelatoriosPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const load = () => {
    setLoading(true)
    const params: any = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    api.get('/reports/summary', { params }).then(r => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const downloadPDF = () => {
    if (!data) return
    const periodoLabel = startDate && endDate
      ? `${startDate} até ${endDate}`
      : startDate ? `A partir de ${startDate}` : endDate ? `Até ${endDate}` : 'Todo o período'
    const now = new Date().toLocaleString('pt-BR')
    const topProds = (data.top_products || []).map((p: any, i: number) =>
      `<tr><td>${i+1}</td><td>${p.name}</td><td style="text-align:right">${p.qty}</td><td style="text-align:right">R$ ${p.revenue.toFixed(2)}</td></tr>`
    ).join('')
    const byPayStr = Object.entries(data.by_payment || {}).map(
      ([k,v]: any) => `<tr><td>${k}</td><td style="text-align:right">R$ ${v.toFixed(2)}</td></tr>`
    ).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Relatório Binc</title>
      <style>*{font-family:Arial,sans-serif;font-size:13px}h1{color:#f97316;font-size:20px}h2{font-size:14px;border-bottom:2px solid #f97316;padding-bottom:4px;margin-top:20px}
      table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#f97316;color:#fff;padding:6px 8px;text-align:left}
      td{padding:5px 8px;border-bottom:1px solid #eee}.kpi{display:inline-block;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 20px;margin:6px}
      .kpi span{display:block;font-size:11px;color:#9a3412}.kpi strong{font-size:18px;color:#f97316}</style></head>
      <body><h1>📊 Relatório Binc</h1>
      <p>Período: <strong>${periodoLabel}</strong> &mdash; Gerado em: ${now}</p>
      <div>
        <div class="kpi"><span>Receita Total</span><strong>R$ ${data.total_revenue.toFixed(2)}</strong></div>
        <div class="kpi"><span>Custo Total</span><strong>R$ ${data.total_cost.toFixed(2)}</strong></div>
        <div class="kpi"><span>Margem Bruta</span><strong>R$ ${data.gross_margin.toFixed(2)}</strong></div>
        <div class="kpi"><span>Vendas Concluídas</span><strong>${data.total_sales}</strong></div>
      </div>
      ${topProds ? `<h2>🏆 Produtos Mais Vendidos</h2><table><thead><tr><th>#</th><th>Produto</th><th style="text-align:right">Qtd</th><th style="text-align:right">Receita</th></tr></thead><tbody>${topProds}</tbody></table>` : ''}
      ${byPayStr ? `<h2>💳 Por Forma de Pagamento</h2><table><thead><tr><th>Forma</th><th style="text-align:right">Total</th></tr></thead><tbody>${byPayStr}</tbody></table>` : ''}
      </body></html>`
    const w = window.open('', '_blank')!
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); }, 400)
  }

  const byPaymentData = data ? Object.entries(data.by_payment).map(([k, v]) => ({ name: k, value: v as number })) : []
  const byCategoryData = data ? Object.entries(data.by_category).map(([k, v]) => ({ name: k, value: v as number })) : []

  return (
    <div className="animate-fade-in">
      <Header title="Relatórios" subtitle="Análise de desempenho e resultados financeiros" />
      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="card p-4 flex items-center gap-4">
          <span className="text-sm text-gray-500 font-medium">Período:</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input text-sm w-40" />
          <span className="text-gray-400">até</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input text-sm w-40" />
          <button onClick={load} className="btn-primary">Filtrar</button>
          <button onClick={() => { setStartDate(''); setEndDate(''); }} className="btn-secondary">Limpar</button>
          {data && (
            <button onClick={downloadPDF} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors ml-auto">
              <FileDown size={15} />Baixar PDF
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}</div>
        ) : data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Receita Total', value: fmtCurrency(data.total_revenue), icon: <DollarSign size={22} className="text-primary-500" />, bg: 'bg-primary-50' },
                { label: 'Custo Total', value: fmtCurrency(data.total_cost), icon: <ShoppingBag size={22} className="text-red-500" />, bg: 'bg-red-50' },
                { label: 'Margem Bruta', value: fmtCurrency(data.gross_margin), icon: <TrendingUp size={22} className="text-emerald-500" />, bg: 'bg-emerald-50' },
                { label: 'Vendas Conclusas', value: data.total_sales, icon: <BarChart2 size={22} className="text-blue-500" />, bg: 'bg-blue-50' },
              ].map((c) => (
                <div key={c.label} className="card p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By payment */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 mb-4">Por Forma de Pagamento</h3>
                {byPaymentData.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Sem dados</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={byPaymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {byPaymentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* By category */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 mb-4">Vendas por Categoria</h3>
                {byCategoryData.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">Sem dados</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={byCategoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => 'R$' + (v/1000).toFixed(0) + 'K'} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Products */}
            {data.top_products?.length > 0 && (
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">🏆 Produtos Mais Vendidos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      <th className="table-header">#</th>
                      <th className="table-header">Produto</th>
                      <th className="table-header text-right">Qtd Vendida</th>
                      <th className="table-header text-right">Receita</th>
                    </tr></thead>
                    <tbody>
                      {data.top_products.map((p: any, i: number) => (
                        <tr key={p.id} className="table-row">
                          <td className="table-cell font-bold text-gray-400">{i + 1}</td>
                          <td className="table-cell font-medium">{p.name}</td>
                          <td className="table-cell text-right text-gray-600">{p.qty}</td>
                          <td className="table-cell text-right font-semibold text-primary-600">{fmtCurrency(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
