import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const plans = [
  {
    name: 'Avance', price: 'R$ 49', orig: 'R$ 59', period: '/mês',
    desc: 'Ideal para MEIs estruturando a gestão.',
    features: ['NF-e e NFC-e ilimitadas', 'Gestão de estoque', 'Cotação de frete', '2.000 anúncios', 'Pix grátis'],
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
  {
    name: 'Construa', price: 'R$ 129', orig: 'R$ 159', period: '/mês',
    desc: 'Para empresas do Simples Nacional crescendo.',
    features: ['Tudo do Avance', 'Consultoria de ativação', 'Multiempresa', 'Boletos e cobranças', 'Conciliação bancária'],
    btn: 'bg-gray-900 text-white shadow-xl', highlight: true,
  },
  {
    name: 'Impulsione', price: 'R$ 279', orig: 'R$ 349', period: '/mês',
    desc: 'Para gestão estruturada e expansão.',
    features: ['Tudo do Construa', 'Calculadora de preços', 'Planejamento de compras', 'E-commerce grátis', '10.000 anúncios'],
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
  {
    name: 'Domine', price: 'R$ 679', orig: 'R$ 849', period: '/mês',
    desc: 'Alta governança e estratégia fiscal.',
    features: ['Tudo do Impulsione', 'Suporte em 5 min', 'Gerente dedicado', '30 boletos grátis/mês', '20.000 anúncios'],
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
];

export const Planos = () => (
  <section className="pt-28 md:pt-36 pb-20 md:pb-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">Até 20% de desconto anual</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">Preços e vantagens</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 max-w-2xl mx-auto text-lg">Teste grátis por 30 dias. Sem cartão de crédito.</motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2rem] flex flex-col ${p.highlight ? 'bg-white border-2 border-blue-600 shadow-2xl relative' : 'bg-gray-50 border border-gray-100'}`}>
            {p.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase text-white shadow-lg">Mais Popular</div>}
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{p.name}</h3>
            <p className="text-gray-600 text-sm mb-6 min-h-[48px]">{p.desc}</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-bold text-gray-900">{p.price}</span>
              <span className="text-gray-400 line-through text-sm mb-1">{p.orig}</span>
              <span className="text-gray-500 text-sm mb-1">{p.period}</span>
            </div>
            <ul className="flex flex-col gap-3 mb-10 flex-1">
              {p.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" /><span>{f}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 group ${p.btn}`}>
              Experimentar Grátis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
