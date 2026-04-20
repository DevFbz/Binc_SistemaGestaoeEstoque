import { Smartphone, Headphones, BarChart3, Truck, Shield, Package } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Celular = () => (
  <CategoryPage
    title="Sistema para Celular e Acessórios"
    subtitle="Smartphones, Cases e Periféricos"
    description="Sistema completo para lojas de celulares e acessórios. Controle de IMEI, garantias e integração com operadoras e marketplaces."
    image="/cat-celular.png"
    stats={[
      { value: '7.000+', label: 'Lojas de celular' },
      { value: '+70%', label: 'Velocidade de venda' },
      { value: '20+', label: 'Integrações' },
      { value: '2min', label: 'Emissão de NF-e' },
    ]}
    features={[
      { title: 'Controle de IMEI', icon: Smartphone, desc: 'Rastreie cada aparelho pelo IMEI com histórico completo de transações.' },
      { title: 'Acessórios Compatíveis', icon: Headphones, desc: 'Vincule acessórios compatíveis a cada modelo de smartphone.' },
      { title: 'Performance de Vendas', icon: BarChart3, desc: 'Relatórios detalhados de vendas por modelo, marca e faixa de preço.' },
      { title: 'Envios Seguros', icon: Truck, desc: 'Embalagens com proteção anti-impacto para eletrônicos.' },
      { title: 'Garantias', icon: Shield, desc: 'Gestão de garantias de fábrica e estendida integrada ao sistema.' },
      { title: 'Estoque por Modelo', icon: Package, desc: 'Organize estoque por marca, modelo, cor e capacidade de armazenamento.' },
    ]}
    benefits={[
      'Rastreamento por IMEI',
      'Gestão de garantias de fábrica',
      'Integração com marketplaces de tech',
      'Controle de acessórios por compatibilidade',
      'Emissão rápida de NF-e',
      'Gestão de assistência técnica',
      'Controle de consignação',
      'Relatórios de margem por marca',
    ]}
  />
);
