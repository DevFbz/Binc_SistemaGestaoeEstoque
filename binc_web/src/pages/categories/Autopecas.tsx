import { Wrench, ShoppingCart, BarChart3, FileText, Truck, Package } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Autopecas = () => (
  <CategoryPage
    title="Sistema para Autopeças"
    subtitle="Gestão de Estoque, Vendas e Mais"
    description="Assuma o volante com um sistema de autopeças eficiente que conecta você aos principais canais de e-commerce e marketplaces do mercado. Controle completo de estoque, vendas e financeiro."
    image="/cat-autopecas.png"
    stats={[
      { value: '5.000+', label: 'Lojas de autopeças' },
      { value: '99.9%', label: 'Uptime garantido' },
      { value: '+40%', label: 'Aumento em vendas' },
      { value: '2min', label: 'Emissão de NF-e' },
    ]}
    features={[
      { title: 'Controle de Caixa', icon: ShoppingCart, desc: 'Gerencie entradas e saídas com precisão. Fechamento de caixa rápido e seguro.' },
      { title: 'Emissão de NF-e e NFC-e', icon: FileText, desc: 'Emita notas fiscais eletrônicas de forma rápida e em conformidade com a legislação.' },
      { title: 'Gestão de Estoque', icon: Package, desc: 'Controle níveis mínimos, variantes, localização de peças e código de barras.' },
      { title: 'Cotação de Frete', icon: Truck, desc: 'Compare fretes de múltiplas transportadoras e escolha a melhor opção para seus clientes.' },
      { title: 'Relatórios Personalizados', icon: BarChart3, desc: 'Relatórios de vendas, financeiro e suprimentos personalizados para autopeças.' },
      { title: 'Ordens de Compra', icon: Wrench, desc: 'Crie e envie ordens diretamente aos fornecedores de autopeças.' },
    ]}
    benefits={[
      'Integração com Mercado Livre, Shopee e Amazon',
      'PDF intuitivo com leitor de código de barras',
      'Emissão de Pix e boleto para cobrança',
      'Devolução de vendas simplificada',
      'Transferência Pix e TED gratuitas',
      'Orçamentos para clientes direto no sistema',
      'Relatórios de performance de vendas',
      'Suporte especializado para autopeças',
    ]}
  />
);
