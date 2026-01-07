import { Music } from "lucide-react";

export function SpotifyCard({ song }: { song: any }) {
  if (!song?.isPlaying) {
    return (
      <div className="flex items-center gap-2 text-xs text-text-muted opacity-50">
        <Music className="w-3 h-3" />
        <span>No estoy escuchando nada ahora</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-black/20 rounded-full border border-green-500/20 backdrop-blur-md max-w-fit">
        {/* Carátula girando */}
        <img 
          src={song.albumImageUrl} 
          alt={song.album} 
          className="w-8 h-8 rounded-full animate-spin-slow border border-white/10" 
        />
        
        <div className="flex flex-col text-xs pr-2">
            <span className="font-bold text-green-400 truncate max-w-[150px]">
                {song.title}
            </span>
            <span className="text-gray-400 truncate max-w-[150px]">
                {song.artist}
            </span>
        </div>
        
        {/* Barras de sonido animadas (CSS puro) */}
        <div className="flex gap-[2px] items-end h-4">
            <span className="w-1 bg-green-500 h-2 animate-music-bar-1"></span>
            <span className="w-1 bg-green-500 h-4 animate-music-bar-2"></span>
            <span className="w-1 bg-green-500 h-3 animate-music-bar-3"></span>
        </div>
    </div>
  );
}