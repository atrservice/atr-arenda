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
  },
  // SEO: чистые URL
  trailingSlash: false,
  // Компрессия
  compress: true,
  // ❌ telemetry: false — УДАЛЕНО, больше не поддерживается
};

export default nextConfig;