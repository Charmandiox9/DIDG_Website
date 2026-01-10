import { createClient } from "@/infrastructure/supabase/server";
import { getExtraResources } from "@/core/actions/resources";
import { ResourceFeed } from "@/components/resources/ResourceFeed";
import { CharmanderPet } from "@/components/home/CharmanderPet";
import { Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const supabase = await createClient();
  const resources = await getExtraResources();

  const { data: { user } } = await supabase.auth.getUser();

  let bookmarkedIds = new Set<string>();
  
  if (user) {
    const { data: bookmarks } = await supabase
        .from("resource_bookmarks")
        .select("resource_id")
        .eq("user_id", user.id);
    
    bookmarks?.forEach((b: any) => bookmarkedIds.add(b.resource_id));
  }

  const resourcesWithStatus = resources?.map((res: any) => ({
    ...res,
    isBookmarked: bookmarkedIds.has(res.id)
  }));

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <CharmanderPet />
      
      {/* HEADER HERO  */}
      <div className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4 ring-1 ring-secondary/30 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Sparkles className="w-6 h-6 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main">
          Recursos Extra & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Snippets</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          Material complementario, guías rápidas y herramientas útiles que no necesariamente son parte del programa oficial.
        </p>
      </div>

      {/* CALL TO ACTION: FEEDBACK  */}
      <div className="bg-gradient-to-r from-surface to-background border border-text-main/10 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="z-10">
          <h3 className="text-xl font-bold text-text-main">¿Te falta alguna guía específica?</h3>
          <p className="text-text-muted text-sm mt-1">
            Esta sección se construye con tus dudas. Si quieres un tutorial sobre un tema puntual, pídelo ahora.
          </p>
        </div>
        <div className="z-10">
           <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <Sparkles className="w-4 h-4" /> Usa el botón flotante "Solicitar Tema"
           </div>
        </div>
      </div>

      {/* FEED INTERACTIVO */}
      <ResourceFeed resources={resourcesWithStatus || []} />

    </div>
  );
}