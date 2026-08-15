import './Home.css'

export function Home() {
  return (
    <section className="home-hero" aria-label="Início">
      <div className="home-hero-inner">
        <h1 className="home-brand">
          HELT<span>OM</span>
        </h1>
        <p className="home-headline">Sistema online</p>
        <p className="home-lede">
          Memórias arquivadas. Habilidades em execução. Explore o que resta no grid.
        </p>
      </div>
    </section>
  )
}

export default Home
