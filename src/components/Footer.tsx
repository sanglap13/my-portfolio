'use client';

import Link from 'next/link';
import config from '@/data/config.json';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';

export default function Footer({ className }: { className?: string }) {
  return (
    <motion.footer 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("relative z-20 py-20 px-8 md:px-24 bg-black border-t border-white/10 overflow-hidden", className)}
    >
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
        
        {/* Branding & Sign-off */}
        <motion.div variants={fadeUpVariant} className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="geist-sans text-3xl font-bold text-white tracking-tight mb-2">Sanglap Mridha.</h2>
          <p className="geist-mono text-gray-400 text-sm">Building digital experiences, one line at a time.</p>
        </motion.div>

        {/* Socials Matrix */}
        <motion.div variants={fadeUpVariant} className="flex flex-wrap justify-center gap-6 md:gap-10">
          {config.about.socials.map((social) => (
            <Link 
              key={social.name} 
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="geist-mono text-gray-400 hover:text-white transition-all duration-300 relative group text-sm md:text-base uppercase tracking-widest"
            >
              <span className="relative z-10">{social.name}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-theme-amber transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {/* Email / Contact Override */}
          <Link 
            href="#contact"
            className="geist-mono text-gray-400 hover:text-white transition-all duration-300 relative group text-sm md:text-base uppercase tracking-widest"
          >
            <span className="relative z-10">Contact</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-theme-indigo transition-all duration-300 group-hover:w-full" />
          </Link>
        </motion.div>

      </div>

      {/* Copyright */}
      <motion.div variants={fadeUpVariant} className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs geist-mono text-gray-600 relative z-10">
        <p>© {new Date().getFullYear()} {config.footer.text}</p>
        <p>Built with ❤️ using Next.js</p>
      </motion.div>
    </motion.footer>
  );
}
