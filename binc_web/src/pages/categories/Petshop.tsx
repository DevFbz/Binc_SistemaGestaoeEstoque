import { Dog, Heart, BarChart3, Truck, Package, Syringe } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Petshop = () => (
  <CategoryPage
    title="Sistema para Petshop"
    subtitle="Rações, Acessórios e Cuidados Pet"
    description="Sistema completo para petshops. Gerencie rações por espécie e porte, acessórios, medicamentos veterinários e serviços de banho e tosa."
    image="/cat-petshop.png"
    stats={[
      { value: '3.200+', label: 'Petshops' },
      { value: '+55%', label: 'Eficiência operacional' },
      { value: '99.9%', label: 'Uptime' },
      { value: '24/7', label: 'Suporte' },
    ]}
    features={[
      { title: 'Catálogo Pet', icon: Dog, desc: 'Organize produtos por espécie, porte, raça e necessidade especial.' },
      { title: 'Fidelidade Pet', icon: Heart, desc: 'Programa de fidelidade para tutores com cashback e benefícios.' },
      { title: 'Vendas por Canal', icon: BarChart3, desc: 'Análise de vendas em loja física, marketplace e delivery.' },
      { title: 'Envios Pet', icon: Truck, desc: 'Frete otimizado para rações pesadas e produtos frágeis.' },
      { title: 'Estoque de Rações', icon: Package, desc: 'Controle de lotes, validade e peso para rações e suplementos.' },
      { title: 'Medicamentos', icon: Syringe, desc: 'Gestão de medicamentos veterinários com controle regulatório.' },
    ]}
    benefits={[
      'Catálogo por espécie e porte',
      'Controle de validade para rações',
      'Integração com marketplaces pet',
      'Gestão de banho e tosa',
      'Programa de fidelidade para tutores',
      'Controle de medicamentos',
      'Assinaturas recorrentes de ração',
      'CRM para clientes e pets',
    ]}
  />
);
