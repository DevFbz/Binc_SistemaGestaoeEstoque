import { useEffect, useState, useRef } from 'react'
import { Plus, Search, Edit3, Trash2, Package, FileUp, CheckCircle, Loader2, Image, X } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import api from '../api/client'
import { fmtCurrency } from '../lib/utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/auth'

const CATEGORIES = ['Filtros','Freios','Oleos','Motor','Eletrica','Suspensao','Arrefecimento','Transmissao','Carroceria','Acessorios','Outros']
const UNITS = ['UN','JG','LT','KG','MT','CX','PC','FR','KIT','PAR']

const emptyForm = {
  code: '', name: '', category: 'Filtros', brand: '', unit: 'UN',
  cost_price: 0, sale_price: 0, stock: 0, min_stock: 5, description: '',
  image_url: ''
}

export default function ProdutosPage() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [autoMarkup, setAutoMarkup] = useState(false)
  const [xmlModal, setXmlModal] = useState(false)
  const [xmlProducts, setXmlProducts] = useState<any[]>([])
  const [xmlImporting, setXmlImporting] = useState(false)
  const xmlInputRef = useRef<HTMLInputElement>(null)

  // Cosmos EAN states
  const [eanLoading, setEanLoading] = useState(false)
  const eanDebounceRef = useRef<any>(null)

  // Image preview modal
  const [imageModal, setImageModal] = useState<{ name: string; url: string } | null>(null)

  const load = () => api.get('/products').then(r => { setProducts(r.data); setFiltered(r.data) }).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!q) setFiltered(products)
    else {
      const ql = q.toLowerCase()
      setFiltered(products.filter(p => p.name.toLowerCase().includes(ql) || (p.code || '').toLowerCase().includes(ql) || (p.category || '').toLowerCase().includes(ql)))
    }
  }, [q, products])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setAutoMarkup(false); setModalOpen(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ ...emptyForm, ...p }); setAutoMarkup(false); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.name) { toast.error('Nome é obrigatório'); return }
    setSaving(true)
    try {
      let finalForm = { ...form }

      // Se não tem imagem, busca automaticamente no Bing
      if (!finalForm.image_url?.trim()) {
        const toastId = toast.loading('🔍 Buscando imagem do produto...')
        try {
          const params = new URLSearchParams({ name: finalForm.name, brand: finalForm.brand || '' })
          const imgRes = await api.get(`/products/search-image?${params}`)
          if (imgRes.data?.image_url) {
            finalForm.image_url = imgRes.data.image_url
            toast.success('✅ Imagem encontrada!', { id: toastId, duration: 2000 })
          } else {
            toast.dismiss(toastId)
          }
        } catch {
          toast.dismiss(toastId)
        }
      }

      if (editing) await api.put(`/products/${editing.id}`, finalForm)
      else await api.post('/products', finalForm)
      toast.success(editing ? 'Produto atualizado!' : 'Produto adicionado!')
      setModalOpen(false)
      load()
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.delete(`/products/${confirmDelete}`)
      toast.success('Produto excluído!')
      load()
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Erro ao excluir')
    } finally { setConfirmDelete(null) }
  }

  const F = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }))

  // ─── EAN Auto-fill ────────────────────────────────────────────────────────
  const handleCodeChange = (val: string) => {
    F('code', val)
    if (eanDebounceRef.current) clearTimeout(eanDebounceRef.current)
    // Only query if looks like an EAN (8-14 digits)
    if (/^\d{8,14}$/.test(val.trim())) {
      eanDebounceRef.current = setTimeout(() => fetchEan(val.trim()), 600)
    }
  }

  const fetchEan = async (ean: string) => {
    setEanLoading(true)
    try {
      const res = await api.get(`/cosmos/ean/${ean}`)
      const data = res.data
      if (data.name) {
        setForm((f: any) => ({
          ...f,
          name: data.name || f.name,
          brand: data.brand || f.brand,
          category: mapCosmosCategory(data.category) || f.category,
          image_url: data.image_url || f.image_url,
          ncm: data.ncm || f.ncm || '',
        }))
        toast.success(`✅ EAN encontrado: ${data.name}`, { duration: 3000 })
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 404) toast('EAN não encontrado na base Cosmos.', { icon: '🔍' })
      else if (status === 400) toast.error('Configure os tokens Cosmos em Configurações.')
      else if (status === 429) toast.error('Limite de token atingido. Aguarde ou configure mais tokens.')
      // outros erros: silencioso
    } finally {
      setEanLoading(false)
    }
  }

  const mapCosmosCategory = (cat: string): string => {
    if (!cat) return ''
    const lower = cat.toLowerCase()
    if (lower.includes('filtro') || lower.includes('filter')) return 'Filtros'
    if (lower.includes('freio') || lower.includes('brake')) return 'Freios'
    if (lower.includes('oleo') || lower.includes('oil') || lower.includes('óleo')) return 'Oleos'
    if (lower.includes('motor') || lower.includes('vela') || lower.includes('spark')) return 'Motor'
    if (lower.includes('eletric') || lower.includes('bateria') || lower.includes('electric')) return 'Eletrica'
    if (lower.includes('suspen')) return 'Suspensao'
    if (lower.includes('arrefec') || lower.includes('cool')) return 'Arrefecimento'
    if (lower.includes('transm') || lower.includes('cambio')) return 'Transmissao'
    if (lower.includes('carrocer')) return 'Carroceria'
    return 'Outros'
  }

  // ─── XML Import ───────────────────────────────────────────────────────────
  const handleXmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parser = new DOMParser()
        const xml = parser.parseFromString(ev.target?.result as string, 'text/xml')
        const dets = Array.from(xml.querySelectorAll('det'))
        if (dets.length === 0) { toast.error('XML inválido ou sem produtos (det)'); return }
        const parsed = dets.map((det) => {
          const get = (tag: string) => det.querySelector(tag)?.textContent?.trim() || ''
          const name = get('xProd')
          const code = get('cProd')
          const ncm = get('NCM')
          const cfop = get('CFOP')
          const csosn = get('CSOSN')
          const unit = get('uCom') || get('uTrib') || 'UN'
          const vUnCom = parseFloat(get('vUnCom') || get('vProd') || '0')
          const sale_price = parseFloat((vUnCom * 1.3).toFixed(2))
          const stock = parseInt(get('qCom') || get('qTrib') || '1') || 1
          return { name, code, ncm, cfop, csosn, unit, cost_price: vUnCom, sale_price, stock, min_stock: 5, category: 'Outros', brand: '', description: '', image_url: '' }
        }).filter(p => p.name)
        setXmlProducts(parsed)
        setXmlModal(true)
      } catch { toast.error('Erro ao parsear XML') }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const handleXmlImport = async () => {
    setXmlImporting(true)
    let ok = 0, fail = 0
    for (const p of xmlProducts) {
      try { await api.post('/products', p); ok++ } catch { fail++ }
    }
    toast.success(`${ok} produto(s) importado(s)${fail > 0 ? ` (${fail} falha(s))` : '!'}`)
    setXmlModal(false); setXmlProducts([]); setXmlImporting(false); load()
  }

  return (
    <div className="animate-fade-in">
      <Header title="Produtos" subtitle="Gerencie seu inventário de produtos" />
      <div className="p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome ou código..."
              className="input pl-9" />
          </div>
          <input ref={xmlInputRef} type="file" accept=".xml,text/xml" className="hidden" onChange={handleXmlFile} />
          <button onClick={() => xmlInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
            <FileUp size={15} />Importar XML
          </button>
          <button onClick={openAdd} className="btn-primary ml-auto"><Plus size={16} />Novo Produto</button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Código</th>
                  <th className="table-header">Nome</th>
                  <th className="table-header">Categoria</th>
                  <th className="table-header">Estoque</th>
                  <th className="table-header">Preço Venda</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="table-cell text-center text-gray-400 py-12">Carregando...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="table-cell text-center text-gray-400 py-12">
                    <Package size={32} className="mx-auto mb-2 text-gray-300" />
                    Nenhum produto encontrado
                  </td></tr>
                ) : filtered.map((p) => {
                  const lowStock = p.stock <= p.min_stock
                  return (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell font-mono text-xs text-gray-500">{p.code || '—'}</td>
                      <td className="table-cell font-medium">
                        <div className="flex items-center gap-2">
                          {p.image_url && (
                            <img src={p.image_url} alt="" className="w-7 h-7 object-contain rounded border border-gray-100 flex-shrink-0" />
                          )}
                          <span>
                            {p.name} {p.brand ? <span className="text-gray-400 font-normal"> — {p.brand}</span> : ''}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="badge bg-gray-100 text-gray-600">{p.category || '—'}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`font-semibold ${lowStock ? 'text-red-600' : 'text-gray-800'}`}>
                          {p.stock} {p.unit}
                        </span>
                        {lowStock && <span className="ml-2 badge badge-red">Baixo</span>}
                      </td>
                      <td className="table-cell font-semibold text-gray-800">{fmtCurrency(p.sale_price)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)} className="btn-ghost py-1 px-2 text-xs"><Edit3 size={14} />Editar</button>
                          <button
                            onClick={() => p.image_url ? setImageModal({ name: p.name, url: p.image_url }) : toast('Este produto não tem imagem. Busque pelo EAN na edição.', { icon: '🖼️' })}
                            className={`btn-ghost py-1 px-2 text-xs flex items-center gap-1 ${p.image_url ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-300 hover:bg-gray-50'}`}
                            title={p.image_url ? 'Ver imagem do produto' : 'Sem imagem — busque pelo EAN para preencher'}
                          >
                            <Image size={14} />{p.image_url ? 'Imagem' : 'Sem foto'}
                          </button>
                          {user?.role === 'admin' && (
                            <button onClick={() => setConfirmDelete(p.id)} className="btn-ghost py-1 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600">
                              <Trash2 size={14} />Excluir
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
          {!loading && <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} produto(s)</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Produto' : 'Novo Produto'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-4">
          {/* Código com busca EAN automática */}
          <div>
            <label className="label flex items-center gap-2">
              Código / EAN
              {eanLoading && <Loader2 size={12} className="animate-spin text-blue-500" />}
              {!eanLoading && /^\d{8,14}$/.test(form.code) && <span className="text-xs text-blue-500 font-normal">🔍 EAN detectado</span>}
            </label>
            <input
              value={form.code}
              onChange={e => handleCodeChange(e.target.value)}
              className="input"
              placeholder="Deixe vazio para gerar automaticamente..."
            />
            {!editing && (
              <p className="text-xs text-gray-400 mt-1">💡 Vazio = código gerado do nome (ex: Filtro de Ar → FLTR001). Ou digite um EAN (8-14 dígitos) para buscar dados via Cosmos.</p>
            )}
          </div>

          <div>
            <label className="label">Marca</label>
            <input value={form.brand} onChange={e => F('brand', e.target.value)} className="input" placeholder="Bosch, NGK..." />
          </div>

          <div className="col-span-2">
            <label className="label">Nome *</label>
            <input value={form.name} onChange={e => F('name', e.target.value)} className="input" placeholder="Nome do produto" />
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
            <label className="label">Preço de Custo (R$)</label>
            <input type="number" step="0.01" min="0" value={form.cost_price}
              onChange={e => {
                const cost = parseFloat(e.target.value) || 0
                F('cost_price', cost)
                if (autoMarkup && cost > 0) F('sale_price', parseFloat((cost * 1.3).toFixed(2)))
              }}
              className="input" />
          </div>

          <div>
            <label className="label">Preço de Venda (R$) *</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox" id="autoMarkup"
                checked={autoMarkup}
                onChange={e => {
                  setAutoMarkup(e.target.checked)
                  if (e.target.checked && form.cost_price > 0) {
                    F('sale_price', parseFloat((form.cost_price * 1.3).toFixed(2)))
                  }
                }}
                className="w-4 h-4 accent-primary-500 cursor-pointer"
              />
              <label htmlFor="autoMarkup" className="text-xs text-gray-600 cursor-pointer select-none">
                🏷️ Markup 30% automático
              </label>
            </div>
            <input type="number" step="0.01" min="0" value={form.sale_price}
              onChange={e => { setAutoMarkup(false); F('sale_price', parseFloat(e.target.value) || 0) }}
              className="input" readOnly={autoMarkup} />
          </div>

          <div>
            <label className="label">Estoque Atual</label>
            <input type="number" min="0" value={form.stock} onChange={e => F('stock', parseInt(e.target.value) || 0)} className="input" />
          </div>

          <div>
            <label className="label">Estoque Mínimo</label>
            <input type="number" min="0" value={form.min_stock} onChange={e => F('min_stock', parseInt(e.target.value) || 0)} className="input" />
          </div>

          {/* Imagem URL (preenchida pelo Cosmos ou manual) */}
          <div className="col-span-2">
            <label className="label flex justify-between items-center">
              <span>Imagem do Produto (URL)</span>
              {form.name && (
                <a
                  href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(form.name + ' ' + (form.brand || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-semibold"
                  title="Abrir Google Imagens manualmente (fallback)"
                >
                  <Search size={12} />Buscar manualmente
                </a>
              )}
            </label>
            <div className="flex gap-2 items-start">
              <input value={form.image_url || ''} onChange={e => F('image_url', e.target.value)} className="input flex-1 text-sm" placeholder="Deixe vazio — será buscada automaticamente ao salvar..." />
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="w-14 h-14 object-contain rounded-lg border border-gray-200 flex-shrink-0 bg-white" onError={e => (e.currentTarget.style.display = 'none')} />
              )}
            </div>
            {!form.image_url && form.name && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                ✨ Uma imagem será buscada automaticamente ao salvar
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="label">Descrição</label>
            <textarea value={form.description} onChange={e => F('description', e.target.value)} className="input resize-none h-16" placeholder="Descrição opcional..." />
          </div>

          {form.cost_price > 0 && form.sale_price > 0 && (
            <div className="col-span-2 bg-emerald-50 rounded-lg p-3 text-sm">
              <span className="text-emerald-700 font-medium">
                Margem: {(((form.sale_price - form.cost_price) / form.sale_price) * 100).toFixed(1)}%
                (lucro: {fmtCurrency(form.sale_price - form.cost_price)}/un)
              </span>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Excluir Produto" message="Esta ação não pode ser desfeita. O produto será removido permanentemente."
        confirmText="Excluir" danger onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />

      {/* Image Preview Modal */}
      {imageModal && (
        <div className="modal-overlay" onClick={() => setImageModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base truncate pr-4">{imageModal.name}</h3>
              <button onClick={() => setImageModal(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 min-h-48">
              <img
                src={imageModal.url}
                alt={imageModal.name}
                className="max-w-full max-h-64 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).src = ''; e.currentTarget.alt = 'Imagem não disponível' }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center truncate">{imageModal.url}</p>
          </div>
        </div>
      )}

      {/* XML Import Preview Modal */}
      <Modal open={xmlModal} onClose={() => setXmlModal(false)} title={`Importar XML — ${xmlProducts.length} produto(s) encontrado(s)`} size="lg"
        footer={<>
          <button onClick={() => setXmlModal(false)} className="btn-secondary">Cancelar</button>
          <button onClick={handleXmlImport} disabled={xmlImporting || xmlProducts.length === 0} className="btn-primary flex items-center gap-2">
            <CheckCircle size={16} />{xmlImporting ? 'Importando...' : `Importar ${xmlProducts.length} produto(s)`}
          </button>
        </>}>
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            ⚠️ Preços de venda calculados com +30% de markup. Você pode editar individualmente após importar.
          </div>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="table-header">Produto</th>
                  <th className="table-header">Código</th>
                  <th className="table-header">Qtd</th>
                  <th className="table-header">Custo</th>
                  <th className="table-header">Venda (+30%)</th>
                </tr>
              </thead>
              <tbody>
                {xmlProducts.map((p, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell font-medium">{p.name}</td>
                    <td className="table-cell font-mono text-xs text-gray-500">{p.code || '—'}</td>
                    <td className="table-cell">{p.stock} {p.unit}</td>
                    <td className="table-cell">R$ {p.cost_price.toFixed(2)}</td>
                    <td className="table-cell font-semibold text-primary-600">R$ {p.sale_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}
