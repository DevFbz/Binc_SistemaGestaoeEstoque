import { useEffect, useState } from 'react'
import { Search, XCircle, Eye, Edit3, Trash2 } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import api from '../api/client'
import { fmtCurrency, fmtDate, getStatusBadge, getStatusLabel } from '../lib/utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/auth'

const PAYMENTS = ['Dinheiro','Cartao de Credito','Cartao de Debito','PIX','Boleto','Fiado / A Prazo']

export default function HistoricoPage() {
  const { user } = useAuthStore()
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [detailSale, setDetailSale] = useState<any>(null)
  const [editSale, setEditSale] = useState<any>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [editSaving, setEditSaving] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmCancelItem, setConfirmCancelItem] = useState<{ saleId: string; idx: number; maxQty: number; name: string } | null>(null)
  const [cancelQtyStr, setCancelQtyStr] = useState<string>('1')

  const load = async () => {
    setLoading(true)
    const params: any = {}
    if (q) params.q = q
    if (status) params.status = status
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    const res = await api.get('/sales', { params })
    setSales(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [q, status, startDate, endDate])

  const openEdit = (s: any) => {
    setEditSale(s)
    setEditForm({ payment_method: s.payment_method, observations: s.observations || '', customer_name: s.customer_name || '' })
  }

  const handleSaveEdit = async () => {
    if (!editSale) return
    setEditSaving(true)
    try {
      await api.put(`/sales/${editSale.id}`, editForm)
      toast.success('Venda atualizada!')
      setEditSale(null)
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setEditSaving(false) }
  }

  const handleCancelItem = async () => {
    if (!confirmCancelItem) return
    const qty = Math.min(confirmCancelItem.maxQty, Math.max(1, parseInt(cancelQtyStr) || 1))
    try {
      const res = await api.post(`/sales/${confirmCancelItem.saleId}/cancel-item/${confirmCancelItem.idx}`, { send_to_trocas: true, quantity: qty })
      toast.success(res.data.message || 'Item cancelado e enviado para Trocas!')
      if (editSale && editSale.id === confirmCancelItem.saleId) {
        setEditSale(res.data.sale)
      }
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setConfirmCancelItem(null) }
  }

  const handleCancel = async () => {
    if (!confirmCancel) return
    try {
      await api.post(`/sales/${confirmCancel}/cancel`)
      toast.success('Venda cancelada!')
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setConfirmCancel(null) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.delete(`/sales/${confirmDelete}`)
      toast.success('Venda excluída!')
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setConfirmDelete(null) }
  }

  return (
    <div className="animate-fade-in">
      <Header title="Histórico de Vendas" subtitle="Consulte e gerencie todas as vendas" />
      <div className="p-8 space-y-5">
        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por cliente ou produto..." className="input pl-9 text-sm" />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="select text-sm w-44">
              <option value="">Todos os status</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input text-sm w-40" />
            <span className="text-gray-400 text-sm">até</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input text-sm w-40" />
            {(q || status || startDate || endDate) && (
              <button onClick={() => { setQ(''); setStatus(''); setStartDate(''); setEndDate('') }} className="btn-ghost text-xs">
                <XCircle size={14} />Limpar
              </button>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Data/Hora</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Pagamento</th>
                  <th className="table-header">Itens</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td></tr>
                  ))
                ) : sales.length === 0 ? (
                  <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-12">Nenhuma venda encontrada</td></tr>
                ) : sales.map(s => {
                  const activeItems = s.items?.filter((it: any) => !it.cancelled)?.length ?? s.items?.length ?? 0
                  return (
                    <tr key={s.id} className={`table-row ${s.status === 'cancelada' ? 'opacity-60' : ''}`}>
                      <td className="table-cell text-gray-500 text-xs">{fmtDate(s.date)}</td>
                      <td className="table-cell font-medium">{s.customer_name || 'Consumidor Final'}</td>
                      <td className="table-cell text-gray-500 text-xs">{s.payment_method}</td>
                      <td className="table-cell text-gray-500">{activeItems}</td>
                      <td className="table-cell font-semibold">{fmtCurrency(s.total)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={getStatusBadge(s.status)}>{getStatusLabel(s.status)}</span>
                          {s.last_edited && s.status !== 'cancelada' && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">Editada</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailSale(s)} className="btn-ghost py-1 px-2 text-xs" title="Ver detalhes"><Eye size={14} /></button>
                          {s.status !== 'cancelada' && (
                            <>
                              <button onClick={() => openEdit(s)} className="btn-ghost py-1 px-2 text-xs text-blue-500 hover:bg-blue-50" title="Editar venda">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => setConfirmCancel(s.id)} className="btn-ghost py-1 px-2 text-xs text-amber-600 hover:bg-amber-50" title="Cancelar venda">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {user?.role === 'admin' && (
                            <button onClick={() => setConfirmDelete(s.id)} className="btn-ghost py-1 px-2 text-xs text-red-500 hover:bg-red-50" title="Excluir">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {!loading && <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            {sales.length} venda(s) · Total: {fmtCurrency(sales.filter(s => s.status !== 'cancelada').reduce((s, v) => s + v.total, 0))}
          </div>}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!detailSale} onClose={() => setDetailSale(null)} title={`Venda — ${fmtDate(detailSale?.date)}`} size="lg">
        {detailSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Cliente', val: detailSale.customer_name || 'Consumidor Final' },
                { label: 'Pagamento', val: detailSale.payment_method },
                { label: 'Operador', val: detailSale.operator || '—' },
                { label: 'Status', val: <span className={getStatusBadge(detailSale.status)}>{getStatusLabel(detailSale.status)}</span> },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="font-medium">{val}</p>
                </div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead><tr>
                <th className="table-header">Produto</th>
                <th className="table-header text-right">Qtd</th>
                <th className="table-header text-right">Unit.</th>
                <th className="table-header text-right">Total</th>
              </tr></thead>
              <tbody>
                {detailSale.items?.map((it: any, i: number) => (
                  <tr key={i} className={`border-b border-gray-50 ${it.cancelled ? 'opacity-40 line-through' : ''}`}>
                    <td className="py-2 px-4">{it.name}{it.cancelled && <span className="ml-2 text-xs text-red-500 no-underline">[Cancelado→Trocas]</span>}</td>
                    <td className="py-2 px-4 text-right text-gray-500">{it.quantity} {it.unit}</td>
                    <td className="py-2 px-4 text-right text-gray-500">{fmtCurrency(it.unit_price)}</td>
                    <td className="py-2 px-4 text-right font-medium">{fmtCurrency(it.quantity * it.unit_price * (1 - (it.discount || 0)/100))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              {detailSale.discount_value > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Desconto</span><span>-{fmtCurrency(detailSale.discount_value)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary-600">{fmtCurrency(detailSale.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editSale} onClose={() => setEditSale(null)} title="Editar Venda" size="lg"
        footer={
          <>
            <button onClick={() => setEditSale(null)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSaveEdit} disabled={editSaving} className="btn-primary">{editSaving ? 'Salvando...' : 'Salvar Alterações'}</button>
          </>
        }>
        {editSale && (
          <div className="space-y-5">
            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Editar venda de <strong>{fmtDate(editSale.date)}</strong></p>
              <p className="text-xs">Você pode alterar o pagamento, observações e cancelar itens específicos.</p>
            </div>

            {/* Edit fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Forma de Pagamento</label>
                <select value={editForm.payment_method} onChange={e => setEditForm((f: any) => ({ ...f, payment_method: e.target.value }))} className="select text-sm">
                  {PAYMENTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Cliente</label>
                <input value={editForm.customer_name} onChange={e => setEditForm((f: any) => ({ ...f, customer_name: e.target.value }))} className="input text-sm" />
              </div>
              <div className="col-span-2">
                <label className="label">Observações</label>
                <textarea value={editForm.observations} onChange={e => setEditForm((f: any) => ({ ...f, observations: e.target.value }))} className="input resize-none h-16 text-sm" />
              </div>
            </div>

            {/* Items list with cancel per-item */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Itens da Venda</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {editSale.items?.map((it: any, idx: number) => (
                  <div key={idx} className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${it.cancelled ? 'bg-red-50 opacity-60' : 'hover:bg-gray-50'}`}>
                    <div>
                      <p className={`font-medium text-sm ${it.cancelled ? 'line-through text-gray-400' : 'text-gray-800'}`}>{it.name}</p>
                      <p className="text-xs text-gray-400">{it.quantity} {it.unit} × {fmtCurrency(it.unit_price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{fmtCurrency(it.quantity * it.unit_price * (1 - (it.discount || 0)/100))}</span>
                      {it.cancelled ? (
                        <span className="text-xs badge badge-red">Cancelado→Trocas</span>
                      ) : editSale.status !== 'cancelada' ? (
                        <button
                          onClick={() => {
                            setConfirmCancelItem({ saleId: editSale.id, idx, maxQty: it.quantity, name: it.name })
                            setCancelQtyStr('1')
                          }}
                          className="text-xs px-3 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                        >
                          Cancelar item → Trocas
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 bg-gray-50 rounded-xl px-4 py-3 flex justify-between">
                <span className="font-semibold text-gray-700">Novo Total:</span>
                <span className="font-bold text-primary-600 text-lg">{fmtCurrency(editSale.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmCancel} title="Cancelar Venda" message="A venda será cancelada e o estoque será restituído."
        confirmText="Cancelar Venda" danger onConfirm={handleCancel} onCancel={() => setConfirmCancel(null)} />
      <ConfirmDialog open={!!confirmDelete} title="Excluir Venda" message="Esta venda será removida permanentemente." confirmText="Excluir" danger onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />

      {/* ─── Cancelar Item — Popup simples centralizado ─── */}
      {confirmCancelItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => setConfirmCancelItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 text-base">⚠️</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base">Cancelar Item</h3>
              </div>
              <button
                onClick={() => setConfirmCancelItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-700">
                Cancelando o item: <strong className="text-gray-900">{confirmCancelItem.name}</strong>
              </p>

              {confirmCancelItem.maxQty > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Quantidade a cancelar
                    <span className="ml-1 font-normal text-gray-400">(máximo: {confirmCancelItem.maxQty})</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={confirmCancelItem.maxQty}
                    value={cancelQtyStr}
                    onChange={e => setCancelQtyStr(e.target.value)}
                    onBlur={e => {
                      const v = parseInt(e.target.value)
                      if (isNaN(v) || v < 1) setCancelQtyStr('1')
                      else if (v > confirmCancelItem.maxQty) setCancelQtyStr(String(confirmCancelItem.maxQty))
                      else setCancelQtyStr(String(v))
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    autoFocus
                  />
                </div>
              )}

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                O estoque será restituído, o item enviado para <strong>Trocas & Devoluções</strong> e o valor da venda recalculado.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmCancelItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelItem}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
