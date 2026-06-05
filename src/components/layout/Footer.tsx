import Link from "next/link";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-white tracking-tight">
                  Hadmes
                </span>
                <span className="text-2xl font-serif font-light text-amber-400">
                  Hotel
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience unparalleled luxury and comfort at GrandDima Hotel. Where
              every moment becomes an extraordinary memory.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/rooms", label: "Our Rooms" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Room Service</li>
              <li>Spa & Wellness</li>
              <li>Fine Dining</li>
              <li>Event Planning</li>
              <li>Airport Transfer</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Alemgena, Ethiopia
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlinePhone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">+251 930100018</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineMail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">Hadmeshotel@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HadmesHotel. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
