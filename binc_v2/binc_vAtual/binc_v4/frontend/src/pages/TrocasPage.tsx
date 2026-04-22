import { useEffect, useState } from 'react'
import { Plus, Search, RotateCcw, ChevronDown } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import api from '../api/client'
import { fmtDate, getStatusBadge, getStatusLabel } from '../lib/utils'
import toast from 'react-hot-toast'

const MOTIVOS = ['Avaria','Defeito','Arrependimento','Produto errado','Outro']

const emptyForm = { product_id: '', product_name: '', product_code: '', quantity: 1, motivo: 'Avaria', customer_name: '', unit_price: 0 }

export default function TrocasPage() {
  const [trocas, setTrocas] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [productQ, setProductQ] = useState('')
  const [productSugs, setProductSugs] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/trocas').then(r => setTrocas(r.data)).finally(() => setLoading(false))
  useEffect(() => { load(); api.get('/products').then(r => setProducts(r.data)) }, [])

  useEffect(() => {
    if (productQ.length < 2) { setProductSugs([]); return }
    const ql = productQ.toLowerCase()
    setProductSugs(products.filter(p => p.name.toLowerCase().includes(ql) || (p.code || '').toLowerCase().includes(ql)).slice(0, 6))
  }, [productQ, products])

  const selectProduct = (p: any) => {
    setForm(f => ({ ...f, product_id: p.id, product_name: p.name, product_code: p.code, unit_price: p.sale_price }))
    setProductQ(p.name); setProductSugs([])
  }

  const handleSave = async () => {
    if (!form.product_id) { toast.error('Selecione um produto'); return }
    setSaving(true)
    try {
      await api.post('/trocas', form)
      toast.success('Troca registrada!')
      setModalOpen(false); setForm(emptyForm); setProductQ('')
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setSaving(false) }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/trocas/${id}`, { status })
      load()
    } catch { toast.error('Erro ao atualizar') }
  }

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="animate-fade-in">
      <Header title="Trocas & Devoluções" subtitle="Gerencie trocas e devoluções de produtos" />
      <div className="p-8 space-y-5">
        <div className="flex justify-end">
          <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} />Nova Troca</button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Data</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Produto</th>
                  <th className="table-header">Qtd</th>
                  <th className="table-header">Motivo</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Ação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-12">Carregando...</td></tr>
                ) : trocas.length === 0 ? (
                  <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-12">
                    <RotateCcw size={32} className="mx-auto mb-2 text-gray-200" />Nenhuma troca registrada
                  </td></tr>
                ) : trocas.map(t => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell text-xs text-gray-500">{fmtDate(t.date, false)}</td>
                    <td className="table-cell font-medium">{t.customer_name || '—'}</td>
                    <td className="table-cell text-gray-700">{t.product_name}</td>
                    <td className="table-cell">{t.quantity}</td>
                    <td className="table-cell"><span className="badge badge-yellow">{t.motivo}</span></td>
                    <td className="table-cell"><span className={getStatusBadge(t.status)}>{getStatusLabel(t.status)}</span></td>
                    <td className="table-cell">
                      <select value={t.status} onChange={e => handleStatusChange(t.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400">
                        <option value="pendente">Pendente</option>
                        <option value="devolvido_estoque">Devolvido ao Estoque</option>
                        <option value="descartado">Descartado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setForm(emptyForm); setProductQ('') }}
        title="Nova Troca / Devolução"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Registrar'}</button>
          </>
        }>
        <div className="space-y-4">
          <div>
            <label className="label">Produto *</label>
            <div className="relative">
              <input value={productQ} onChange={e => setProductQ(e.target.value)} placeholder="Buscar produto..." className="input" />
              {productSugs.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {productSugs.map(p => (
                    <button key={p.id} onClick={() => selectProduct(p)} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm">
                      <span className="font-medium">{p.name}</span> <span className="text-gray-400 text-xs">· {p.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantidade</label>
              <input type="number" min="1" value={form.quantity} onChange={e => F('quantity', parseInt(e.target.value) || 1)} className="input" />
            </div>
            <div>
              <label className="label">Motivo</label>
              <select value={form.motivo} onChange={e => F('motivo', e.target.value)} className="select">
                {MOTIVOS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Nome do Cliente</label>
            <input value={form.customer_name} onChange={e => F('customer_name', e.target.value)} className="input" placeholder="Nome (opcional)" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
