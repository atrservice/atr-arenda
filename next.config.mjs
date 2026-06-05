/** @type {import('next').NextConfig} */

const nextConfig = {
  // 🔹 Оптимизация изображений
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atr-specarenda.vercel.app' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },

    // 🔹 Удаление console.log в production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 🔹 Оптимизация бандла
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  
  // 🔹 SEO: чистые URL
  trailingSlash: false,
  
  // 🔹 Компрессия бандлов
  compress: true,
  
  // 🔹 301 редирект www → non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.avtovishki-arenda.ru' }],
        destination: 'https://avtovishki-arenda.ru/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;