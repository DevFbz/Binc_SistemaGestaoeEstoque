import { useEffect, useState } from 'react'
import { Plus, Search, Edit3, Trash2, Eye, ShoppingBag } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import api from '../api/client'
import { fmtCurrency, fmtDate } from '../lib/utils'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '', cpf_cnpj: '', phone: '', email: '', address: '', veiculo: '', placa: ''
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [historyModal, setHistoryModal] = useState<any>(null)
  const [history, setHistory] = useState<any>(null)

  const load = () => api.get('/customers').then(r => { setCustomers(r.data); setFiltered(r.data) }).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  useEffect(() => {
    const ql = q.toLowerCase()
    setFiltered(q ? customers.filter(c =>
      c.name.toLowerCase().includes(ql) ||
      (c.phone || '').toLowerCase().includes(ql) ||
      (c.placa || '').toLowerCase().includes(ql)
    ) : customers)
  }, [q, customers])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (c: any) => { setEditing(c); setForm({ ...emptyForm, ...c }); setModalOpen(true) }

  const viewHistory = async (c: any) => {
    setHistoryModal(c)
    setHistory(null)
    const res = await api.get(`/customers/${c.id}/history`)
    setHistory(res.data)
  }

  const handleSave = async () => {
    if (!form.name) { toast.error('Nome é obrigatório'); return }
    setSaving(true)
    try {
      if (editing) await api.put(`/customers/${editing.id}`, form)
      else await api.post('/customers', form)
      toast.success(editing ? 'Cliente atualizado!' : 'Cliente adicionado!')
      setModalOpen(false)
      load()
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.delete(`/customers/${confirmDelete}`)
      toast.success('Cliente excluído!')
      load()
    } catch { toast.error('Erro ao excluir') } finally { setConfirmDelete(null) }
  }

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="animate-fade-in">
      <Header title="Clientes" subtitle="Gerencie sua base de clientes" />
      <div className="p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome, telefone ou placa..." className="input pl-9" />
          </div>
          <button onClick={openAdd} className="btn-primary ml-auto"><Plus size={16} />Novo Cliente</button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Nome</th>
                  <th className="table-header">Telefone</th>
                  <th className="table-header">Veículo</th>
                  <th className="table-header">Placa</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-12">Carregando...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-12">Nenhum cliente encontrado</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell font-medium">{c.name}</td>
                    <td className="table-cell text-gray-500">{c.phone || '—'}</td>
                    <td className="table-cell text-gray-500">{c.veiculo || '—'}</td>
                    <td className="table-cell">
                      {c.placa ? <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{c.placa}</span> : '—'}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button onClick={() => viewHistory(c)} className="btn-ghost py-1 px-2 text-xs text-blue-600 hover:bg-blue-50"><Eye size={14} /></button>
                        <button onClick={() => openEdit(c)} className="btn-ghost py-1 px-2 text-xs"><Edit3 size={14} /></button>
                        <button onClick={() => setConfirmDelete(c.id)} className="btn-ghost py-1 px-2 text-xs text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} cliente(s)</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nome *</label>
            <input value={form.name} onChange={e => F('name', e.target.value)} className="input" placeholder="Nome completo" />
          </div>
          <div>
            <label className="label">CPF/CNPJ</label>
            <input value={form.cpf_cnpj} onChange={e => F('cpf_cnpj', e.target.value)} className="input" placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input value={form.phone} onChange={e => F('phone', e.target.value)} className="input" placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="label">Email</label>
            <input value={form.email} onChange={e => F('email', e.target.value)} className="input" placeholder="email@exemplo.com" type="email" />
          </div>
          <div>
            <label className="label">Endereço</label>
            <input value={form.address} onChange={e => F('address', e.target.value)} className="input" placeholder="Rua, número, bairro" />
          </div>
          <div>
            <label className="label">Veículo</label>
            <input value={form.veiculo} onChange={e => F('veiculo', e.target.value)} className="input" placeholder="Honda Civic 2020" />
          </div>
          <div>
            <label className="label">Placa</label>
            <input value={form.placa} onChange={e => F('placa', e.target.value.toUpperCase())} className="input font-mono" placeholder="ABC-1234" maxLength={8} />
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal open={!!historyModal} onClose={() => setHistoryModal(null)} title={`Histórico — ${historyModal?.name}`} size="lg">
        {!history ? (
          <p className="text-center text-gray-400 py-8">Carregando...</p>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-4">
              <ShoppingBag size={24} className="text-primary-500" />
              <div>
                <p className="text-sm text-gray-500">Total gasto</p>
                <p className="text-xl font-bold text-primary-600">{fmtCurrency(history.total_spent)}</p>
              </div>
              <div className="ml-auto">
                <p className="text-sm text-gray-500">Compras</p>
                <p className="text-xl font-bold text-gray-800">{history.sales.length}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr>
                  <th className="table-header">Data</th>
                  <th className="table-header">Itens</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Status</th>
                </tr></thead>
                <tbody>
                  {history.sales.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-6">Sem vendas</td></tr>
                  ) : history.sales.map((s: any) => (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">{fmtDate(s.date)}</td>
                      <td className="table-cell">{s.items?.length ?? 0}</td>
                      <td className="table-cell font-semibold">{fmtCurrency(s.total)}</td>
                      <td className="table-cell"><span className={`badge ${s.status === 'concluida' ? 'badge-green' : 'badge-red'}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Excluir Cliente" message="O cliente será removido permanentemente." confirmText="Excluir" danger onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}
