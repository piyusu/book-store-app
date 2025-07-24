/** @type {import ('next').NextConfig} */

const nextConfig = {
  reactStrictMode : true,
  eslint:{
    ignoreDuringBuilds: true,
  },
  images:{
    domains:['images.unsplash.com','media.istockphoto.com','res.cloudinary.com'],
  }
};

export default nextConfig;
