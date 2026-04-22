import { motion } from 'framer-motion';
import { Users, Target, Globe, Award } from 'lucide-react';

const values = [
  { icon: Users, title: 'Pessoas Primeiro', desc: 'Construímos tecnologia que empodera empreendedores brasileiros a crescerem seus negócios.' },
  { icon: Target, title: 'Foco no Resultado', desc: 'Cada funcionalidade é desenhada para gerar impacto direto nas vendas e eficiência.' },
  { icon: Globe, title: 'Escala Nacional', desc: 'Atendemos mais de 60.000 negócios em todo o Brasil com infraestrutura robusta.' },
  { icon: Award, title: 'Excelência Técnica', desc: '99.9% de uptime, suporte em menos de 5 minutos e integração com +15 marketplaces.' },
];

const timeline = [
  { year: '2020', event: 'Fundação da Binc CMS com foco em gestão de estoque.' },
  { year: '2021', event: 'Lançamento do Hub de Integração com marketplaces.' },
  { year: '2022', event: 'Conta Digital integrada ao ERP. 10.000 clientes ativos.' },
  { year: '2023', event: 'Sistema PDV para lojas físicas. Expansão nacional.' },
  { year: '2024', event: 'Plataforma de E-commerce própria. 40.000 clientes.' },
  { year: '2025', event: 'Agentes de IA para automação. 60.000+ clientes.' },
];

export const Sobre = () => {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4"
          >
            Sobre a Binc CMS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900"
          >
            A parceira do empreendedor brasileiro
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Nascemos com a missão de democratizar o acesso à tecnologia de gestão para
            negócios de todos os portes. Do MEI à grande empresa, oferecemos as ferramentas
            que seu negócio precisa para prosperar.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-gray-900 text-center">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <v.icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-gray-900 text-center">
            Nossa Trajetória
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-8 mb-10 relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm shrink-0 relative z-10">
                  {t.year}
                </div>
                <div className="pt-4">
                  <p className="text-gray-700 leading-relaxed">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
