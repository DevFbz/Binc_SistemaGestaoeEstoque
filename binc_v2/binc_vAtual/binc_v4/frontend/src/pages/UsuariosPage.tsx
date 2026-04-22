import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, UserCheck, UserX, Shield, User as UserIcon } from 'lucide-react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import api from '../api/client'
import { getInitials, getRoleLabel } from '../lib/utils'
import toast from 'react-hot-toast'

const emptyForm = { username: '', password: '', name: '', role: 'operator', active: true }

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const load = () => api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (u: any) => { setEditing(u); setForm({ ...emptyForm, ...u, password: '' }); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.name || !form.username) { toast.error('Preencha nome e login'); return }
    if (!editing && !form.password) { toast.error('Preencha a senha'); return }
    setSaving(true)
    try {
      if (editing) await api.put(`/users/${editing.id}`, form)
      else await api.post('/users', form)
      toast.success(editing ? 'Usuário atualizado!' : 'Usuário criado!')
      setModalOpen(false); load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setSaving(false) }
  }

  const handleToggle = async (id: string) => {
    await api.patch(`/users/${id}/toggle`)
    load()
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await api.delete(`/users/${confirmDelete}`)
      toast.success('Usuário excluído')
      load()
    } catch (e: any) { toast.error(e.response?.data?.detail || 'Erro') }
    finally { setConfirmDelete(null) }
  }

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="animate-fade-in">
      <Header title="Usuários" subtitle="Gerencie os usuários e permissões de acesso" />
      <div className="p-8 space-y-5">
        <div className="flex justify-end">
          <button onClick={openAdd} className="btn-primary"><Plus size={16} />Novo Usuário</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="card h-36 animate-pulse bg-gray-100" />)
          ) : users.map(u => (
            <div key={u.id} className={`card p-5 ${!u.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'admin' ? 'bg-gradient-to-br from-primary-400 to-primary-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500 font-mono">@{u.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(u)} className="btn-ghost p-1.5"><Edit3 size={14} /></button>
                  <button onClick={() => setConfirmDelete(u.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`badge ${u.role === 'admin' ? 'bg-primary-50 text-primary-700' : 'badge-blue'} flex items-center gap-1`}>
                  {u.role === 'admin' ? <Shield size={11} /> : <UserIcon size={11} />}
                  {getRoleLabel(u.role)}
                </span>
                <button onClick={() => handleToggle(u.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${u.active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {u.active ? <><UserCheck size={12} />Ativo</> : <><UserX size={12} />Inativo</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Usuário' : 'Novo Usuário'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }>
        <div className="space-y-4">
          <div>
            <label className="label">Nome completo *</label>
            <input value={form.name} onChange={e => F('name', e.target.value)} className="input" placeholder="João Silva" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Login *</label>
              <input value={form.username} onChange={e => F('username', e.target.value)} className="input" placeholder="joao.silva" disabled={!!editing} />
            </div>
            <div>
              <label className="label">Senha {editing ? '(deixe em branco p/ manter)' : '*'}</label>
              <input type="password" value={form.password} onChange={e => F('password', e.target.value)} className="input" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="label">Perfil</label>
            <select value={form.role} onChange={e => F('role', e.target.value)} className="select">
              <option value="operator">Operador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Excluir Usuário" message="O usuário será removido permanentemente."
        confirmText="Excluir" danger onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
    </div>
  )
}
