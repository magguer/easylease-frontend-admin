/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegura que el admin funcione correctamente en cualquier puerto
  assetPrefix: '',
  basePath: '',
  trailingSlash: false,

  // Configuración para imágenes externas (Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icslgomptvgphecfvlxy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;