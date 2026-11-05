const projects = [
  { title: "Une ville après la pluie", type: "Cinématique · 16:9", tone: "violet", mark: "01" },
  { title: "L’énergie du mouvement", type: "Film de marque · 9:16", tone: "blue", mark: "02" },
  { title: "Là où tout commence", type: "Histoire · 16:9", tone: "amber", mark: "03" },
];

function Logo() {
  return <a className="brand" href="#top" aria-label="KEIYTA, accueil"><span className="brand-mark">K</span><span>KEIYTA</span></a>;
}

export default function Home() {
  return (
    <main id="top">
      <nav className="nav wrap">
        <Logo />
        <div className="nav-links"><a href="#atelier">L’atelier</a><a href="#inspiration">Inspiration</a></div>
        <a className="nav-cta" href="#atelier">Accéder à l’atelier <span>↗</span></a>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> LE STUDIO VIDÉO IA</div>
          <h1>Une idée.<br /><span>Un film.</span><br />Votre vision.</h1>
          <p className="hero-text">Racontez ce que vous imaginez. KEIYTA donne forme à vos histoires, plan après plan.</p>
          <a className="primary-btn" href="#atelier">Créer mon premier film <span>↗</span></a>
          <div className="hero-note"><span className="tiny-stars">✳</span> Votre imagination fait le premier pas.</div>
        </div>
        <div className="visual" aria-label="Aperçu abstrait d’un film en création">
          <div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
          <div className="visual-glow"/><div className="visual-core"><span>k</span></div>
          <div className="visual-caption"><span className="caption-dot"/> UN NOUVEAU MONDE PREND FORME</div>
          <div className="visual-index">K—001 <span>IMAGINER / CRÉER</span></div>
          <div className="floating-card"><span className="mini-icon">✳</span><div><b>De l’idée à l’image</b><small>Votre prochaine histoire commence ici</small></div><span className="card-arrow">↗</span></div>
        </div>
      </section>

      <section className="atelier wrap" id="atelier">
        <div className="section-heading"><div><div className="eyebrow muted">VOTRE ESPACE DE CRÉATION</div><h2>Qu’allez-vous <span>imaginer&nbsp;?</span></h2></div><span className="step-label">01 <i>/</i> 03</span></div>
        <div className="prompt-card">
          <div className="prompt-top"><span className="prompt-dot"/> NOUVEAU PROJET <span className="draft-pill">BROUILLON</span></div>
          <div className="prompt-content"><span className="prompt-symbol">✳</span><div className="prompt-placeholder">Décrivez la scène que vous voyez dans votre tête…<small>Un lieu, une ambiance, un mouvement — tout commence par quelques mots.</small></div></div>
          <div className="prompt-bottom"><div className="prompt-tags"><span>✦ Idée libre</span><span>▣ Format vidéo</span></div><button className="create-btn" type="button" aria-label="Préparer une création">Préparer mon film <span>↗</span></button></div>
        </div>
        <p className="coming-note"><span>✳</span> L’atelier se construit. Bientôt, vos mots deviendront des images.</p>
      </section>

      <section className="inspiration wrap" id="inspiration">
        <div className="section-heading inspiration-heading"><div><div className="eyebrow muted">UN PEU D’INSPIRATION</div><h2>Des histoires, <span>sans limite.</span></h2></div><a className="text-link" href="#atelier">Et si on commençait ? <span>↗</span></a></div>
        <div className="project-grid">{projects.map((p) => <article className="project" key={p.mark}><div className={`project-art ${p.tone}`}><span className="art-grain"/><span className="art-mark">{p.mark}</span><span className="art-play">↗</span><span className="art-lines"/></div><h3>{p.title}</h3><p>{p.type}</p></article>)}</div>
      </section>
      <footer className="footer wrap"><Logo /><span>FAIT POUR LES HISTOIRES QUI RESTENT.</span><span>© KEIYTA 2026</span></footer>
    </main>
  );
}
