import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface CategoryFeature {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface CategoryPageProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: CategoryFeature[];
  benefits: string[];
  stats: { label: string; value: string }[];
}

export const CategoryPage = ({
  title,
  subtitle,
  description,
  image,
  features,
  benefits,
  stats,
}: CategoryPageProps) => {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                {subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                {description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/planos">
                  <button className="group flex items-center gap-3 bg-gray-900 text-white rounded-full px-8 py-4 font-semibold transition-all hover:shadow-xl cursor-pointer">
                    Teste Grátis 30 Dias
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/contato">
                  <button className="flex items-center gap-3 bg-gray-100 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all hover:bg-gray-200 cursor-pointer">
                    Fale Conosco
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-300/30 border border-gray-100">
                <img src={image} alt={title} className="w-full h-[360px] md:h-[480px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Funcionalidades do sistema
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tudo que você precisa para gerenciar seu negócio em um só lugar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{feat.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Por que escolher a Binc CMS?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100"
              >
                <CheckCircle2 size={22} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gray-900 p-12 md:p-20 rounded-[3rem] relative overflow-hidden shadow-2xl text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10 text-white tracking-tight">
            Comece a usar agora
          </h2>
          <p className="text-gray-400 mb-10 relative z-10 max-w-xl mx-auto">
            Teste todos os recursos gratuitamente por 30 dias. Sem cartão de crédito.
          </p>
          <Link to="/planos">
            <button className="relative z-10 px-10 py-5 rounded-full bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform shadow-xl cursor-pointer">
              Experimentar Grátis
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};
