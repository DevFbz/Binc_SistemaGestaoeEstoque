import { Monitor, Cpu, BarChart3, Truck, Package, Shield } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Informatica = () => (
  <CategoryPage
    title="Sistema para Informática"
    subtitle="Computadores, Periféricos e Componentes"
    description="Sistema completo para lojas de informática. Gerencie componentes, periféricos e serviços de assistência técnica com controle de número de série."
    image="/cat-informatica.png"
    stats={[
      { value: '6.000+', label: 'Lojas de informática' },
      { value: '99.9%', label: 'Uptime garantido' },
      { value: '+60%', label: 'Velocidade de vendas' },
      { value: '15+', label: 'Marketplaces' },
    ]}
    features={[
      { title: 'Controle por Série', icon: Monitor, desc: 'Rastreie cada produto pelo número de série para garantia e assistência técnica.' },
      { title: 'Compatibilidade', icon: Cpu, desc: 'Gerencie compatibilidade entre componentes (socket, memória, placa-mãe).' },
      { title: 'Analytics de Tech', icon: BarChart3, desc: 'Identifique tendências de mercado e produtos mais procurados.' },
      { title: 'Envios Seguros', icon: Truck, desc: 'Embalagens especiais para componentes eletrônicos com seguro.' },
      { title: 'Estoque Serializado', icon: Package, desc: 'Controle de estoque com número de série, IMEI e garantia.' },
      { title: 'Garantia Integrada', icon: Shield, desc: 'Gestão de garantias e assistência técnica integrada ao sistema.' },
    ]}
    benefits={[
      'Rastreamento por número de série',
      'Gestão de assistência técnica',
      'Integração com marketplaces de tech',
      'Controle de garantias',
      'Emissão automática de NF-e',
      'Catálogo com especificações técnicas',
      'Gestão de componentes e compatibilidade',
      'Relatórios de margem por categoria',
    ]}
  />
);
