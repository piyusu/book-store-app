"use client";
import React from "react";

const blogs = [
  {
    title: "Top 10 Must-Read Books for Students",
    summary:
      "Explore a curated list of books that every student should read to boost knowledge, imagination, and life skills.",
    date: "July 24, 2025",
    image: "📘",
  },
  {
    title: "How to Sell Your Old Books Online",
    summary:
      "Learn the best tips and tricks for listing and selling your used books effectively on BookKart.",
    date: "July 18, 2025",
    image: "💸",
  },
  {
    title: "Why Secure Payments Matter",
    summary:
      "Understand the importance of using secure gateways like Razorpay when handling transactions online.",
    date: "July 10, 2025",
    image: "🔒",
  },
  {
    title: "Manual Signup vs Google Login",
    summary:
      "We break down the pros and cons of using Google OAuth and manual registration for your BookKart account.",
    date: "July 2, 2025",
    image: "🔑",
  },
  {
    title: "The Future of Online Bookstores",
    summary:
      "Get insights into how technology is shaping the online bookstore ecosystem and where BookKart fits in.",
    date: "June 20, 2025",
    image: "🌐",
  },
];
const page = () => {
 return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Latest Blogs</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover tips, updates, and insights on how to get the most out of BookKart and the online book-selling world.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6"
            >
              <div className="text-5xl mb-4">{blog.image}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
              <p className="text-gray-600">{blog.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page
