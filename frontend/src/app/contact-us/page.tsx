"use client";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Have questions, feedback, or need help? We'd love to hear from you. Reach out to us directly or use the form below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                📞 <strong>Phone:</strong> <br />
                <a href="tel:+918392967440" className="text-blue-600 hover:underline">
                  +91 8392967440
                </a>
              </div>
              <div>
                📧 <strong>Email:</strong> <br />
                <a
                  href="mailto:piyush89332@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  piyush89332@gmail.com
                </a>
              </div>
              <div>
                📍 <strong>Location:</strong> <br />
                India (Available remotely)
              </div>
              <div>
                💼 <strong>Support Hours:</strong> <br />
                Monday – Saturday, 10:00 AM – 6:00 PM IST
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default page;
