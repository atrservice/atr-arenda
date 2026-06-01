/** @type {import('next').NextConfig} */

const nextConfig = {
  // 🔹 Оптимизация изображений
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atr-specarenda.vercel.app' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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