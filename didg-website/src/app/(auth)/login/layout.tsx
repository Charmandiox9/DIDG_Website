export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo simplificado para login */}
      <div className="absolute inset-0 bg-background bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}