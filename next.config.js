/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Se o repositório NÃO for username.github.io, descomente e ajuste:
  // basePath: '/nome-do-repositorio',
  // assetPrefix: '/nome-do-repositorio/',
};

module.exports = nextConfig;
