import { Sofa, Ruler, BarChart3, Truck, Package, FileText } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const CasaDecoracao = () => (
  <CategoryPage
    title="Sistema para Casa e Decoração"
    subtitle="Móveis, Decoração e Utilidades"
    description="Sistema completo para lojas de casa e decoração. Gerencie produtos de grande porte, montagem e entregas especiais com eficiência."
    image="/cat-casa.png"
    stats={[
      { value: '3.500+', label: 'Lojas de decoração' },
      { value: '99.9%', label: 'Uptime garantido' },
      { value: '+35%', label: 'Redução de erros' },
      { value: '10+', label: 'Integrações de frete' },
    ]}
    features={[
      { title: 'Catálogo de Móveis', icon: Sofa, desc: 'Gerencie produtos de grande porte com dimensões, peso e materiais detalhados.' },
      { title: 'Cálculo Dimensional', icon: Ruler, desc: 'Cálculo automático de frete considerando peso e dimensões de móveis e objetos.' },
      { title: 'Relatórios Detalhados', icon: BarChart3, desc: 'Análise de vendas por categoria, margem e sazonalidade.' },
      { title: 'Logística Especial', icon: Truck, desc: 'Gestão de entregas de produtos grandes com agendamento e montagem.' },
      { title: 'Controle de Estoque', icon: Package, desc: 'Gerencie estoque por localização, lote e validade de produtos.' },
      { title: 'NF-e Automática', icon: FileText, desc: 'Emissão automática de notas fiscais com CFOP correto para decoração.' },
    ]}
    benefits={[
      'Gestão de produtos de grande porte',
      'Frete calculado por dimensões',
      'Integração com marketplaces de casa e decoração',
      'Controle de montagem e instalação',
      'Orçamentos personalizados para projetos',
      'Gestão de showroom e loja física',
      'Catálogo digital para compartilhar com clientes',
      'Controle de pedidos sob encomenda',
    ]}
  />
);
