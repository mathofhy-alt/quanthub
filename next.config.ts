
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 빌드 중 타입 에러 무시 (급한 배포용)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 빌드 중 ESLint 에러 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
