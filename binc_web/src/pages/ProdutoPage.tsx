import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BarChart3, Zap, Store, Truck, Wallet, ShoppingBag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProductInfo {
  title: string;
  subtitle: string;
  desc: string;
  icon: LucideIcon;
  features: string[];
}

const products: Record<string, ProductInfo> = {
  erp: {
    title: 'Sistema ERP', subtitle: 'Gestão com controle, eficiência e escala', icon: BarChart3,
    desc: 'O coração da sua operação. Controle estoque, emita notas fiscais, gerencie financeiro e acompanhe relatórios detalhados em tempo real.',
    features: ['Emissão de NF-e, NFC-e e NFS-e ilimitadas', 'Gestão de estoque com código de barras', 'Controle financeiro completo', 'Ordens de compra para fornecedores', 'Relatórios gerenciais personalizados', 'Gestão de vendedores e comissões', 'Multiempresa', 'Separação e expedição'],
  },
  hub: {
    title: 'Hub de Integração', subtitle: 'Integração com marketplaces e canais', icon: Zap,
    desc: 'Conecte-se aos maiores marketplaces do Brasil em um só lugar. Sincronize estoque, preços e pedidos automaticamente.',
    features: ['Mercado Livre, Shopee, Amazon', 'Sincronização de estoque em tempo real', 'Importação automática de pedidos', 'Gestão de anúncios centralizada', 'Precificação por canal', 'Até 20.000 anúncios', 'TikTok Shop integrado', 'Relatórios por marketplace'],
  },
  pdv: {
    title: 'Sistema PDV', subtitle: 'PDV para loja física integrado ao ERP', icon: Store,
    desc: 'Ponto de venda ágil e moderno para sua loja física, completamente integrado ao ERP na nuvem.',
    features: ['Leitor de código de barras', 'Emissão de NFC-e automática', 'Controle de caixa', 'Multiadquirente', 'Gestão de vendedores', 'Integração com balança', 'Troca e devolução simplificada', 'Desconto e promoções'],
  },
  envios: {
    title: 'Envios', subtitle: 'Fretes com economia, rápido e eficiente', icon: Truck,
    desc: 'Cotação de fretes com múltiplas transportadoras. Encontre o melhor preço e prazo para seus envios.',
    features: ['Cotação com múltiplas transportadoras', 'Etiquetas de envio integradas', 'Rastreio automático', 'Créditos de envio', 'Tabela de fretes otimizada', 'Integração com Correios', 'Logística reversa', 'Relatórios de envio'],
  },
  'conta-digital': {
    title: 'Conta Digital', subtitle: 'Pagamentos e gestão financeira integrados', icon: Wallet,
    desc: 'Capital de giro, Pix, boletos, link de pagamento e maquininha no celular. Tudo integrado ao seu ERP.',
    features: ['Transferência Pix grátis', 'Emissão de boletos', 'Link de pagamento', 'Maquininha no celular', 'Conciliação bancária automática', 'Capital de giro rápido', 'Pix QR Code e Copia e Cola', 'Relatórios financeiros'],
  },
  ecommerce: {
    title: 'E-commerce', subtitle: 'Sua loja virtual exclusiva', icon: ShoppingBag,
    desc: 'Crie uma loja virtual exclusiva para sua marca, totalmente integrada ao ecossistema Binc CMS.',
    features: ['Loja virtual personalizada', 'Integração total com ERP', 'Checkout otimizado', 'SEO integrado', 'Temas responsivos', 'Gestão de produtos centralizada', 'Pagamentos integrados', 'Relatórios de conversão'],
  },
};

export const ProdutoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products[slug || 'erp'];
  if (!product) return <div className="pt-40 text-center text-gray-600">Produto não encontrado.</div>;

  return (
    <section className="pt-28 md:pt-36 pb-20 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
            <product.icon size={32} />
          </div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">{product.subtitle}</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">{product.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{product.desc}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="text-center">
          <Link to="/planos">
            <button className="group inline-flex items-center gap-3 bg-gray-900 text-white rounded-full px-8 py-4 font-semibold transition-all hover:shadow-xl cursor-pointer">
              Ver Planos e Preços <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
