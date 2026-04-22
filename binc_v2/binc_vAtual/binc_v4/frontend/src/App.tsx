import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import NovaVendaPage from './pages/NovaVendaPage'
import HistoricoPage from './pages/HistoricoPage'
import ProdutosPage from './pages/ProdutosPage'
import EstoquePage from './pages/EstoquePage'
import ClientesPage from './pages/ClientesPage'
import TrocasPage from './pages/TrocasPage'
import RelatoriosPage from './pages/RelatoriosPage'
import BincIAPage from './pages/BincIAPage'
import UsuariosPage from './pages/UsuariosPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="nova-venda" element={<NovaVendaPage />} />
          <Route path="historico" element={<HistoricoPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="estoque" element={<EstoquePage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="trocas" element={<TrocasPage />} />
          <Route path="relatorios" element={<RelatoriosPage />} />
          <Route path="binc-ia" element={<BincIAPage />} />
          <Route path="usuarios" element={
            <RequireAdmin><UsuariosPage /></RequireAdmin>
          } />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
