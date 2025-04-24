'use client';

import Link from 'next/link';
import {
  FaLeaf,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';



const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-[77px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <FaLeaf className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-white">GreenGarden</span>
            </Link>
            <p className="text-gray-400">
              Solusi terbaik untuk kebutuhan taman dan tanaman Anda. Kami menyediakan berbagai produk berkualitas tinggi untuk memperindah taman Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary">Beranda</Link>
              </li>
              <li>
                <Link href="/Blog" className="text-gray-400 hover:text-primary">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary">Hubungi Kami</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="text-primary mr-2" />
                <span className="text-gray-400">Jl. Rukoh, Banda Aceh</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-primary mr-2" />
                <span className="text-gray-400">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary mr-2" />
                <span className="text-gray-400">greengarden@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GreenGarden. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
