"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/DillyBoy08", icon: "💻" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/dylan-lee-swart-53229125b/", icon: "💼" },
    { name: "Email", href: "mailto:swartdylan42@gmail.com", icon: "📧" },
  ];

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 px-6 border-t border-transparent dark:border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold gradient-text mb-4">Dylan Swart</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Web Developer crafting modern, responsive applications with passion and precision.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 transition-all hover:scale-110 border border-transparent dark:border-slate-800"
                  aria-label={link.name}
                >
                  <span className="text-xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-6">Stay Connected</h4>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Get updates on my latest projects and tech insights.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="px-4 py-3 bg-gray-800 dark:bg-slate-900 border border-gray-700 dark:border-slate-800 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-purple-500/30 transition-all"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-gray-800 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {currentYear} Dylan Swart. Built with Next.js and Tailwind CSS
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
