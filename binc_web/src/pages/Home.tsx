import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Store, Truck, Wallet, CheckCircle2, Play } from 'lucide-react';
import { ShinyText } from '../components/ShinyText';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Sistema ERP', icon: BarChart3, desc: 'Gestão completa com emissão de notas, estoque, financeiro e relatórios em tempo real.', path: '/produtos/erp' },
  { title: 'Hub de Integração', icon: Zap, desc: 'Conecte-se ao Mercado Livre, Shopee, Amazon e +15 marketplaces automaticamente.', path: '/produtos/hub' },
  { title: 'Sistema PDV', icon: Store, desc: 'PDV completo para loja física integrado ao ERP com leitor de código de barras.', path: '/produtos/pdv' },
  { title: 'Envios', icon: Truck, desc: 'Cotação de fretes com múltiplas transportadoras. Rastreio automático e etiquetas.', path: '/produtos/envios' },
  { title: 'Conta Digital', icon: Wallet, desc: 'Pix, boletos, link de pagamento, conciliação bancária e capital de giro digital.', path: '/produtos/conta-digital' },
];

const plans = [
  {
    name: 'Avance', price: 'R$ 49', originalPrice: 'R$ 59', period: '/mês',
    desc: 'Ideal para MEIs que querem estruturar a gestão.',
    features: ['NF-e e NFC-e ilimitadas', 'Gestão de estoque', 'Cotação de frete', '2.000 anúncios', 'Pix grátis'],
    buttonClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
  {
    name: 'Construa', price: 'R$ 129', originalPrice: 'R$ 159', period: '/mês',
    desc: 'Para empresas do Simples Nacional crescendo com controle.',
    features: ['Tudo do Avance', 'Consultoria de ativação', 'Multiempresa', 'Boletos e cobranças', 'Conciliação bancária'],
    buttonClass: 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:shadow-gray-900/30',
    highlight: true,
  },
  {
    name: 'Impulsione', price: 'R$ 279', originalPrice: 'R$ 349', period: '/mês',
    desc: 'Para empresas com foco em expansão e gestão estruturada.',
    features: ['Tudo do Construa', 'Calculadora de preços', 'Planejamento de compras', 'E-commerce grátis', '10.000 anúncios'],
    buttonClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
];

const testimonials = [
  { quote: 'O que eu gosto na Binc é que está tudo integrado, facilitando muito a minha vida.', name: 'Alexandre Sarti', role: 'Sunset Cosméticos' },
  { quote: 'Com o ERP Binc conseguimos maior organização do fluxo com tudo integrado.', name: 'Felipe Oliveira', role: 'Birden Clothing' },
  { quote: 'Hoje, cobranças e pagamentos são automáticos. É tudo muito prático.', name: 'Flávio Santos', role: 'Juff Sportswear' },
];

const categories = [
  { name: 'Moda', path: '/categorias/moda', img: '/cat-moda.png' },
  { name: 'Casa e Decoração', path: '/categorias/casa-e-decoracao', img: '/cat-casa.png' },
  { name: 'Autopeças', path: '/categorias/autopecas', img: '/cat-autopecas.png' },
  { name: 'Construção', path: '/categorias/construcao', img: '/cat-construcao.png' },
  { name: 'Informática', path: '/categorias/informatica', img: '/cat-informatica.png' },
  { name: 'Beleza', path: '/categorias/beleza', img: '/cat-beleza.png' },
  { name: 'Celular', path: '/categorias/celular', img: '/cat-celular.png' },
  { name: 'Cosméticos', path: '/categorias/cosmeticos', img: '/cat-cosmeticos.png' },
  { name: 'Mercado', path: '/categorias/mercado', img: '/cat-mercado.png' },
  { name: 'Petshop', path: '/categorias/petshop', img: '/cat-petshop.png' },
  { name: 'Oficina', path: '/categorias/oficina', img: '/cat-oficina.png' },
];

export const Home = () => {
  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 md:px-12">

          {/* Top info row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-32 md:pt-40">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/60 text-sm md:text-base max-w-md leading-relaxed"
            >
              Entregamos um sistema completo de gestão que empodera negócios com tecnologia de ponta, eficiência e visão para prosperar em escala.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/60 text-sm md:text-base lg:text-right"
            >
              60.000+ Negócios Acelerados !
            </motion.p>
          </div>

          {/* Main heading area */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/50 uppercase text-[10px] md:text-xs tracking-[0.25em] font-medium mb-8"
            >
              Teste Grátis por 30 Dias — Comece Agora
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.85]"
            >
              <span className="block text-white font-medium">Gestão</span>
              <ShinyText text="Inteligente." className="mt-1 md:mt-2" />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/planos">
                <button className="group flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 rounded-full px-8 py-4 font-semibold text-sm md:text-base transition-all shadow-2xl shadow-white/10 cursor-pointer">
                  Teste Grátis 30 Dias
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="group flex items-center justify-center gap-3 text-white/70 hover:text-white rounded-full px-6 py-4 font-medium text-sm transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <Play size={14} className="ml-0.5" />
                </div>
                Ver demonstração
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade into dashboard */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-20" />
      </section>

      {/* ── DASHBOARD MOCKUP ── */}
      <section className="relative z-30 -mt-32 md:-mt-40 px-4 md:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-200/80 p-1.5 md:p-3">
            <img
              src="/dashboard.png"
              alt="Binc CMS Dashboard — Sistema de gestão completo"
              className="w-full h-auto rounded-xl md:rounded-2xl"
            />
          </div>
          <div className="flex justify-center mt-8 gap-8 text-sm text-gray-400">
            <span>✓ Sem cartão de crédito</span>
            <span>✓ Setup em 5 minutos</span>
            <span className="hidden md:inline">✓ Cancele quando quiser</span>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4"
            >
              Ecossistema Completo
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900"
            >
              Tudo que seu negócio precisa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 max-w-2xl mx-auto text-lg"
            >
              Sistema de gestão, hub de integrações e conta digital numa plataforma unificada.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={feat.path}
                  className="block bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60 hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 group h-full"
                >
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-gray-700 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="bg-gray-950 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '60.000+', label: 'Negócios ativos' },
            { val: '99.9%', label: 'Uptime garantido' },
            { val: '15+', label: 'Marketplaces' },
            { val: '< 5min', label: 'Tempo de suporte' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{s.val}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Quem usa, recomenda
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col"
              >
                <div className="flex gap-1 mb-4 text-yellow-400">{'★★★★★'}</div>
                <p className="text-gray-600 leading-relaxed flex-1 mb-6 text-sm">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="bg-gray-50 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Soluções por Categoria
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Sistemas especializados para cada segmento do varejo.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={cat.path}
                  className="block rounded-2xl overflow-hidden group relative aspect-[4/3] bg-gray-200"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-white font-bold text-sm md:text-base">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="planos" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
              Até 20% de desconto no plano anual
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Planos que se adequam ao seu negócio
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`p-8 rounded-2xl flex flex-col ${
                  plan.highlight
                    ? 'bg-white border-2 border-gray-900 shadow-2xl scale-[1.03] relative z-10'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-full text-[10px] font-bold tracking-wider uppercase text-white">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6 min-h-[44px]">{plan.desc}</p>
                <div className="flex items-end gap-2 mb-8 text-gray-900">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 line-through text-sm mb-1">{plan.originalPrice}</span>
                  <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 rounded-xl font-bold transition-all cursor-pointer text-sm ${plan.buttonClass}`}>
                  Experimentar Grátis
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gray-950 p-12 md:p-20 rounded-3xl relative overflow-hidden shadow-2xl text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 text-white tracking-tight">
            Pronto para evoluir?
          </h2>
          <p className="text-gray-400 mb-10 relative z-10 max-w-xl mx-auto text-lg">
            Junte-se a milhares de empresas que confiam na Binc CMS.
          </p>
          <Link to="/planos">
            <button className="relative z-10 px-10 py-5 rounded-full bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform shadow-xl cursor-pointer">
              Comece seu Teste Grátis
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};
