import { NextResponse } from "next/server";

export const runtime = "nodejs";

const storyboardSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    logline: { type: "string" },
    mood: { type: "string" },
    scenes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          duration: { type: "integer" },
          visualDescription: { type: "string" },
          cameraDirection: { type: "string" },
          lightingMood: { type: "string" },
          sound: { type: "string" },
        },
        required: ["title", "duration", "visualDescription", "cameraDirection", "lightingMood", "sound"],
      },
    },
  },
  required: ["title", "logline", "mood", "scenes"],
} as const;

type RequestBody = {
  prompt?: unknown;
  regenerateSceneIndex?: unknown;
  existingStoryboard?: unknown;
};

function demoStoryboard(prompt: string) {
  const opening = prompt.trim().replace(/\s+/g, " ");
  const title = opening.length > 54 ? `${opening.slice(0, 51)}…` : opening;
  return {
    title: title.charAt(0).toLocaleUpperCase("fr-FR") + title.slice(1),
    logline: `Une proposition de film court autour de « ${opening} ».`,
    mood: "Cinématographique · sensible · immersif",
    scenes: [
      { title: "L’ouverture", duration: 5, visualDescription: `Un plan d’établissement présente l’univers de « ${opening} » et révèle progressivement un détail intrigant.`, cameraDirection: "Plan large, lent travelling avant", lightingMood: "Lumière douce, contraste feutré", sound: "Ambiance du lieu, texture musicale légère" },
      { title: "Le mouvement", duration: 7, visualDescription: `Un élément traverse le cadre et donne vie à l’idée : ${opening}.`, cameraDirection: "Plan rapproché, mouvement fluide", lightingMood: "Lumière latérale, émotion qui monte", sound: "La musique s’installe avec des sons précis du lieu" },
      { title: "La signature", duration: 4, visualDescription: "Le mouvement s’apaise sur une image forte qui laisse une impression durable.", cameraDirection: "Léger recul, puis fondu au noir", lightingMood: "Lueur finale puis obscurité", sound: "La musique s’ouvre puis s’éteint" },
    ],
  };
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "La requête est invalide." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > 2000) {
    return NextResponse.json({ error: "Décrivez votre idée (2 000 caractères maximum)." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const storyboard = demoStoryboard(prompt);
    if (Number.isInteger(body.regenerateSceneIndex) && body.existingStoryboard && typeof body.existingStoryboard === "object") {
      const current = body.existingStoryboard as { scenes?: unknown };
      const index = Number(body.regenerateSceneIndex);
      if (Array.isArray(current.scenes) && index >= 0 && index < current.scenes.length && current.scenes.length <= 6) {
        const previous = current.scenes[index] as Record<string, unknown>;
        storyboard.scenes[index] = {
          title: typeof previous.title === "string" ? previous.title : `Scène ${index + 1}`,
          duration: typeof previous.duration === "number" ? previous.duration : 5,
          visualDescription: `Nouvelle proposition pour « ${prompt} » : un détail inattendu apparaît, puis révèle une autre facette de l’idée.`,
          cameraDirection: "Travelling latéral lent, profondeur de champ douce",
          lightingMood: "Lumière latérale et atmosphère enveloppante",
          sound: "Texture sonore aérienne, ponctuée par les sons du lieu",
        };
        return NextResponse.json({ mode: "demo", storyboard: { ...current, scenes: storyboard.scenes } });
      }
    }
    return NextResponse.json({ mode: "demo", storyboard });
  }

  const isRegeneration = Number.isInteger(body.regenerateSceneIndex);
  const sceneIndex = isRegeneration ? Number(body.regenerateSceneIndex) : -1;
  if (isRegeneration && (sceneIndex < 0 || sceneIndex > 5 || !body.existingStoryboard)) {
    return NextResponse.json({ error: "La scène à régénérer est invalide." }, { status: 400 });
  }

  try {
    const task = isRegeneration
      ? `Réécris uniquement la scène numéro ${sceneIndex + 1} de ce storyboard. Conserve son intention générale, mais propose une nouvelle idée visuelle, de caméra, de lumière et de son. Retourne le storyboard complet avec cette seule scène modifiée.\nStoryboard: ${JSON.stringify(body.existingStoryboard)}`
      : `Crée un storyboard de film court, cinématographique et concret, en français, inspiré de cette idée : ${prompt}`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: "Tu es un réalisateur et scénariste. Réponds en français. Le film doit avoir 3 à 6 scènes, une progression claire et des durées réalistes. Respecte strictement le format demandé." },
          { role: "user", content: task },
        ],
        text: { format: { type: "json_schema", name: "keiyta_storyboard", strict: true, schema: storyboardSchema } },
        max_output_tokens: 1800,
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (!response.ok) {
      const upstream = await response.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
      console.error("OpenAI storyboard request failed", response.status, upstream?.error?.code);
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: "La clé OpenAI configurée dans Vercel n’est pas valide ou n’a pas accès au modèle." }, { status: 502 });
      }
      if (response.status === 429) {
        return NextResponse.json({ error: "Le service IA est temporairement limité. Réessayez dans un instant." }, { status: 503 });
      }
      return NextResponse.json({ error: "Le service IA n’a pas pu préparer le storyboard. Réessayez." }, { status: 502 });
    }

    const data = await response.json() as { output_text?: string };
    if (!data.output_text) throw new Error("Réponse JSON manquante");
    const storyboard = JSON.parse(data.output_text) as { scenes?: unknown[] };
    if (isRegeneration) {
      const previous = body.existingStoryboard as { scenes?: unknown[] };
      if (!Array.isArray(previous.scenes) || !Array.isArray(storyboard.scenes) || !previous.scenes[sceneIndex] || !storyboard.scenes[sceneIndex]) {
        throw new Error("Scene response invalid");
      }
      storyboard.scenes = previous.scenes.map((scene, index) => index === sceneIndex ? storyboard.scenes![sceneIndex] : scene);
      return NextResponse.json({ mode: "ai", storyboard: { ...(body.existingStoryboard as object), scenes: storyboard.scenes } });
    }
    return NextResponse.json({ mode: "ai", storyboard });
  } catch (error) {
    console.error("Storyboard generation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Impossible de joindre le service IA. Vérifiez votre connexion et réessayez." }, { status: 502 });
  }
}
