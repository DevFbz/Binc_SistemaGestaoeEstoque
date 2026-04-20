import { Wrench, Car, BarChart3, FileText, Package, Users } from 'lucide-react';
import { CategoryPage } from '../CategoryPage';

export const Oficina = () => (
  <CategoryPage
    title="Sistema para Oficina Mecânica"
    subtitle="Serviços Automotivos e Manutenção"
    description="Sistema completo para oficinas mecânicas. Gerencie ordens de serviço, peças, mão de obra e histórico de veículos em um só lugar."
    image="/cat-oficina.png"
    stats={[
      { value: '2.800+', label: 'Oficinas mecânicas' },
      { value: '+40%', label: 'Produtividade' },
      { value: '99.9%', label: 'Uptime' },
      { value: '5min', label: 'Orçamento completo' },
    ]}
    features={[
      { title: 'Ordens de Serviço', icon: Wrench, desc: 'Crie OS detalhadas com peças, mão de obra, tempo estimado e observações.' },
      { title: 'Histórico de Veículos', icon: Car, desc: 'Mantenha o histórico completo de serviços por veículo e placa.' },
      { title: 'Gestão Financeira', icon: BarChart3, desc: 'Controle de receitas por tipo de serviço, mecânico e período.' },
      { title: 'NF-e de Serviço', icon: FileText, desc: 'Emissão de NFS-e e NF-e para peças com CFOP correto.' },
      { title: 'Estoque de Peças', icon: Package, desc: 'Gestão de peças com vinculação automática às ordens de serviço.' },
      { title: 'Equipe Mecânica', icon: Users, desc: 'Gestão de mecânicos com produtividade, comissões e agenda.' },
    ]}
    benefits={[
      'Ordens de serviço digitais',
      'Histórico completo por veículo',
      'Controle de peças e insumos',
      'Gestão de mecânicos e produtividade',
      'Emissão de NFS-e e NF-e',
      'Agendamento de serviços',
      'Orçamentos para clientes via WhatsApp',
      'Relatórios de lucratividade por serviço',
    ]}
  />
);
