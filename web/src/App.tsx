import { useState, useEffect } from 'react';
import './App.css';

interface Receita {
  id: number;
  titulo: string;
  categoria: string;
  tempo: string;
  preco: string;
  ingredientes: string[];
  passos: string[];
  imagem: string;
}

const RECEITAS: Receita[] = [
  {
    id: 1,
    titulo: 'Enroladinho de Salsicha',
    categoria: 'Lanches',
    tempo: '10 min',
    preco: 'R$ 5,00',
    imagem: 'https://p2.trrsf.com/image/fget/cf/0/0/images.terra.com/2021/07/28/1992932943-receitasparacriancas-cachorroquente.jpg',
    ingredientes: ['Massa de pastel pronta', 'Salsichas', 'Queijo ralado (opcional)'],
    passos: [
      'Enrole a massa na salsicha.',
      'Leve à Airfryer por 8 min a 180°C (ou asse no forno até dourar).',
      'Sirva com ketchup!'
    ]
  },
  {
    id: 2,
    titulo: 'Panquecas Americanas',
    categoria: 'Doces',
    tempo: '5 min',
    preco: 'R$ 3,50',
    imagem: 'https://files.zinecultural.com/Repositorio/Upload/S3/mlib-uploads/full/fotojet-605a2a5681b40.webp',
    ingredientes: ['4 colheres de farinha', '1 colher de açúcar', '1 ovo', '3 colheres de leite'],
    passos: [
      'Misture tudo bem em uma tigela.',
      'Despeje porções em uma frigideira untada.',
      'Sirva com calda ou frutas por cima!'
    ]
  },
  {
    id: 3,
    titulo: 'Pão de Queijo',
    categoria: 'Lanches',
    tempo: '7 min',
    preco: 'R$ 4,00',
    imagem: 'https://blog.portoseguro.com.br/wordpress/wp-content/uploads/2021/10/paodequeijo.png',
    ingredientes: ['1 ovo', '2 colheres de goma de tapioca', '1 colher de requeijão', 'Sal a gosto'],
    passos: [
      'Bata tudo com um garfo em uma tigela.',
      'Despeje numa frigideira untada em fogo baixo.',
      'Vire quando dourar o fundo.'
    ]
  }
];

type Pagina = 'home' | 'receitas' | 'sobre';

export function App() {
  const [pagina, setPagina] = useState<Pagina>('home');
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setPagina(event.state.pagina || 'home');
        if (event.state.receitaId) {
          const rec = RECEITAS.find((r) => r.id === event.state.receitaId) || null;
          setReceitaSelecionada(rec);
        } else {
          setReceitaSelecionada(null);
        }
      } else {
        setPagina('home');
        setReceitaSelecionada(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navegarPara = (novaPagina: Pagina, receita: Receita | null = null) => {
    setPagina(novaPagina);
    setReceitaSelecionada(receita);

    const estado = { pagina: novaPagina, receitaId: receita ? receita.id : null };
    window.history.pushState(estado, '');
  };

  const receitasFiltradas = RECEITAS.filter((rec) => {
    const combinaBusca = rec.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      rec.ingredientes.some(i => i.toLowerCase().includes(busca.toLowerCase()));
    const combinaCategoria = categoriaFiltro === 'Todas' || rec.categoria === categoriaFiltro;
    
    return combinaBusca && combinaCategoria;
  });

  return (
    <div className="page-container">
      {/* Menu Superior */}
      <nav className="navbar">
        <button 
          className={pagina === 'home' && !receitaSelecionada ? 'nav-link active' : 'nav-link'} 
          onClick={() => navegarPara('home', null)}
        >
          Início
        </button>
        <button 
          className={pagina === 'receitas' && !receitaSelecionada ? 'nav-link active' : 'nav-link'} 
          onClick={() => navegarPara('receitas', null)}
        >
          Receitas
        </button>
        <button 
          className={pagina === 'sobre' ? 'nav-link active' : 'nav-link'} 
          onClick={() => navegarPara('sobre', null)}
        >
          Sobre
        </button>
      </nav>

      {/* TELA 1: HOME */}
      {pagina === 'home' && !receitaSelecionada && (
        <main className="hero-section">
          {/* Fotos nos cantos */}
          <div className="img-frame frame-1">
            <div className="border-backdrop"></div>
            <img src={RECEITAS[0].imagem} alt={RECEITAS[0].titulo} />
          </div>

          <div className="img-frame frame-2">
            <div className="border-backdrop"></div>
            <img src={RECEITAS[1].imagem} alt={RECEITAS[1].titulo} />
          </div>

          <div className="img-frame frame-3">
            <div className="border-backdrop"></div>
            <img src={RECEITAS[2].imagem} alt={RECEITAS[2].titulo} />
          </div>

          {/* Container Unificado Central */}
          <div className="hero-center">
            <div className="title-wrapper">
              <div className="title-line left"></div>
              <h1 className="brand-title">FoodPedia</h1>
              <div className="title-line right"></div>
            </div>

            <button 
              className="cta-button"
              onClick={() => navegarPara('receitas', null)}
            >
              Explorar Receitas 
            </button>
          </div>
        </main>
      )}

      {/* TELA 2: LISTA DE RECEITAS */}
      {pagina === 'receitas' && !receitaSelecionada && (
        <section className="recipes-section">
          <h2>Todas as Receitas </h2>

          <div className="search-box">
            <input 
              type="text" 
              placeholder="Busque por receita ou ingrediente..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['Todas', 'Lanches', 'Doces'].map((cat) => (
              <button 
                key={cat} 
                className={categoriaFiltro === cat ? 'btn-filter active' : 'btn-filter'}
                onClick={() => setCategoriaFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="recipe-grid">
            {receitasFiltradas.length > 0 ? (
              receitasFiltradas.map((rec) => (
                <div key={rec.id} className="recipe-card" onClick={() => navegarPara('receitas', rec)}>
                  <h3>{rec.titulo}</h3>
                  <div className="card-tags">
                    <span>⏱️ {rec.tempo}</span>
                    <span>💰 {rec.preco}</span>
                  </div>
                  <button className="btn-recipe">Ver Receita</button>
                </div>
              ))
            ) : (
              <p className="no-results">Nenhuma receita encontrada.</p>
            )}
          </div>
        </section>
      )}

      {/* DETALHES DE UMA RECEITA */}
      {receitaSelecionada && (
        <main className="detail-section">
          <button className="btn-back" onClick={() => window.history.back()}>
            ← Voltar para as receitas
          </button>
          <div className="detail-card">
            <h2>{receitaSelecionada.titulo}</h2>
            <div className="detail-meta">
              <span>⏱️ Tempo: {receitaSelecionada.tempo}</span>
              <span>💰 Custo: {receitaSelecionada.preco}</span>
              <span>🏷️ Categoria: {receitaSelecionada.categoria}</span>
            </div>

            <h3>Ingredientes:</h3>
            <ul>
              {receitaSelecionada.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>

            <h3>Modo de Preparo:</h3>
            <ol>
              {receitaSelecionada.passos.map((passo, i) => <li key={i}>{passo}</li>)}
            </ol>
          </div>
        </main>
      )}

      {/* TELA 3: SOBRE */}
      {pagina === 'sobre' && (
        <main className="about-section">
          <div className="about-card">
            <h2>Sobre o FoodPedia</h2>
            <p>
              O <strong>FoodPedia</strong> é a sua enciclopédia de culinária simples e prática. 
              Criado especialmente para crianças, adolescentes e iniciantes que querem aprender 
              a cozinhar receitas saborosas sem complicação e sem gastar muito tempo na cozinha.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;