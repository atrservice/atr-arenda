/** @type {import('next').NextConfig} */

// 🔹 Импортируй плагин (ES Module синтаксис!)
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // ✅ Включается только при переменной
});

const nextConfig = {
  // 🔹 Оптимизация изображений
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atr-specarenda.vercel.app' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828], // ← Уменьшено для теста
    imageSizes: [16, 32, 48],
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
        permanent: true, // ✅ 301 redirect
      },
    ];
  },
};

// 🔹 Экспорт (ES Module синтаксис!)
export default withBundleAnalyzer(nextConfig);