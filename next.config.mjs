/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация изображений
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atr-specarenda.vercel.app' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
    ],
    formats: ['image/avif', 'image/webp'], // ✅ Современные форматы
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Кэш в секундах
  },
  // SEO: чистые URL
  trailingSlash: false,
  // Компрессия
  compress: true,
  // ❌ telemetry: false — УДАЛЕНО, больше не поддерживается

    async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.avtovishki-arenda.ru' }],
        destination: 'https://avtovishki-arenda.ru/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;