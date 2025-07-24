import React from "react";
import Link from "next/link";
import { Clock, Facebook, HeadphonesIcon, Instagram, Shield, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">ABOUT US</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-white cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              USEFUL LINKS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white cursor-pointer"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white cursor-pointer">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">POLICIES</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-of-use"
                  className="hover:text-white cursor-pointer"
                >
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              STAY CONNECTED
            </h3>
            <div className="mb-4 flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
            <p className="text-sm ">
              `BookKart is a free platform where you can buy second hand books
              at very cheap prices. Buy used books online like college books,
              school books, much more near you.`
            </p>
          </div>
        </div>
        {/* feature section */}
        <section className="py-6">     
          <div className="container mx-auto text-center">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm">
                <div className="rounded-full p-3">
                  <Shield className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-sm text-gray-500">100% Secure Online Transaction</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm">
                <div className="rounded-full p-3">
                  <Clock className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold">BookKart Trust</h3>
                  <p className="text-sm text-gray-500">Money Transferred safely after Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-sm">
                <div className="rounded-full p-3">
                  <HeadphonesIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-sm text-gray-500">Friendly Cusotmer Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mb-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
          <p className="text-sm text-gray-400">
            &copy:{new Date().getFullYear()} BookKart, All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Image
            src="/icons/visa.svg"
            alt="visa"
            width={50}
            height={30}
            className="filter brightness-20 invert"
            />
            <Image
            src="/icons/rupay.svg"
            alt="rupay"
            width={50}
            height={30}
            className="filter brightness-20 invert"
            />
            <Image
            src="/icons/paytm.svg"
            alt="paytm"
            width={50}
            height={30}
            />
            <Image
            src="/icons/upi.svg"
            alt="upi"
            width={50}
            height={30}
            className="filter brightness-20 invert"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
