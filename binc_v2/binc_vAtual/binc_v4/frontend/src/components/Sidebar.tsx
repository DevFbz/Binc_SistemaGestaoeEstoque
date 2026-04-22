import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home, ShoppingCart, History, Package, Warehouse,
  Users, RotateCcw, BarChart2, Bot, UserCog, Settings,
  LogOut, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../store/auth'
import api from '../api/client'
import toast from 'react-hot-toast'
import { getInitials } from '../lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  adminOnly?: boolean
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { label: 'Início', path: '/', icon: <Home size={18} /> },
    ]
  },
  {
    title: 'Vendas',
    items: [
      { label: 'Nova Venda', path: '/nova-venda', icon: <ShoppingCart size={18} /> },
      { label: 'Histórico', path: '/historico', icon: <History size={18} /> },
    ]
  },
  {
    title: 'Inventário',
    items: [
      { label: 'Produtos', path: '/produtos', icon: <Package size={18} /> },
      { label: 'Estoque', path: '/estoque', icon: <Warehouse size={18} /> },
    ]
  },
  {
    title: 'Pessoas',
    items: [
      { label: 'Clientes', path: '/clientes', icon: <Users size={18} /> },
    ]
  },
  {
    title: 'Devoluções',
    items: [
      { label: 'Trocas & Dev.', path: '/trocas', icon: <RotateCcw size={18} /> },
    ]
  },
  {
    title: 'Análises',
    items: [
      { label: 'Relatórios', path: '/relatorios', icon: <BarChart2 size={18} /> },
    ]
  },
  {
    title: 'Inteligência',
    items: [
      { label: 'BincIA', path: '/binc-ia', icon: <Bot size={18} /> },
    ]
  },
]

const bottomItems: NavItem[] = [
  { label: 'Usuários', path: '/usuarios', icon: <UserCog size={18} />, adminOnly: true },
  { label: 'Configurações', path: '/configuracoes', icon: <Settings size={18} /> },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await api.post('/logout', {}, { baseURL: '/' })
    } catch { }
    logout()
    navigate('/login')
  }

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const NavButton = ({ item }: { item: NavItem }) => {
    if (item.adminOnly && user?.role !== 'admin') return null
    const active = isActive(item.path)
    const isBincIA = item.path === '/binc-ia'

    return (
      <button
        onClick={() => navigate(item.path)}
        className={
          active
            ? 'nav-item-active'
            : isBincIA
              ? 'nav-item hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700'
              : 'nav-item'
        }
      >
        <span className={isBincIA && !active ? 'text-purple-500' : ''}>{item.icon}</span>
        <span>{item.label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
      </button>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
            </svg>

          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">Binc</span>
            <span className="block text-[10px] text-gray-400 font-medium -mt-1">v4.0 · Sistema ERP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-4' : ''}>
            {section.title && (
              <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </div>
        ))}

        {/* Bottom items */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-0.5">
          {bottomItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : '??'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
