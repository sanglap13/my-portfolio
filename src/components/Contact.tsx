'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/utils/animations';

type Intent = 'none' | 'resume' | 'email' | 'message';

export default function Contact({ className }: { className?: string }) {
  const [intent, setIntent] = useState<Intent>('none');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent,
          senderEmail: formData.email,
          senderName: formData.name || undefined,
          message: formData.message || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIntent('none');
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section 
      id="contact" 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn("py-32 px-8 md:px-24 bg-transparent flex justify-center relative overflow-hidden", className)}
    >
      {/* Ambient Moving Background Orbs */}
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-theme-indigo/10 blur-[120px] rounded-full pointer-events-none z-0"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-theme-amber/5 blur-[150px] rounded-full pointer-events-none z-0"
      />
      {/* Light Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div variants={fadeUpVariant} className="w-full max-w-4xl bg-black/40 border border-white/10 rounded-[2rem] p-8 md:p-16 backdrop-blur-2xl relative overflow-hidden z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-theme-indigo/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-theme-amber/10 blur-[100px] rounded-full" />

        <div className="relative z-10">
            <h2 className="geist-sans text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">What's Next?</h2>
            <p className="geist-mono text-gray-400 mb-12 max-w-xl leading-relaxed">
              Whether you need to review my qualifications, have a direct conversation, or just want to drop a casual note, just click what you need.
            </p>

            <AnimatePresence mode="wait">
              {intent === 'none' && (
                <motion.div 
                  key="selector"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <button onClick={() => setIntent('resume')} className="flex flex-col items-center justify-center gap-4 py-12 px-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-theme-indigo/10 hover:border-theme-indigo/50 transition-all duration-300 group">
                    <span className="text-4xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">📄</span>
                    <span className="geist-sans font-bold text-white text-lg drop-shadow-md">Request Resume</span>
                    <span className="geist-mono text-xs text-gray-500">Get my latest CV</span>
                  </button>

                  <button onClick={() => setIntent('email')} className="flex flex-col items-center justify-center gap-4 py-12 px-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-theme-amber/10 hover:border-theme-amber/50 transition-all duration-300 group">
                    <span className="text-4xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">📧</span>
                    <span className="geist-sans font-bold text-white text-lg drop-shadow-md">Get Direct Email</span>
                    <span className="geist-mono text-xs text-gray-500">Reach my inbox</span>
                  </button>

                  <button onClick={() => setIntent('message')} className="flex flex-col items-center justify-center gap-4 py-12 px-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/15 transition-all duration-300 group">
                    <span className="text-4xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">💬</span>
                    <span className="geist-sans font-bold text-white text-lg drop-shadow-md">Write a Message</span>
                    <span className="geist-mono text-xs text-gray-500">Quick contact form</span>
                  </button>
                </motion.div>
              )}

              {intent === 'resume' && (
                <motion.form 
                  key="resume"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <button type="button" onClick={() => { setIntent('none'); setError(''); setSuccess(false); }} className="text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg geist-mono text-sm">
                      &larr; Back
                    </button>
                    <h3 className="geist-sans text-xl font-bold text-white">Where should I send the resume?</h3>
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" className="geist-mono w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-theme-indigo/50 transition-colors" required disabled={isSubmitting || success} />
                  
                  {error && <p className="text-red-400 text-sm geist-mono">{error}</p>}
                  {success && <p className="text-green-400 text-sm geist-mono">Request saved! Sending you back...</p>}

                  <button type="submit" disabled={isSubmitting || success} className="geist-sans px-8 py-4 bg-theme-indigo/20 text-indigo-300 font-semibold rounded-xl hover:bg-theme-indigo hover:text-white border border-theme-indigo/50 transition-all self-start shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Sending Request...' : 'Send Request'}
                  </button>
                </motion.form>
              )}

              {intent === 'email' && (
                <motion.form 
                  key="email"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <button type="button" onClick={() => { setIntent('none'); setError(''); setSuccess(false); }} className="text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg geist-mono text-sm">
                      &larr; Back
                    </button>
                    <h3 className="geist-sans text-xl font-bold text-white">Let's connect directly.</h3>
                  </div>
                  <p className="geist-mono text-gray-400 text-sm -mt-4">Drop your email below and I'll reach out to your inbox.</p>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" className="geist-mono w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-theme-amber/50 transition-colors" required disabled={isSubmitting || success} />
                  
                  {error && <p className="text-red-400 text-sm geist-mono">{error}</p>}
                  {success && <p className="text-green-400 text-sm geist-mono">Saved! I'll reach out soon.</p>}

                  <button type="submit" disabled={isSubmitting || success} className="geist-sans px-8 py-4 bg-theme-amber/20 text-amber-400 font-semibold rounded-xl hover:bg-theme-amber hover:text-white border border-theme-amber/50 transition-all self-start shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Requesting...' : 'Request Connection'}
                  </button>
                </motion.form>
              )}

              {intent === 'message' && (
                <motion.form 
                  key="message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <button type="button" onClick={() => { setIntent('none'); setError(''); setSuccess(false); }} className="text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg geist-mono text-sm">
                      &larr; Back
                    </button>
                    <h3 className="geist-sans text-xl font-bold text-white">Drop a message.</h3>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="geist-mono w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors" required disabled={isSubmitting || success} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="geist-mono w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors" required disabled={isSubmitting || success} />
                  </div>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message..." rows={4} className="geist-mono w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none" required disabled={isSubmitting || success} />
                  
                  {error && <p className="text-red-400 text-sm geist-mono">{error}</p>}
                  {success && <p className="text-green-400 text-sm geist-mono">Message delivered securely.</p>}

                  <button type="submit" disabled={isSubmitting || success} className="geist-sans px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white hover:text-black border border-white/10 transition-all self-start disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
