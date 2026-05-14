/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация изображений
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atr-specarenda.vercel.app' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // SEO: чистые URL
  trailingSlash: false,
  // Компрессия
  compress: true,
  // ❌ telemetry: false — УДАЛЕНО, больше не поддерживается
};

export default nextConfig;