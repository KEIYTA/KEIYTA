"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const projects = [
  { title: "Une ville après la pluie", type: "Cinématique · 16:9", tone: "violet", mark: "01" },
  { title: "L’énergie du mouvement", type: "Film de marque · 9:16", tone: "blue", mark: "02" },
  { title: "Là où tout commence", type: "Histoire · 16:9", tone: "amber", mark: "03" },
];

function Logo() {
  return <a className="brand" href="#top" aria-label="KEIYTA, accueil"><span className="brand-mark">K</span><span>KEIYTA</span></a>;
}

type Storyboard = { title: string; logline: string; mood: string; scenes: { title: string; image: string; camera: string; sound: string }[] };

function buildStoryboard(prompt: string): Storyboard {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  const opening = cleaned.charAt(0).toLocaleUpperCase("fr-FR") + cleaned.slice(1).replace(/[.!?]$/, "");
  const lower = cleaned.toLocaleLowerCase("fr-FR");
  const isNature = /forêt|mer|océan|montagne|nature|plage|rivière|ciel/.test(lower);
  const isCity = /ville|rue|urbain|métro|paris|immeuble|néon/.test(lower);
  const setting = isNature ? "dans un paysage naturel" : isCity ? "au cœur de la ville" : "dans l’univers que vous imaginez";
  return {
    title: opening.length > 54 ? `${opening.slice(0, 51)}…` : opening,
    logline: `Un film court autour de « ${cleaned} », qui invite à découvrir une histoire ${setting}.`,
    mood: isNature ? "Contemplatif · organique · lumineux" : isCity ? "Cinématographique · contrasté · nocturne" : "Cinématographique · sensible · immersif",
    scenes: [
      { title: "L’ouverture", image: `Un premier plan installe ${setting}. La lumière révèle peu à peu les détails et donne envie d’entrer dans la scène.`, camera: "Plan large, lent travelling avant", sound: "Ambiance douce, quelques sons du lieu" },
      { title: "Le mouvement", image: `Un personnage ou un élément traverse le cadre. L’idée prend vie : ${cleaned}.`, camera: "Plan rapproché, mouvement fluide", sound: "La musique s’installe et accompagne le rythme" },
      { title: "La signature", image: "Le mouvement s’apaise sur une image forte. Une dernière lueur laisse une impression durable.", camera: "Léger recul, puis fondu au noir", sound: "La musique s’ouvre puis s’éteint" },
    ],
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  function handlePrepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) { setError("Décrivez votre idée en quelques mots pour préparer le storyboard."); setStoryboard(null); return; }
    setError("");
    setStoryboard(buildStoryboard(prompt));
  }
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
        <form className="prompt-card" onSubmit={handlePrepare}>
          <div className="prompt-top"><span className="prompt-dot"/> NOUVEAU PROJET <span className="draft-pill">BROUILLON</span></div>
          <div className="prompt-content"><span className="prompt-symbol" aria-hidden="true">✳</span><div className="prompt-field"><label className="sr-only" htmlFor="film-prompt">Décrivez votre idée de film</label><textarea id="film-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); if (error) setError(""); }} placeholder="Décrivez la scène que vous voyez dans votre tête…" aria-describedby={error ? "prompt-error" : "prompt-hint"} aria-invalid={Boolean(error)} /><small id="prompt-hint">Un lieu, une ambiance, un mouvement — tout commence par quelques mots.</small></div></div>
          {error && <p className="form-error" id="prompt-error" role="alert">{error}</p>}
          <div className="prompt-bottom"><div className="prompt-tags"><span>✦ Idée libre</span><span>▣ Format vidéo</span></div><button className="create-btn" type="submit">Préparer mon film <span>↗</span></button></div>
        </form>
        {storyboard ? <section className="storyboard" aria-live="polite" aria-labelledby="storyboard-title"><div className="storyboard-header"><div><div className="eyebrow muted">VOTRE PREMIER DÉCOUPAGE</div><h3 id="storyboard-title">{storyboard.title}</h3></div><span className="demo-badge">DÉMO LOCALE</span></div><p className="story-logline">{storyboard.logline}</p><div className="story-meta"><span><small>TON</small>{storyboard.mood}</span><span><small>FORMAT</small>Film court · 3 plans</span></div><div className="scene-list">{storyboard.scenes.map((scene, index) => <article className="scene-card" key={scene.title}><div className="scene-number">0{index + 1}</div><div className="scene-body"><h4>{scene.title}</h4><p>{scene.image}</p><div className="scene-details"><span><b>CAMÉRA</b>{scene.camera}</span><span><b>SON</b>{scene.sound}</span></div></div></article>)}</div><p className="demo-note">Ce storyboard est une proposition de démonstration générée localement à partir de votre idée. Aucune IA externe n’est utilisée.</p></section> : <p className="coming-note"><span>✳</span> Votre idée devient un storyboard, plan après plan.</p>}
      </section>

      <section className="inspiration wrap" id="inspiration">
        <div className="section-heading inspiration-heading"><div><div className="eyebrow muted">UN PEU D’INSPIRATION</div><h2>Des histoires, <span>sans limite.</span></h2></div><a className="text-link" href="#atelier">Et si on commençait ? <span>↗</span></a></div>
        <div className="project-grid">{projects.map((p) => <article className="project" key={p.mark}><div className={`project-art ${p.tone}`}><span className="art-grain"/><span className="art-mark">{p.mark}</span><span className="art-play">↗</span><span className="art-lines"/></div><h3>{p.title}</h3><p>{p.type}</p></article>)}</div>
      </section>
      <footer className="footer wrap"><Logo /><span>FAIT POUR LES HISTOIRES QUI RESTENT.</span><span>© KEIYTA 2026</span></footer>
    </main>
  );
}
