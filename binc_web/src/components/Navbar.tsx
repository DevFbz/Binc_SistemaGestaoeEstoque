import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Soluções', path: '/solucoes' },
  { name: 'Categorias', path: '/categorias' },
  { name: 'Planos', path: '/planos' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Blog', path: '/blog' },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 md:px-8">
        <div className="max-w-7xl w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${isHome ? 'border-white/80' : 'border-gray-800'}`}>
              <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${isHome ? 'bg-white' : 'bg-gray-800'}`} />
            </div>
            <span className={`font-bold tracking-tight text-xl transition-colors duration-300 ${isHome ? 'text-white' : 'text-gray-900'}`}>
              Binc CMS
            </span>
          </Link>

          {/* Desktop Nav Pill */}
          <div className={`hidden lg:flex items-center gap-0.5 px-2 py-1.5 rounded-full border transition-all duration-300 ${
            isHome
              ? 'border-white/20 bg-black/30 backdrop-blur-xl'
              : 'border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  isHome
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contato"
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ml-1 ${
                isHome
                  ? 'text-black bg-white hover:bg-gray-100'
                  : 'text-white bg-gray-900 hover:bg-gray-800'
              }`}
            >
              Contato <ArrowRight size={14} />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2.5 rounded-xl transition-colors ${
              isHome ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-4 top-20 z-40 bg-gray-950/95 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/80 hover:text-white text-base font-medium py-3 px-5 rounded-2xl hover:bg-white/5 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contato"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-black bg-white text-base font-semibold py-3 px-5 rounded-2xl mt-2 transition-all text-center justify-center"
              >
                Contato <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
