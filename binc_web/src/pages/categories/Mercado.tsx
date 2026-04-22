import { ShoppingBasket, Apple, BarChart3, Truck, Package, Scale } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Mercado = () => (
  <CategoryPage
    title="Sistema para Mercado"
    subtitle="Supermercados, Mercearias e Hortifrútis"
    description="Sistema completo para mercados e supermercados. Controle de perecíveis, validade, pesagem e operação de caixa rápido."
    image="/cat-mercado.png"
    stats={[
      { value: '2.500+', label: 'Mercados e mercearias' },
      { value: '99.9%', label: 'Uptime do PDV' },
      { value: '+30%', label: 'Redução de perdas' },
      { value: '3s', label: 'Tempo por item no caixa' },
    ]}
    features={[
      { title: 'PDV Rápido', icon: ShoppingBasket, desc: 'Ponto de venda otimizado para alto volume com leitor de código de barras.' },
      { title: 'Perecíveis', icon: Apple, desc: 'Controle de validade, FIFO automático e alertas de vencimento.' },
      { title: 'Relatórios de Perdas', icon: BarChart3, desc: 'Identifique produtos com maior perda e otimize seus pedidos.' },
      { title: 'Logística de Entrega', icon: Truck, desc: 'Gestão de entregas para delivery e pedidos online.' },
      { title: 'Estoque por Unidade', icon: Package, desc: 'Controle por unidade, peso, litro e embalagem fracionada.' },
      { title: 'Balança Integrada', icon: Scale, desc: 'Integração com balanças comerciais e impressão de etiquetas.' },
    ]}
    benefits={[
      'PDV ultra-rápido com leitor de barras',
      'Controle de perecíveis e validade',
      'Integração com balanças comerciais',
      'Gestão de delivery integrada',
      'Controle FIFO automático',
      'Alertas de reposição de estoque',
      'NFC-e automática',
      'Relatórios de perdas e quebras',
    ]}
  />
);
