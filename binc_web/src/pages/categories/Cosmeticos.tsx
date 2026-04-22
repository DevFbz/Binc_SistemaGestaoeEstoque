import { Sparkles, Palette, BarChart3, Truck, Package, Heart } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Cosmeticos = () => (
  <CategoryPage
    title="Sistema para Cosméticos"
    subtitle="Maquiagem, Perfumaria e Cuidados"
    description="Sistema especializado para lojas de cosméticos e perfumaria. Controle de lotes ANVISA, validade e variações de tonalidade com precisão."
    image="/cat-cosmeticos.png"
    stats={[
      { value: '3.800+', label: 'Lojas de cosméticos' },
      { value: '+45%', label: 'Aumento de ticket médio' },
      { value: '99.9%', label: 'Uptime' },
      { value: '10+', label: 'Marketplaces' },
    ]}
    features={[
      { title: 'Tonalidades e Variações', icon: Palette, desc: 'Gerencie produtos com múltiplas tonalidades, tamanhos e fragrâncias.' },
      { title: 'Controle ANVISA', icon: Sparkles, desc: 'Gestão de registros ANVISA, lotes e validade obrigatória.' },
      { title: 'Análise de Vendas', icon: BarChart3, desc: 'Identifique os cosméticos mais vendidos e tendências de mercado.' },
      { title: 'Envios Especiais', icon: Truck, desc: 'Embalagens para líquidos e fragilidades com controle de temperatura.' },
      { title: 'Kits e Combos', icon: Package, desc: 'Monte kits promocionais e combos de presente com facilidade.' },
      { title: 'Fidelidade', icon: Heart, desc: 'Programa de pontos e cashback para clientes recorrentes.' },
    ]}
    benefits={[
      'Gestão de lotes e validade ANVISA',
      'Controle de tonalidades e variações',
      'Kits e combos promocionais',
      'Integração com marketplaces de beleza',
      'Programa de fidelidade',
      'CRM para clientes',
      'Precificação por canal',
      'Catálogo visual profissional',
    ]}
  />
);
