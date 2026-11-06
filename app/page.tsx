"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const projects = [
  { title: "Une ville après la pluie", type: "Cinématique · 16:9", tone: "violet", mark: "01" },
  { title: "L’énergie du mouvement", type: "Film de marque · 9:16", tone: "blue", mark: "02" },
  { title: "Là où tout commence", type: "Histoire · 16:9", tone: "amber", mark: "03" },
];
const STORAGE_KEY = "keiyta-storyboard-v1";
type Scene = { title: string; duration: number; visualDescription: string; cameraDirection: string; lightingMood: string; sound: string };
type Storyboard = { title: string; logline: string; mood: string; scenes: Scene[] };
type SavedState = { prompt: string; storyboard: Storyboard; mode: "ai" | "demo"; validated: boolean };

function Logo() {
  return <a className="brand" href="#top" aria-label="KEIYTA, accueil"><span className="brand-mark">K</span><span>KEIYTA</span></a>;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [mode, setMode] = useState<"ai" | "demo">("demo");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved) as SavedState;
          if (data.storyboard && Array.isArray(data.storyboard.scenes)) {
            setPrompt(data.prompt ?? "");
            setStoryboard(data.storyboard);
            setMode(data.mode === "ai" ? "ai" : "demo");
            setValidated(Boolean(data.validated));
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (storyboard) localStorage.setItem(STORAGE_KEY, JSON.stringify({ prompt, storyboard, mode, validated } satisfies SavedState));
    else localStorage.removeItem(STORAGE_KEY);
  }, [ready, prompt, storyboard, mode, validated]);

  function startNewProject() {
    setPrompt("");
    setError("");
    setStoryboard(null);
    setValidated(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  function updateScene(index: number, field: keyof Scene, value: string | number) {
    setStoryboard((current) => current && ({ ...current, scenes: current.scenes.map((scene, sceneIndex) => sceneIndex === index ? { ...scene, [field]: value } : scene) }));
    setValidated(false);
  }

  async function submitStoryboard(event: FormEvent<HTMLFormElement>, regenerateSceneIndex?: number) {
    event.preventDefault();
    if (!prompt.trim()) { setError("Décrivez votre idée en quelques mots pour préparer le storyboard."); setStoryboard(null); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/storyboard", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ...(regenerateSceneIndex !== undefined ? { regenerateSceneIndex, existingStoryboard: storyboard } : {}) }),
      });
      const result = await response.json() as { mode?: "ai" | "demo"; storyboard?: Storyboard; error?: string };
      if (!response.ok || !result.storyboard) throw new Error(result.error || "Le storyboard n’a pas pu être préparé. Réessayez.");
      setStoryboard(result.storyboard);
      setMode(result.mode === "ai" ? "ai" : "demo");
      setValidated(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="top">
      <nav className="nav wrap"><Logo /><div className="nav-links"><a href="#atelier">L’atelier</a><a href="#inspiration">Inspiration</a></div><a className="nav-cta" href="#atelier">Accéder à l’atelier <span>↗</span></a></nav>
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse" /> LE STUDIO VIDÉO IA</div><h1>Une idée.<br /><span>Un film.</span><br />Votre vision.</h1><p className="hero-text">Racontez ce que vous imaginez. KEIYTA donne forme à vos histoires, plan après plan.</p><a className="primary-btn" href="#atelier">Créer mon premier film <span>↗</span></a><div className="hero-note"><span className="tiny-stars">✳</span> Votre imagination fait le premier pas.</div></div>
        <div className="visual" aria-label="Aperçu abstrait d’un film en création"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-glow"/><div className="visual-core"><span>k</span></div><div className="visual-caption"><span className="caption-dot"/> UN NOUVEAU MONDE PREND FORME</div><div className="visual-index">K—001 <span>IMAGINER / CRÉER</span></div><div className="floating-card"><span className="mini-icon">✳</span><div><b>De l’idée à l’image</b><small>Votre prochaine histoire commence ici</small></div><span className="card-arrow">↗</span></div></div>
      </section>
      <section className="atelier wrap" id="atelier">
        <div className="section-heading"><div><div className="eyebrow muted">VOTRE ESPACE DE CRÉATION</div><h2>Qu’allez-vous <span>imaginer&nbsp;?</span></h2></div><span className="step-label">01 <i>/</i> 03</span></div>
        <form className="prompt-card" onSubmit={(event) => void submitStoryboard(event)}>
          <div className="prompt-top"><span className="prompt-dot"/> NOUVEAU PROJET {storyboard || prompt ? <button className="new-project-btn" type="button" onClick={startNewProject}>＋ Nouveau projet</button> : <span className="draft-pill">BROUILLON</span>}</div>
          <div className="prompt-content"><span className="prompt-symbol" aria-hidden="true">✳</span><div className="prompt-field"><label className="sr-only" htmlFor="film-prompt">Décrivez votre idée de film</label><textarea id="film-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); if (error) setError(""); }} placeholder="Décrivez la scène que vous voyez dans votre tête…" aria-describedby={error ? "prompt-error" : "prompt-hint"} aria-invalid={Boolean(error)} maxLength={2000} /><small id="prompt-hint">Un lieu, une ambiance, un mouvement — tout commence par quelques mots.</small></div></div>
          {error && <p className="form-error" id="prompt-error" role="alert">{error}</p>}
          <div className="prompt-bottom"><div className="prompt-tags"><span>✦ Idée libre</span><span>▣ Format vidéo</span></div><button className="create-btn" type="submit" disabled={loading}>{loading ? <><span className="spinner"/> Préparation…</> : <>Préparer mon film <span>↗</span></>}</button></div>
        </form>
        {loading && <p className="loading-note" role="status">KEIYTA imagine vos scènes. Cela peut prendre quelques secondes…</p>}
        {storyboard && <section className="storyboard" aria-live="polite" aria-labelledby="storyboard-title">
          <div className="storyboard-header"><div><div className="eyebrow muted">VOTRE PREMIER DÉCOUPAGE</div><h3 id="storyboard-title">{storyboard.title}</h3></div><span className={mode === "demo" ? "demo-badge" : "ai-badge"}>{mode === "demo" ? "MODE DÉMO" : "GÉNÉRÉ PAR IA"}</span></div>
          <p className="story-logline">{storyboard.logline}</p><div className="story-meta"><span><small>TON</small>{storyboard.mood}</span><span><small>FORMAT</small>Film court · {storyboard.scenes.length} scènes</span></div>
          <div className="scene-list">{storyboard.scenes.map((scene, index) => <article className="scene-card" key={`${index}-${scene.title}`}><div className="scene-number">{String(index + 1).padStart(2, "0")}<small>{scene.duration}s</small></div><div className="scene-body"><label className="scene-title-field"><span>TITRE DE LA SCÈNE</span><input value={scene.title} onChange={(event) => updateScene(index, "title", event.target.value)} /></label><label className="scene-field"><span>DESCRIPTION VISUELLE</span><textarea value={scene.visualDescription} onChange={(event) => updateScene(index, "visualDescription", event.target.value)} /></label><div className="scene-details"><label className="scene-field"><span>CAMÉRA</span><textarea value={scene.cameraDirection} onChange={(event) => updateScene(index, "cameraDirection", event.target.value)} /></label><label className="scene-field"><span>LUMIÈRE & AMBIANCE</span><textarea value={scene.lightingMood} onChange={(event) => updateScene(index, "lightingMood", event.target.value)} /></label><label className="scene-field"><span>SON</span><textarea value={scene.sound} onChange={(event) => updateScene(index, "sound", event.target.value)} /></label><label className="scene-field duration-field"><span>DURÉE (SECONDES)</span><input type="number" min="1" max="120" value={scene.duration} onChange={(event) => updateScene(index, "duration", Number(event.target.value))} /></label></div><button className="regenerate-btn" type="button" disabled={loading} onClick={(event) => void submitStoryboard(event as unknown as FormEvent<HTMLFormElement>, index)}>↻ Régénérer cette scène</button></div></article>)}</div>
          {mode === "demo" ? <p className="demo-note">Mode démo : l’exemple est généré localement. Ajoutez OPENAI_API_KEY aux variables d’environnement Vercel pour activer les propositions par IA.</p> : <p className="demo-note">Votre storyboard est généré par l’IA et enregistré dans ce navigateur. Les modifications restent privées dans votre stockage local.</p>}
          <div className="validation-row"><span>{validated ? "Storyboard validé · prêt pour la suite" : "Relisez et ajustez chaque scène avant de continuer."}</span><button className="validate-btn" type="button" onClick={() => setValidated(true)}>{validated ? "Storyboard validé ✓" : "Valider le storyboard"}</button></div>{validated && <div className="video-placeholder" role="status"><span className="eyebrow muted">ÉTAPE SUIVANTE · CRÉATION VIDÉO</span><h4>Votre storyboard est prêt pour la création vidéo.</h4><p>La création vidéo sera proposée ici dans une prochaine étape.</p><span className="demo-badge">BIENTÔT · AUCUNE VIDÉO GÉNÉRÉE</span></div>}
        </section>}
        {!storyboard && <p className="coming-note"><span>✳</span> Votre idée devient un storyboard, plan après plan.</p>}
      </section>
      <section className="inspiration wrap" id="inspiration"><div className="section-heading inspiration-heading"><div><div className="eyebrow muted">UN PEU D’INSPIRATION</div><h2>Des histoires, <span>sans limite.</span></h2></div><a className="text-link" href="#atelier">Et si on commençait ? <span>↗</span></a></div><div className="project-grid">{projects.map((p) => <article className="project" key={p.mark}><div className={`project-art ${p.tone}`}><span className="art-grain"/><span className="art-mark">{p.mark}</span><span className="art-play">↗</span><span className="art-lines"/></div><h3>{p.title}</h3><p>{p.type}</p></article>)}</div></section>
      <footer className="footer wrap"><Logo /><span>FAIT POUR LES HISTOIRES QUI RESTENT.</span><span>© KEIYTA 2026</span></footer>
    </main>
  );
}
