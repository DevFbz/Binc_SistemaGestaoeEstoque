import { useEffect, useState } from 'react'
import { Warehouse, AlertTriangle, Plus, RefreshCw, Edit3, Trash2, PackagePlus, XCircle, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import api from '../api/client'
import { fmtCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = ['Filtros','Freios','Oleos','Motor','Eletrica','Suspensao','Arrefecimento','Transmissao','Carroceria','Acessorios','Outros']
const UNITS = ['UN','JG','LT','KG','MT','CX','PC','FR','KIT','PAR']

// ─── Aba Inventário ────────────────────────────────────────────────────────────
function InventarioTab() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adjustModal, setAdjustModal] = useState<any>(null)
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustSaving, setSaving] = useState(false)

  const load = () => api.get('/products').then(r => setProducts(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const lowStock = products.filter(p => p.stock <= p.min_stock)
  const okStock = products.filter(p => p.stock > p.min_stock)

  const handleAdjust = async () => {
    if (!adjustModal) return
    setSaving(true)
    try {
      await api.patch(`/products/${adjustModal.id}/stock`, { quantity: adjustQty })
      toast.success(`Estoque ajustado! Novo total: ${adjustModal.stock + adjustQty} ${adjustModal.unit}`)
      setAdjustModal(null); load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-amber-500" />
            <h3 className="font-semibold text-amber-800">{lowStock.length} produto(s) com estoque abaixo do mínimo</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                {p.name}: {p.stock}/{p.min_stock}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center"><Warehouse size={24} className="text-primary-500" /></div>
          <div><p className="text-2xl font-bold">{products.length}</p><p className="text-sm text-gray-500">Total de produtos</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center"><AlertTriangle size={24} className="text-red-500" /></div>
          <div><p className="text-2xl font-bold text-red-600">{lowStock.length}</p><p className="text-sm text-gray-500">Estoque baixo</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center"><RefreshCw size={24} className="text-emerald-500" /></div>
          <div><p className="text-2xl font-bold text-emerald-600">{okStock.length}</p><p className="text-sm text-gray-500">Estoque regular</p></div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Inventário Completo</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Produto</th>
                <th className="table-header">Categoria</th>
                <th className="table-header">Estoque</th>
                <th className="table-header">Mínimo</th>
                <th className="table-header">Situação</th>
                <th className="table-header">Valor em Estoque</th>
                <th className="table-header">Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-cell py-12 text-center text-gray-400">Carregando...</td></tr>
              ) : products.map(p => {
                const low = p.stock <= p.min_stock
                return (
                  <tr key={p.id} className={`table-row ${low ? 'bg-red-50/30' : ''}`}>
                    <td className="table-cell font-medium">{p.name}<span className="ml-2 text-xs text-gray-400 font-mono">{p.code}</span></td>
                    <td className="table-cell"><span className="badge badge-gray">{p.category}</span></td>
                    <td className="table-cell"><span className={`font-bold ${low ? 'text-red-600' : 'text-gray-900'}`}>{p.stock} {p.unit}</span></td>
                    <td className="table-cell text-gray-500">{p.min_stock}</td>
                    <td className="table-cell">{low ? <span className="badge badge-red">⚠ Baixo</span> : <span className="badge badge-green">✓ Regular</span>}</td>
                    <td className="table-cell font-medium text-gray-700">{fmtCurrency(p.stock * p.cost_price)}</td>
                    <td className="table-cell">
                      <button onClick={() => { setAdjustModal(p); setAdjustQty(0) }} className="btn-ghost text-xs py-1 px-3">Ajustar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!adjustModal} onClose={() => setAdjustModal(null)} title={`Ajustar Estoque — ${adjustModal?.name}`}
        footer={<><button onClick={() => setAdjustModal(null)} className="btn-secondary">Cancelar</button>
          <button onClick={handleAdjust} disabled={adjustSaving || adjustQty === 0} className="btn-primary">{adjustSaving ? 'Ajustando...' : 'Confirmar'}</button></>}>
        {adjustModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between">
              <div><p className="text-xs text-gray-500">Estoque atual</p><p className="text-2xl font-bold">{adjustModal.stock} {adjustModal.unit}</p></div>
              <div className="text-right"><p className="text-xs text-gray-500">Estoque mínimo</p><p className="text-lg font-semibold text-gray-600">{adjustModal.min_stock}</p></div>
            </div>
            <div>
              <label className="label">Quantidade (positivo = entrada, negativo = saída)</label>
              <input type="number" value={adjustQty} onChange={e => setAdjustQty(parseInt(e.target.value) || 0)} className="input text-center text-xl font-bold" />
            </div>
            {adjustQty !== 0 && (
              <div className={`rounded-xl p-3 text-sm font-medium ${adjustQty > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                Novo estoque: {Math.max(0, adjustModal.stock + adjustQty)} {adjustModal.unit}
                {adjustQty > 0 ? ' (entrada)' : ' (saída)'}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── Aba Faltas ──────────────────────────────────────────────────────────────
const emptyFalta = { name: '', category: 'Outros', brand: '', unit: 'UN', quantity_needed: 1, estimated_price: 0, notes: '' }
const emptyToStock = { name: '', category: 'Outros', brand: '', unit: 'UN', code: '', cost_price: 0, sale_price: 0, stock: 1, min_stock: 5 }

function FaltasTab() {
  const [faltas, setFaltas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toStockModal, setToStockModal] = useState<any>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyFalta)
  const [tsForm, setTsForm] = useState(emptyToStock)
  const [saving, setSaving] = useState(false)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const load = () => api.get('/faltas').then(r => setFaltas(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyFalta); setModalOpen(true) }
  const openEdit = (f: any) => { setEditing(f); setForm({ ...emptyFalta, ...f }); setModalOpen(true) }

  const openToStock = (f: any) => {
    setToStockModal(f)
    setTsForm({ name: f.name, category: f.category, brand: f.brand || '', unit: f.unit, code: '', cost_price: f.estimated_price || 0, sale_price: parseFloat((f.estimated_price * 1.3 || 0).toFixed(2)), stock: f.quantity_needed, min_stock: 5 })
  }

  const handleSave = async () => {
    if (!form.name) { toast.error('Nome obrigatório'); return }
    setSaving(true)
    try {
      if (editing) await api.put(`/faltas/${editing.id}`, form)
      else await api.post('/faltas', form)
      toast.success(editing ? 'Falta atualizada!' : 'Falta registrada!')
      setModalOpen(false); load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    await api.delete(`/faltas/${confirmDel}`)
    toast.success('Removido'); load(); setConfirmDel(null)
  }

  const handleToStock = async () => {
    if (!toStockModal) return
    if (!tsForm.name) { toast.error('Nome obrigatório'); return }
    setSaving(true)
    try {
      await api.post(`/faltas/${toStockModal.id}/to-stock`, tsForm)
      toast.success('Produto adicionado ao estoque e removido das faltas!')
      setToStockModal(null); load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setSaving(false) }
  }

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const TS = (k: string, v: any) => setTsForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex-1">
          <p className="text-sm text-blue-800 font-medium">📋 Lista de Faltas</p>
          <p className="text-xs text-blue-600 mt-1">Registre produtos que não estão no estoque. Quando comprar, use "Mover para Estoque" para adicioná-los automaticamente.</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button onClick={openAdd} className="btn-primary flex items-center gap-1.5"><Plus size={16} />Nova Falta</button>
          <button
            onClick={async () => {
              if (faltas.length === 0) { toast.error('Nenhuma falta para enviar'); return }
              // Get configured WhatsApp number from settings
              let waNum = ''
              try { const r = await api.get('/settings'); waNum = r.data?.meu_whatsapp || '' } catch {}
              const now = new Date().toLocaleDateString('pt-BR')
              let msg = `📋 *LISTA DE FALTAS — ${now}*\n${'─'.repeat(30)}\n\n`
              faltas.forEach((f, i) => {
                msg += `*${i+1}. ${f.name}*\n`
                if (f.brand) msg += `   Marca: ${f.brand}\n`
                msg += `   Qtd: ${f.quantity_needed} ${f.unit}\n`
                if (f.estimated_price > 0) msg += `   Preço est.: R$ ${f.estimated_price.toFixed(2)}\n`
                if (f.notes) msg += `   Obs: ${f.notes}\n`
                msg += `\n`
              })
              msg += `_Total: ${faltas.length} item(ns) em falta_`
              const encoded = encodeURIComponent(msg)
              const url = waNum ? `https://wa.me/${waNum}?text=${encoded}` : `https://wa.me/?text=${encoded}`
              window.open(url, '_blank')
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <MessageCircle size={15} />Enviar p/ WhatsApp
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Produto</th>
                <th className="table-header">Categoria</th>
                <th className="table-header">Marca</th>
                <th className="table-header">Qtd Necessária</th>
                <th className="table-header">Preço Est.</th>
                <th className="table-header">Notas</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-cell py-12 text-center text-gray-400">Carregando...</td></tr>
              ) : faltas.length === 0 ? (
                <tr><td colSpan={7} className="table-cell py-12 text-center text-gray-300">
                  <XCircle size={36} className="mx-auto mb-2" />
                  Nenhuma falta registrada. Clique em "Nova Falta" para começar.
                </td></tr>
              ) : faltas.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-cell font-medium">{f.name}</td>
                  <td className="table-cell"><span className="badge badge-gray">{f.category}</span></td>
                  <td className="table-cell text-gray-500">{f.brand || '—'}</td>
                  <td className="table-cell">{f.quantity_needed} {f.unit}</td>
                  <td className="table-cell">{f.estimated_price > 0 ? fmtCurrency(f.estimated_price) : '—'}</td>
                  <td className="table-cell text-xs text-gray-500 max-w-xs truncate">{f.notes || '—'}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openToStock(f)} className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1">
                        <PackagePlus size={12} />Mover p/ Estoque
                      </button>
                      <button onClick={() => openEdit(f)} className="btn-ghost py-1 px-2 text-xs"><Edit3 size={13} /></button>
                      <button onClick={() => setConfirmDel(f.id)} className="btn-ghost py-1 px-2 text-xs text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit falta modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Falta' : 'Nova Falta'}
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button></>}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nome do Produto *</label>
            <input value={form.name} onChange={e => F('name', e.target.value)} className="input" placeholder="Ex: Filtro de Óleo L200" />
          </div>
          <div>
            <label className="label">Categoria</label>
            <select value={form.category} onChange={e => F('category', e.target.value)} className="select">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Unidade</label>
            <select value={form.unit} onChange={e => F('unit', e.target.value)} className="select">
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Marca</label>
            <input value={form.brand} onChange={e => F('brand', e.target.value)} className="input" placeholder="Bosch, NGK..." />
          </div>
          <div>
            <label className="label">Qtd Necessária</label>
            <input type="number" min={1} value={form.quantity_needed} onChange={e => F('quantity_needed', parseInt(e.target.value) || 1)} className="input" />
          </div>
          <div>
            <label className="label">Preço Estimado (R$)</label>
            <input type="number" step="0.01" min={0} value={form.estimated_price} onChange={e => F('estimated_price', parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div className="col-span-2">
            <label className="label">Observações</label>
            <textarea value={form.notes} onChange={e => F('notes', e.target.value)} className="input resize-none h-16 text-sm" placeholder="Notas sobre o produto..." />
          </div>
        </div>
      </Modal>

      {/* Move to stock modal */}
      <Modal open={!!toStockModal} onClose={() => setToStockModal(null)} title={`Mover para Estoque — ${toStockModal?.name}`} size="lg"
        footer={<><button onClick={() => setToStockModal(null)} className="btn-secondary">Cancelar</button>
          <button onClick={handleToStock} disabled={saving} className="btn-primary flex items-center gap-2">
            <PackagePlus size={16} />{saving ? 'Movendo...' : 'Adicionar ao Estoque e Produtos'}
          </button></>}>
        {toStockModal && (
          <div className="space-y-4">
            <div className="bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm">
              ✅ Preencha os dados do produto para adicionar ao estoque. Após confirmar, ele será removido da lista de faltas.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Nome *</label>
                <input value={tsForm.name} onChange={e => TS('name', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Código</label>
                <input value={tsForm.code} onChange={e => TS('code', e.target.value)} className="input" placeholder="MAP001" />
              </div>
              <div>
                <label className="label">Marca</label>
                <input value={tsForm.brand} onChange={e => TS('brand', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Categoria</label>
                <select value={tsForm.category} onChange={e => TS('category', e.target.value)} className="select">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Unidade</label>
                <select value={tsForm.unit} onChange={e => TS('unit', e.target.value)} className="select">
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Preço de Custo (R$)</label>
                <input type="number" step="0.01" value={tsForm.cost_price}
                  onChange={e => { const v = parseFloat(e.target.value) || 0; TS('cost_price', v); TS('sale_price', parseFloat((v * 1.3).toFixed(2))) }}
                  className="input" />
              </div>
              <div>
                <label className="label">Preço de Venda (R$) <span className="text-xs text-primary-500">+30% automático</span></label>
                <input type="number" step="0.01" value={tsForm.sale_price} onChange={e => TS('sale_price', parseFloat(e.target.value) || 0)} className="input" />
              </div>
              <div>
                <label className="label">Qtd em Estoque</label>
                <input type="number" min={1} value={tsForm.stock} onChange={e => TS('stock', parseInt(e.target.value) || 1)} className="input" />
              </div>
              <div>
                <label className="label">Estoque Mínimo</label>
                <input type="number" min={0} value={tsForm.min_stock} onChange={e => TS('min_stock', parseInt(e.target.value) || 0)} className="input" />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDel} title="Remover Falta" message="Esta falta será removida da lista."
        confirmText="Remover" danger onConfirm={handleDelete} onCancel={() => setConfirmDel(null)} />
    </div>
  )
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function EstoquePage() {
  const [activeTab, setActiveTab] = useState<'inventario' | 'faltas'>('inventario')

  return (
    <div className="animate-fade-in">
      <Header title="Controle de Estoque" subtitle="Monitore, ajuste inventário e gerencie faltas" />
      <div className="p-8 space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab('inventario')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'inventario' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            📦 Inventário
          </button>
          <button onClick={() => setActiveTab('faltas')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'faltas' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            📋 Faltas
          </button>
        </div>

        {activeTab === 'inventario' ? <InventarioTab /> : <FaltasTab />}
      </div>
    </div>
  )
}
