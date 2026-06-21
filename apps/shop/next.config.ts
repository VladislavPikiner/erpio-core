import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Здесь будут настройки специфичные для Shop, если понадобятся
  // Пока оставляем минимальным, как в POS
  transpilePackages: ["@erpio/shared"],
};

export default nextConfig;
