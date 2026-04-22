import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Sobre } from './pages/Sobre';
import { Contato } from './pages/Contato';
import { Planos } from './pages/Planos';
import { Categorias } from './pages/Categorias';
import { Blog } from './pages/Blog';
import { Solucoes } from './pages/Solucoes';
import { ProdutoPage } from './pages/ProdutoPage';
import { Autopecas } from './pages/categories/Autopecas';
import { Moda } from './pages/categories/Moda';
import { CasaDecoracao } from './pages/categories/CasaDecoracao';
import { Construcao } from './pages/categories/Construcao';
import { Informatica } from './pages/categories/Informatica';
import { Beleza } from './pages/categories/Beleza';
import { Celular } from './pages/categories/Celular';
import { Cosmeticos } from './pages/categories/Cosmeticos';
import { Mercado } from './pages/categories/Mercado';
import { Petshop } from './pages/categories/Petshop';
import { Oficina } from './pages/categories/Oficina';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-500/20 font-sans relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/solucoes" element={<Solucoes />} />
          <Route path="/produtos/:slug" element={<ProdutoPage />} />
          {/* Category Pages */}
          <Route path="/categorias/autopecas" element={<Autopecas />} />
          <Route path="/categorias/moda" element={<Moda />} />
          <Route path="/categorias/casa-e-decoracao" element={<CasaDecoracao />} />
          <Route path="/categorias/construcao" element={<Construcao />} />
          <Route path="/categorias/informatica" element={<Informatica />} />
          <Route path="/categorias/beleza" element={<Beleza />} />
          <Route path="/categorias/celular" element={<Celular />} />
          <Route path="/categorias/cosmeticos" element={<Cosmeticos />} />
          <Route path="/categorias/mercado" element={<Mercado />} />
          <Route path="/categorias/petshop" element={<Petshop />} />
          <Route path="/categorias/oficina" element={<Oficina />} />
          {/* Fallback routes */}
          <Route path="/cases" element={<Sobre />} />
          <Route path="/faq" element={<Contato />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
