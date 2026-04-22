import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Para quem é',
    links: [
      { name: 'Vende em marketplace', path: '/solucoes' },
      { name: 'Tem uma loja virtual', path: '/solucoes' },
      { name: 'Tem loja física', path: '/solucoes' },
      { name: 'Atua como distribuidor', path: '/solucoes' },
      { name: 'Presta serviços', path: '/solucoes' },
    ],
  },
  {
    title: 'Produtos',
    links: [
      { name: 'Sistema ERP', path: '/produtos/erp' },
      { name: 'Conta Digital', path: '/produtos/conta-digital' },
      { name: 'HUB de Integração', path: '/produtos/hub' },
      { name: 'Sistema PDV', path: '/produtos/pdv' },
      { name: 'E-commerce', path: '/produtos/ecommerce' },
      { name: 'Envios', path: '/produtos/envios' },
    ],
  },
  {
    title: 'Categorias',
    links: [
      { name: 'Moda', path: '/categorias/moda' },
      { name: 'Casa e Decoração', path: '/categorias/casa-e-decoracao' },
      { name: 'Autopeças', path: '/categorias/autopecas' },
      { name: 'Construção', path: '/categorias/construcao' },
      { name: 'Informática', path: '/categorias/informatica' },
      { name: 'Beleza', path: '/categorias/beleza' },
      { name: 'Celular e Acessórios', path: '/categorias/celular' },
      { name: 'Cosméticos', path: '/categorias/cosmeticos' },
      { name: 'Mercado', path: '/categorias/mercado' },
      { name: 'Petshop', path: '/categorias/petshop' },
      { name: 'Oficina Mecânica', path: '/categorias/oficina' },
    ],
  },
  {
    title: 'Ecossistema',
    links: [
      { name: 'Sobre a Binc', path: '/sobre' },
      { name: 'Cases de sucesso', path: '/cases' },
      { name: 'Blog', path: '/blog' },
      { name: 'Planos', path: '/planos' },
    ],
  },
  {
    title: 'Atendimento',
    links: [
      { name: 'Central de ajuda', path: '/contato' },
      { name: 'Perguntas frequentes', path: '/faq' },
      { name: 'Contato', path: '/contato' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-gray-900 text-sm mb-5 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-900" />
            </div>
            <span className="font-bold text-gray-900">Binc CMS</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Binc CMS. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Política de privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
