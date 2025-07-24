import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode : true,
  images:{
    domains:['images.unsplash.com','media.istockphoto.com','res.cloudinary.com'],
  }
};

export default nextConfig;
