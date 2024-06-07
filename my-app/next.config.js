/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.ambicam.com/ambicamapiv5.asmx/:path*',
      },
      {
        source: '/core/:path*',
        destination: 'https://octopus-app-gl75w.ondigitalocean.app/:path*',
      },
    
    ];
  },

  reactStrictMode: true,
  swcMinify: true,
  images: {
  unoptimized: true
  }

  
  };
  
  module.exports = nextConfig;