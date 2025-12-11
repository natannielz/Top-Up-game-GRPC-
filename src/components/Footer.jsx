import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ShieldCheck, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cyber-black border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-orbitron font-bold text-lg">G</span>
              </div>
              <span className="font-orbitron font-bold text-xl tracking-wider text-white">
                GAMER<span className="text-cyber-cyan">ZONE</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for instant game top-ups and digital credits.
              Secure transactions, 24/7 support, and instant delivery.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-all group">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-all group">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-all group">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-all group">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-6 text-white">SUPPORT</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Order Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Report Issue</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-6 text-white">LEGAL</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact & Verified Column */}
          <div className="space-y-8">
            <div>
              <h4 className="font-orbitron font-bold text-lg mb-6 text-white">CONTACT</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Mail size={16} className="mt-1 text-cyber-cyan" />
                  <span>support@gamerzone.com</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Phone size={16} className="mt-1 text-cyber-cyan" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="mt-1 text-cyber-cyan" />
                  <span>123 Gaming Street, NY 10001</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-orbitron font-bold text-sm mb-4 text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" />
                VERIFIED SECURE
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white px-3 py-1 rounded flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                  <span className="font-bold text-blue-800 text-xs italic tracking-tighter">VISA</span>
                </div>
                <div className="bg-white px-3 py-1 rounded flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                  <span className="font-bold text-red-600 text-xs">Mastercard</span>
                </div>
                <div className="bg-white px-3 py-1 rounded flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                  <span className="font-bold text-black text-xs">QRIS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} GamerZone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 text-center">
              Prices and availability subject to change without notice. <br className="md:hidden" />
              All trademarks are property of their respective owners.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
