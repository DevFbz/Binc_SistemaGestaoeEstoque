import { Hammer, Ruler, BarChart3, Truck, Package, FileText } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Construcao = () => (
  <CategoryPage
    title="Sistema para Construção"
    subtitle="Materiais de Construção e Reforma"
    description="Sistema especializado para lojas de materiais de construção. Gerencie milhares de SKUs, controle estoque pesado e atenda construtoras com eficiência."
    image="/cat-construcao.png"
    stats={[
      { value: '4.200+', label: 'Lojas de construção' },
      { value: '50k+', label: 'SKUs gerenciados' },
      { value: '+45%', label: 'Produtividade' },
      { value: '5min', label: 'Orçamento completo' },
    ]}
    features={[
      { title: 'Orçamentos Rápidos', icon: Hammer, desc: 'Crie orçamentos detalhados para obras e reformas com cálculo automático de materiais.' },
      { title: 'Cálculo de Materiais', icon: Ruler, desc: 'Calculadora integrada de materiais por m² para tintas, pisos, revestimentos.' },
      { title: 'Gestão de Vendas', icon: BarChart3, desc: 'Acompanhe vendas por vendedor, comissões e metas de equipe.' },
      { title: 'Logística Pesada', icon: Truck, desc: 'Gestão de entregas de materiais pesados com agendamento e roteirização.' },
      { title: 'Estoque por Lote', icon: Package, desc: 'Controle de estoque por lote, localização e unidade de medida.' },
      { title: 'Fiscal Completo', icon: FileText, desc: 'Emissão de NF-e, NFC-e com tributação correta para materiais de construção.' },
    ]}
    benefits={[
      'Gestão de milhares de SKUs',
      'Calculadora de materiais integrada',
      'Orçamentos para construtoras',
      'Controle de entregas pesadas',
      'Integração com marketplaces',
      'Gestão de vendedores e comissões',
      'Relatórios de margem por categoria',
      'Controle fiscal completo',
    ]}
  />
);
