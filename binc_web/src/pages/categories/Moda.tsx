import { Shirt, Palette, BarChart3, Tags, Truck, Users } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Moda = () => (
  <CategoryPage
    title="Sistema para Moda"
    subtitle="Roupas, Calçados e Acessórios"
    description="Gerencie sua loja de moda com um sistema que entende grades, variações de tamanho e cor, e integra com os maiores marketplaces de moda do Brasil."
    image="/cat-moda.png"
    stats={[
      { value: '8.000+', label: 'Lojas de moda' },
      { value: '15+', label: 'Marketplaces integrados' },
      { value: '+55%', label: 'Eficiência operacional' },
      { value: '24/7', label: 'Suporte disponível' },
    ]}
    features={[
      { title: 'Grades de Produto', icon: Shirt, desc: 'Gerencie grades de tamanho e cor com facilidade. Controle cada variante separadamente.' },
      { title: 'Catálogo Visual', icon: Palette, desc: 'Organize seu catálogo com fotos de alta qualidade e descrições otimizadas para marketplace.' },
      { title: 'Analytics de Moda', icon: BarChart3, desc: 'Identifique tendências de vendas, produtos mais vendidos e sazonalidade.' },
      { title: 'Etiquetas e Tags', icon: Tags, desc: 'Gere etiquetas de preço e códigos de barras para toda a sua coleção.' },
      { title: 'Envios Otimizados', icon: Truck, desc: 'Cotação automática de frete com embalagens especiais para roupas.' },
      { title: 'Gestão de Vendedores', icon: Users, desc: 'Controle comissões e metas de vendedores da sua loja.' },
    ]}
    benefits={[
      'Controle de grades (tamanho, cor, estilo)',
      'Integração com Shopee, Mercado Livre e Shein',
      'Gestão de coleções e temporadas',
      'Fotos e descrições otimizadas para SEO',
      'Controle de trocas e devoluções',
      'Precificação inteligente por canal',
      'Relatórios de margem por produto',
      'Suporte especializado para moda',
    ]}
  />
);
