import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const posts = [
  { title: 'Como escolher o melhor sistema ERP para sua loja', date: '15 Abr 2026', tag: 'ERP', excerpt: 'Um guia completo para entender as funcionalidades essenciais de um ERP e como escolher o melhor para o seu negócio.' },
  { title: '5 estratégias para vender mais em marketplaces', date: '12 Abr 2026', tag: 'Vendas', excerpt: 'Descubra as melhores práticas para aumentar suas vendas no Mercado Livre, Shopee e Amazon.' },
  { title: 'Gestão de estoque: erros comuns e como evitá-los', date: '08 Abr 2026', tag: 'Estoque', excerpt: 'Os 7 erros mais comuns na gestão de estoque e como um sistema pode resolver cada um deles.' },
  { title: 'NF-e e NFC-e: tudo o que você precisa saber', date: '05 Abr 2026', tag: 'Fiscal', excerpt: 'Entenda as diferenças entre NF-e e NFC-e e quando emitir cada uma no seu negócio.' },
  { title: 'Como integrar sua loja física com marketplaces', date: '01 Abr 2026', tag: 'Integração', excerpt: 'Passo a passo para conectar sua loja física aos maiores marketplaces do Brasil.' },
  { title: 'Reforma tributária 2026: o que muda para o varejo', date: '28 Mar 2026', tag: 'Fiscal', excerpt: 'As principais mudanças da reforma tributária e como preparar seu negócio.' },
];

export const Blog = () => (
  <section className="pt-28 md:pt-36 pb-20 md:pb-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">Blog</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 max-w-2xl mx-auto text-lg">Insights sobre varejo, vendas e gestão para impulsionar seu negócio.</motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.article key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{post.tag}</span>
              <span className="text-gray-400 text-xs">{post.date}</span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">{post.excerpt}</p>
            <Link to="#" className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Ler artigo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
