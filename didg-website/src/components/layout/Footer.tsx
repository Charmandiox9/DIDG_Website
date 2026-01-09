import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    // CAMBIO: border-text-main/10 para que sea visible en ambos temas
    <footer className="border-t border-text-main/10 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-center md:text-left">
            <p className="font-display text-sm text-text-muted">
              © {new Date().getFullYear()} <span className="text-primary font-bold">DIDG</span> SYSTEM.
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono opacity-70">
              Arquitectura de Software & IoT Research
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/Charmandiox9" 
              target="_blank" 
              rel="noreferrer"
              // CAMBIO: hover:text-text-main (Gris oscuro en Light, Blanco en Dark)
              className="text-text-muted hover:text-text-main transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a 
              href="https://www.linkedin.com/in/daniel-durán-garcía" 
              target="_blank" 
              rel="noreferrer"
              // Este se queda igual porque el Primary Color funciona en ambos
              className="text-text-muted hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* Agregué el mail también por consistencia si lo quieres */}
            <a 
              href="mailto:didurangarcia@gmail.com"
              className="text-text-muted hover:text-text-main transition-colors duration-300"
              aria-label="Email"
            >
               <Mail className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}