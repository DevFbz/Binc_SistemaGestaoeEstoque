import { Sparkles, Heart, BarChart3, Truck, Package, Users } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Beleza = () => (
  <CategoryPage
    title="Sistema para Beleza"
    subtitle="Cuidados Pessoais e Bem-Estar"
    description="Sistema especializado para lojas de beleza e cuidados pessoais. Gerencie produtos com validade, lotes e variações com eficiência."
    image="/cat-beleza.png"
    stats={[
      { value: '4.500+', label: 'Lojas de beleza' },
      { value: '+50%', label: 'Aumento de vendas' },
      { value: '99.9%', label: 'Uptime' },
      { value: '24/7', label: 'Suporte' },
    ]}
    features={[
      { title: 'Catálogo de Beleza', icon: Sparkles, desc: 'Organize seus produtos por linha, fragrância, tipo de pele e benefícios.' },
      { title: 'Fidelidade', icon: Heart, desc: 'Programa de fidelidade integrado para reter clientes recorrentes.' },
      { title: 'Vendas por Canal', icon: BarChart3, desc: 'Análise detalhada de vendas por marketplace, loja física e e-commerce.' },
      { title: 'Envios Cuidadosos', icon: Truck, desc: 'Embalagens especiais para cosméticos com controle de temperatura.' },
      { title: 'Lotes e Validade', icon: Package, desc: 'Controle rigoroso de lotes, validade e ANVISA para produtos de beleza.' },
      { title: 'Base de Clientes', icon: Users, desc: 'CRM integrado para entender o perfil de compra dos seus clientes.' },
    ]}
    benefits={[
      'Controle de lotes e validade (ANVISA)',
      'Programa de fidelidade integrado',
      'Integração com marketplaces de beleza',
      'CRM para clientes recorrentes',
      'Gestão de amostras e kits',
      'Precificação por canal de venda',
      'Relatórios de sazonalidade',
      'Catálogo visual com fotos HD',
    ]}
  />
);
