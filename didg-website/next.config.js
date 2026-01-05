/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Tus archivos de Supabase
      },
      {
        protocol: "https",
        hostname: "github.com", // Tu foto de perfil
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Avatares de GitHub
      },
      {
        protocol: "https",
        hostname: "**.imgur.com", // Imágenes de Imgur
      },
    ],
  },
};

module.exports = nextConfig;