import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Moda', path: '/categorias/moda', img: '/cat-moda.png', desc: 'Roupas, calçados e acessórios' },
  { name: 'Casa e Decoração', path: '/categorias/casa-e-decoracao', img: '/cat-casa.png', desc: 'Móveis, decoração e utilidades' },
  { name: 'Autopeças', path: '/categorias/autopecas', img: '/cat-autopecas.png', desc: 'Peças e acessórios automotivos' },
  { name: 'Construção', path: '/categorias/construcao', img: '/cat-construcao.png', desc: 'Materiais de construção e reforma' },
  { name: 'Informática', path: '/categorias/informatica', img: '/cat-informatica.png', desc: 'Computadores e periféricos' },
  { name: 'Beleza', path: '/categorias/beleza', img: '/cat-beleza.png', desc: 'Cuidados pessoais e bem-estar' },
  { name: 'Celular e Acessórios', path: '/categorias/celular', img: '/cat-celular.png', desc: 'Smartphones e acessórios' },
  { name: 'Cosméticos', path: '/categorias/cosmeticos', img: '/cat-cosmeticos.png', desc: 'Maquiagem e perfumaria' },
  { name: 'Mercado', path: '/categorias/mercado', img: '/cat-mercado.png', desc: 'Supermercados e mercearias' },
  { name: 'Petshop', path: '/categorias/petshop', img: '/cat-petshop.png', desc: 'Rações, acessórios e cuidados pet' },
  { name: 'Oficina Mecânica', path: '/categorias/oficina', img: '/cat-oficina.png', desc: 'Serviços automotivos e manutenção' },
];

export const Categorias = () => (
  <section className="pt-28 md:pt-36 pb-20 md:pb-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">Soluções por Categoria</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 max-w-2xl mx-auto text-lg">Sistemas especializados para cada segmento do varejo brasileiro.</motion.p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={cat.path} className="block rounded-[2rem] overflow-hidden group relative aspect-[4/3] bg-gray-200">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-white font-bold text-lg">{cat.name}</span>
                <p className="text-white/70 text-sm mt-1">{cat.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
