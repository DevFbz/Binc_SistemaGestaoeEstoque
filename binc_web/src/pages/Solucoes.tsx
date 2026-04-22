import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Zap, Store, Truck, Wallet, ShoppingBag } from 'lucide-react';

const solutions = [
  { title: 'Sistema ERP', icon: BarChart3, desc: 'Gestão completa com emissão de notas, estoque, financeiro e relatórios.', path: '/produtos/erp' },
  { title: 'Hub de Integração', icon: Zap, desc: 'Conecte-se a +15 marketplaces e gerencie tudo de um só lugar.', path: '/produtos/hub' },
  { title: 'Sistema PDV', icon: Store, desc: 'Ponto de venda para loja física integrado ao ERP.', path: '/produtos/pdv' },
  { title: 'Envios', icon: Truck, desc: 'Cotação de fretes e envios com economia e rastreio.', path: '/produtos/envios' },
  { title: 'Conta Digital', icon: Wallet, desc: 'Pagamentos, cobranças e conciliação bancária integrados.', path: '/produtos/conta-digital' },
  { title: 'E-commerce', icon: ShoppingBag, desc: 'Crie sua loja virtual exclusiva integrada ao ecossistema.', path: '/produtos/ecommerce' },
];

export const Solucoes = () => (
  <section className="pt-28 md:pt-36 pb-20 md:pb-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">Nossas Soluções</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 max-w-2xl mx-auto text-lg">Um ecossistema completo de ferramentas para transformar sua operação.</motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <Link to={s.path} className="block bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:-translate-y-1 transition-all group h-full">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <s.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{s.desc}</p>
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Saiba mais <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
