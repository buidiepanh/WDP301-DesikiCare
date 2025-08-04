"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Values from "./components/Values";
import Team from "./components/Team";

const AboutPage = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="bg-white text-gray-800 min-h-screen w-full">
      {/* <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 z-50 py-6 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold tracking-tighter">Desiki</div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-black font-medium">
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Journal
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Login
          </a>
          <a
            href="#"
            className="bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </header> */}
      <main>
        <Hero scrollToNextSection={scrollToNextSection} />
        <Story />
        <Values />
        <Team />
      </main>
      {/* <footer className="bg-gray-100 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Desiki</h3>
            <p className="text-gray-600 mb-4">
              Premium skincare products for your daily routine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-black">
                Instagram
              </a>
              <a href="#" className="text-gray-500 hover:text-black">
                Facebook
              </a>
              <a href="#" className="text-gray-500 hover:text-black">
                Twitter
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Bestsellers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Gifts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Track Order
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2023 Desiki. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-black">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black">
                Terms of Service
              </a>
              <a href="#" className="hover:text-black">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};
export default AboutPage;
