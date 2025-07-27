"use client";
import React from 'react';

const features = [
  {
    title: "Easy Login & Signup",
    description: "You can login using your Google account or manually sign up using your email and password. Our Google OAuth integration ensures a seamless and quick login experience.",
    icon: "🔐",
  },
  {
    title: "Secure User Authentication",
    description: "All user data is protected using JWT (JSON Web Tokens) and encrypted connections. Your credentials are never stored in plain text.",
    icon: "🛡️",
  },
  {
    title: "Smart Book Listings",
    description: "List books to sell with just a few clicks. You can add images, pricing, and descriptions — all managed via your personal dashboard.",
    icon: "📚",
  },
  {
    title: "Secure Payments",
    description: "We use Razorpay and other trusted payment gateways to ensure your payments are fast, safe, and reliable.",
    icon: "💳",
  },
  {
    title: "Admin Panel Access",
    description: "Admins have access to a full-featured dashboard to manage listings, users, and transactions with proper authentication.",
    icon: "🧑‍💼",
  },
  {
    title: "Reliable Database",
    description: "Your data is stored in a secure and scalable database with full encryption and regular backups.",
    icon: "💾",
  },
];
const page = () => {
 return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">How BookKart Works</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          BookKart is designed to simplify the process of buying and selling books online. Here’s how we make it secure, fast, and easy for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default page
