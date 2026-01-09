import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-text-main/10 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          
          {/* Copyright & Info */}
          <div className="text-center md:text-left">
            <p className="font-display text-sm text-text-muted">
              © {new Date().getFullYear()} <span className="text-primary font-bold">DIDG</span> SYSTEM.
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono opacity-70">
              Arquitectura de Software & IoT Research
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            
            {/* GITHUB: Verifica si tu usuario es KornBeat o Charmandiox9 */}
            <a 
              href="https://github.com/Charmandiox9" 
              target="_blank" 
              rel="noreferrer"
              className="text-text-muted hover:text-text-main transition-colors duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            {/* LINKEDIN: Verifica la URL sin tildes */}
            <a 
              href="https://www.linkedin.com/in/daniel-durán-garcía" 
              target="_blank" 
              rel="noreferrer"
              className="text-text-muted hover:text-[#0077b5] transition-colors duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* MAIL */}
            <a 
              href="mailto:didurangarcia@gmail.com"
              className="text-text-muted hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
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