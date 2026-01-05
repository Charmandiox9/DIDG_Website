import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-center md:text-left">
            <p className="font-display text-sm text-text-muted">
              © {new Date().getFullYear()} <span className="text-primary">DIDG</span> SYSTEM.
            </p>
            <p className="text-xs text-text-muted/60 mt-1 font-mono">
              Arquitectura de Software & IoT Research
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" className="text-text-muted hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" className="text-text-muted hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:tu@email.com" className="text-text-muted hover:text-secondary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}