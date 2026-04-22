import { useEffect, useState, useRef, useCallback } from 'react'
import {
  ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle,
  MessageCircle, Star, Printer, X, ChevronDown, UserCheck
} from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import api from '../api/client'
import { fmtCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

const PAYMENTS = ['Dinheiro', 'Cartao de Credito', 'Cartao de Debito', 'PIX', 'Boleto', 'Fiado / A Prazo']

interface CartItem {
  product_id: string; name: string; brand?: string; code: string; unit: string
  quantity: number; unit_price: number; discount: number; stock: number
  image_url?: string
}

const empty = (): CartItem => ({} as CartItem)

// ─── NF Simples (cupom) ────────────────────────────────────────────────────────
function buildReceiptText(sale: any, nfCfg: any) {
  const line = (s: string) => s + '\n'
  const sep = '─'.repeat(40) + '\n'
  const center = (s: string, w = 40) => s.padStart(Math.floor((w + s.length) / 2)).padEnd(w) + '\n'
  let t = ''
  t += center(nfCfg.nome_loja)
  t += center(nfCfg.slogan)
  if (nfCfg.cnpj) t += center(`CNPJ: ${nfCfg.cnpj}`)
  if (nfCfg.endereco) t += center(nfCfg.endereco)
  if (nfCfg.telefone) t += center(`Tel: ${nfCfg.telefone}`)
  t += sep
  t += center('CUPOM NÃO FISCAL')
  t += sep
  t += `Data: ${new Date(sale.date).toLocaleString('pt-BR')}\n`
  t += `Cliente: ${sale.customer_name || 'Consumidor Final'}\n`
  t += `Operador: ${sale.operator || ''}\n`
  t += sep
  for (const it of sale.items) {
    if (it.cancelled) continue
    const val = it.quantity * it.unit_price * (1 - (it.discount || 0) / 100)
    t += `${it.name}\n`
    t += `  ${it.quantity} ${it.unit} x R$ ${it.unit_price.toFixed(2)} = R$ ${val.toFixed(2)}\n`
  }
  t += sep
  if (sale.discount_value > 0) t += `  Desconto: -R$ ${sale.discount_value.toFixed(2)}\n`
  t += `  TOTAL: R$ ${sale.total.toFixed(2)}\n`
  t += `  Pagamento: ${sale.payment_method}\n`
  if (sale.cash_received) {
    t += `  Recebido: R$ ${sale.cash_received.toFixed(2)}\n`
    t += `  Troco: R$ ${(sale.cash_received - sale.total).toFixed(2)}\n`
  }
  t += sep
  t += center(nfCfg.rodape || 'Obrigado pela preferência!')
  return t
}

// ─── Tela pós-venda ────────────────────────────────────────────────────────────
function SaleDoneScreen({ sale, onNew, nfCfg, googleReviewLink }: {
  sale: any; onNew: () => void; nfCfg: any; googleReviewLink: string
}) {
  const [waPhone, setWaPhone] = useState(sale.customer_phone || '')
  const [showPhoneInput, setShowPhoneInput] = useState(!sale.customer_phone)

  const receiptText = buildReceiptText(sale, nfCfg)

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=400,height=700')
    if (win) {
      win.document.write(`<html><body><pre style="font-family:monospace;font-size:12px;white-space:pre">${receiptText}</pre></body></html>`)
      win.document.close(); win.print()
    }
  }

  const handleWhatsApp = () => {
    const phone = waPhone.replace(/\D/g, '')
    if (phone.length < 10) { toast.error('Número inválido'); return }
    let msg = `🛒 *Comprovante de Venda*\n\n${receiptText}`
    if (googleReviewLink) {
      msg += `\n\n⭐ Avalie nosso atendimento no Google! É muito rápido e nos ajuda bastante:\n${googleReviewLink}`
    }
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/55${phone}?text=${encoded}`, '_blank')
  }

  const handleReview = () => {
    if (!googleReviewLink) { toast.error('Link de avaliação não configurado em Configurações'); return }
    window.open(googleReviewLink, '_blank')
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-8">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Venda Concluída!</h2>
          <p className="text-gray-500 mt-2">
            Total: <span className="font-bold text-primary-600 text-xl">{fmtCurrency(sale.total)}</span>
          </p>
          {(sale.cash_received ?? 0) > sale.total && (
            <p className="text-lg font-semibold text-emerald-600 mt-1">
              Troco: {fmtCurrency(sale.cash_received - sale.total)}
            </p>
          )}
          <p className="text-sm text-gray-400 mt-1">Pagamento: {sale.payment_method} · {sale.items?.filter((i: any) => !i.cancelled).length} item(s)</p>
        </div>

        {/* WhatsApp */}
        <div className="card p-5 text-left space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MessageCircle size={18} className="text-green-500" />
            Enviar Nota via WhatsApp
          </h3>
          {showPhoneInput && (
            <div>
              <label className="label text-xs">Número do cliente (com DDD)</label>
              <input
                value={waPhone}
                onChange={e => setWaPhone(e.target.value)}
                placeholder="(21) 99999-9999"
                className="input text-sm"
              />
            </div>
          )}
          {!showPhoneInput && (
            <p className="text-sm text-gray-600">
              📞 {sale.customer_phone}
              <button onClick={() => setShowPhoneInput(true)} className="ml-2 text-xs text-primary-500 underline">alterar</button>
            </p>
          )}
          <button onClick={handleWhatsApp} className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
            <MessageCircle size={16} />Enviar por WhatsApp
          </button>
        </div>

        {/* Print */}
        <button onClick={handlePrint} className="w-full card p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          <Printer size={18} />Imprimir Cupom
        </button>

        {/* Google Review */}
        <button onClick={handleReview} className="w-full p-4 border-2 border-dashed border-amber-300 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors text-amber-700 font-medium">
          <Star size={18} />Solicitar Avaliação Google ao Cliente
        </button>

        {/* Nova Venda */}
        <button onClick={onNew} className="btn-primary w-full py-4 text-base">
          + Nova Venda
        </button>
      </div>
    </div>
  )
}

// ─── Página Principal ──────────────────────────────────────────────────────────
export default function NovaVendaPage() {
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [nfCfg, setNfCfg] = useState<any>({ nome_loja: 'BINC', slogan: '', rodape: 'Obrigado!' })
  const [googleReviewLink, setGoogleReviewLink] = useState('')

  const [cart, setCart] = useState<CartItem[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productFocus, setProductFocus] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerFocus, setCustomerFocus] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [payment, setPayment] = useState('Dinheiro')
  const [discountPct, setDiscountPct] = useState(0)
  const [cashReceived, setCashReceived] = useState('')
  const [obs, setObs] = useState('')
  const [hasLabor, setHasLabor] = useState(false)
  const [laborValue, setLaborValue] = useState('')
  const [finishing, setFinishing] = useState(false)
  const [doneSale, setDoneSale] = useState<any>(null)

  const productInputRef = useRef<HTMLInputElement>(null)
  const customerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data))
    api.get('/customers').then(r => setCustomers(r.data))
    api.get('/settings').then(r => {
      setNfCfg(r.data.nota_fiscal || {})
      setGoogleReviewLink(r.data.google_review_link || '')
    }).catch(() => {})
  }, [])

  // Filtro de produtos (busca ou mostrar tudo no focus)
  const filteredProducts = productFocus
    ? (productSearch.length === 0
        ? products.slice(0, 30)
        : products.filter(p =>
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            (p.code || '').toLowerCase().includes(productSearch.toLowerCase())
          ).slice(0, 20)
      )
    : []

  // Filtro de clientes
  const filteredCustomers = customerFocus
    ? (customerSearch.length === 0
        ? customers
        : customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || (c.phone || '').includes(customerSearch))
      )
    : []

  const addToCart = (p: any) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product_id === p.id)
      if (idx >= 0) {
        const updated = [...prev]
        if (updated[idx].quantity < p.stock) updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
        else toast.error(`Estoque insuficiente (${p.stock} ${p.unit})`)
        return updated
      }
      if (p.stock <= 0) { toast.error('Produto sem estoque'); return prev }
      return [...prev, {
        product_id: p.id, name: p.name, brand: p.brand, code: p.code,
        unit: p.unit, quantity: 1, unit_price: p.sale_price, discount: 0, stock: p.stock,
        image_url: p.image_url || ''
      }]
    })
    setProductSearch('')
    setProductFocus(false)
    productInputRef.current?.blur()
  }

  const updateQty = (idx: number, qty: number) => {
    if (qty <= 0) { removeItem(idx); return }
    setCart(prev => {
      const u = [...prev]
      if (qty > u[idx].stock) { toast.error(`Estoque máx: ${u[idx].stock}`); return u }
      u[idx] = { ...u[idx], quantity: qty }
      return u
    })
  }

  const updateDiscount = (idx: number, disc: number) => {
    setCart(prev => { const u = [...prev]; u[idx] = { ...u[idx], discount: Math.max(0, Math.min(100, disc)) }; return u })
  }

  const removeItem = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx))

  const laborNum = hasLabor && laborValue ? parseFloat(laborValue) || 0 : 0
  const subtotal = cart.reduce((s, i) => s + i.quantity * i.unit_price * (1 - i.discount / 100), 0) + laborNum
  const discountValue = subtotal * (discountPct / 100)
  const total = subtotal - discountValue
  const change = payment === 'Dinheiro' && cashReceived ? parseFloat(cashReceived) - total : 0

  const handleFinish = async () => {
    if (cart.length === 0) { toast.error('Carrinho vazio'); return }
    setFinishing(true)
    try {
      const payload = {
        customer_id: selectedCustomer?.id || null,
        customer_name: selectedCustomer?.name || 'Consumidor Final',
        customer_phone: selectedCustomer?.phone || null,
        items: [
          ...cart.map(i => ({
            product_id: i.product_id, name: i.name, code: i.code,
            unit: i.unit, quantity: i.quantity, unit_price: i.unit_price, discount: i.discount
          })),
          ...(laborNum > 0 ? [{
            product_id: "MAO_DE_OBRA", name: "Mão de Obra", code: "SRV",
            unit: "SV", quantity: 1, unit_price: laborNum, discount: 0
          }] : [])
        ],
        subtotal, discount_pct: discountPct, discount_value: discountValue,
        total, payment_method: payment,
        cash_received: cashReceived ? parseFloat(cashReceived) : null,
        observations: obs,
      }
      const r = await api.post('/sales', payload)
      setDoneSale({ ...r.data, customer_phone: selectedCustomer?.phone || null })
      setCart([]); setProductSearch(''); setSelectedCustomer(null)
      setDiscountPct(0); setCashReceived(''); setObs(''); setLaborValue(''); setHasLabor(false)
      setPayment('Dinheiro')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Erro ao finalizar')
    } finally {
      setFinishing(false)
    }
  }

  const handleNewSale = () => setDoneSale(null)

  if (doneSale) {
    return (
      <div className="animate-fade-in">
        <Header title="Nova Venda" subtitle="Ponto de Venda — PDV" />
        <SaleDoneScreen sale={doneSale} onNew={handleNewSale} nfCfg={nfCfg} googleReviewLink={googleReviewLink} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <Header title="Nova Venda" subtitle="Ponto de Venda — PDV" />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-81px)] overflow-hidden">
        {/* Left: Product search + cart */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">

          {/* Product search */}
          <div className="card p-4">
            <label className="label text-xs font-semibold uppercase tracking-wider">BUSCAR PRODUTO</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                ref={productInputRef}
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                onFocus={() => setProductFocus(true)}
                onBlur={() => setTimeout(() => setProductFocus(false), 150)}
                placeholder="Digite nome ou código do produto..."
                className="input pl-9"
              />
              {filteredProducts.length > 0 && productFocus && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {filteredProducts.map(p => (
                    <button
                      key={p.id}
                      onMouseDown={() => addToCart(p)}
                      className={`w-full text-left px-4 py-3 hover:bg-primary-50 border-b border-gray-50 last:border-0 flex items-center gap-3 ${p.stock <= 0 ? 'opacity-40' : ''}`}
                    >
                      {/* Thumbnail no dropdown */}
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-9 h-9 object-contain rounded-lg border border-gray-100 flex-shrink-0 bg-gray-50" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-300">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900 text-sm">
                          {p.name} {p.brand ? <span className="text-gray-400 font-normal"> — {p.brand}</span> : ''}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 font-mono">{p.code}</span>
                        <span className="ml-2 badge badge-gray text-xs">{p.category}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-primary-600">{fmtCurrency(p.sale_price)}/{p.unit}</p>
                        <p className={`text-xs ${p.stock <= p.min_stock ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          Estoque: {p.stock}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <ShoppingCart size={18} className="text-primary-500" />
              <span className="font-semibold text-gray-800">Carrinho ({cart.length})</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                  <ShoppingCart size={48} className="mb-3" />
                  <p className="text-sm">Busque e adicione produtos acima</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="table-header">Produto</th>
                      <th className="table-header w-28">Qtd</th>
                      <th className="table-header w-24">Desc%</th>
                      <th className="table-header w-28 text-right">Total</th>
                      <th className="table-header w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={item.product_id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2.5">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt=""
                                className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0"
                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.name} {item.brand ? <span className="text-gray-400 font-normal"> — {item.brand}</span> : ''}
                              </p>
                              <p className="text-xs text-gray-400">{fmtCurrency(item.unit_price)}/{item.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(idx, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-600">
                              <Minus size={12} />
                            </button>
                            <input
                              type="number" value={item.quantity} min={1} max={item.stock}
                              onChange={e => updateQty(idx, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border border-gray-200 rounded-lg py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                            <button onClick={() => updateQty(idx, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-primary-50 flex items-center justify-center text-gray-600">
                              <Plus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number" value={item.discount} min={0} max={100}
                            onChange={e => updateDiscount(idx, parseFloat(e.target.value) || 0)}
                            className="w-16 border border-gray-200 rounded-lg py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary-300"
                          />
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-800">
                          {fmtCurrency(item.quantity * item.unit_price * (1 - item.discount / 100))}
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: customer + payment + totals */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Customer */}
          <div className="card p-4">
            <label className="label text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <UserCheck size={13} />CLIENTE
            </label>
            {selectedCustomer ? (
              <div className="flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-primary-800">{selectedCustomer.name}</p>
                  <p className="text-xs text-primary-600">{selectedCustomer.phone}</p>
                </div>
                <button onClick={() => { setSelectedCustomer(null); setCustomerSearch('') }} className="text-primary-400 hover:text-primary-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  ref={customerInputRef}
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  onFocus={() => setCustomerFocus(true)}
                  onBlur={() => setTimeout(() => setCustomerFocus(false), 150)}
                  placeholder="Buscar cliente... (opcional)"
                  className="input pl-9 text-sm"
                />
                {filteredCustomers.length > 0 && customerFocus && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {filteredCustomers.map(c => (
                      <button key={c.id} onMouseDown={() => { setSelectedCustomer(c); setCustomerSearch(''); setCustomerFocus(false) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <p className="font-medium text-sm text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone} {c.veiculo ? `· ${c.veiculo}` : ''}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-4 space-y-3">
            <label className="label text-xs font-semibold uppercase tracking-wider">PAGAMENTO</label>
            <select value={payment} onChange={e => setPayment(e.target.value)} className="select text-sm">
              {PAYMENTS.map(p => <option key={p}>{p}</option>)}
            </select>

            <div>
              <label className="label text-xs">Desconto Global (%)</label>
              <input type="number" min={0} max={100} value={discountPct}
                onChange={e => setDiscountPct(parseFloat(e.target.value) || 0)}
                className="input text-sm" />
            </div>

            {payment === 'Dinheiro' && (
              <div>
                <label className="label text-xs">Valor Recebido (R$)</label>
                <input type="number" value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  className="input text-sm" placeholder="0,00" />
                {change > 0 && (
                  <p className="text-sm text-emerald-600 font-bold mt-1">
                    Troco: {fmtCurrency(change)}
                  </p>
                )}
              </div>
            )}

            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-blue-900">
                <input type="checkbox" checked={hasLabor} onChange={e => setHasLabor(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                Teve Mão de Obra?
              </label>
              {hasLabor && (
                <input type="number" min={0} step="0.01" value={laborValue}
                  onChange={e => setLaborValue(e.target.value)}
                  className="input text-sm border-blue-200 focus:ring-blue-500" placeholder="Valor R$ 0,00" />
              )}
            </div>

            <div>
              <label className="label text-xs">Observações</label>
              <textarea value={obs} onChange={e => setObs(e.target.value)}
                className="input resize-none h-16 text-sm" placeholder="Obs. da venda..." />
            </div>
          </div>

          {/* Total + button */}
          <div className="card p-5 space-y-3">
            {discountValue > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>{fmtCurrency(subtotal)}</span>
              </div>
            )}
            {discountValue > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Desconto ({discountPct}%)</span><span>-{fmtCurrency(discountValue)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-primary-600">{fmtCurrency(total)}</span>
            </div>
            <button
              onClick={handleFinish}
              disabled={finishing || cart.length === 0}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
              <CheckCircle size={20} />
              {finishing ? 'Finalizando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
