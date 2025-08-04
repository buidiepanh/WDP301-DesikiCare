import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-white font-instrument grid grid-cols-3 py-6 border-t border-gray-100">
      <div className="flex items-center px-5 justify-start">
        <p className="font-semibold text-gray-300">
          © Copyright Desiki Website 2025
        </p>
      </div>
      <div className="flex items-center justify-center gap-6 font-md text-gray-500">
        <p className="hover:underline cursor-pointer">Shipment Privacy</p>
        <p className="hover:underline cursor-pointer">Term of Services</p>
        <p className="hover:underline cursor-pointer">Contact</p>
      </div>
      <div className="flex items-center justify-end px-5 gap-3">
        {/* Instagram */}
        <div className="p-2 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full hover:scale-110 transition-transform cursor-pointer">
          <Instagram className="h-5 w-5 text-white" />
        </div>
        {/* Facebook */}
        <div className="p-2 bg-blue-600 rounded-full hover:scale-110 transition-transform cursor-pointer">
          <Facebook className="h-5 w-5 text-white" />
        </div>
        {/* Twitter */}
        <div className="p-2 bg-black rounded-full hover:scale-110 transition-transform cursor-pointer">
          <Twitter className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
