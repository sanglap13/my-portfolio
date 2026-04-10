'use client';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted! UI only mode active.");
  };

  return (
    <section id="contact" className="py-24 px-8 md:px-24 bg-[#121212] flex justify-center">
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-16 backdrop-blur-xl">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Get in Touch</h2>
        <p className="text-gray-400 mb-10">Liked my Portfolio? Have an interest in Software Development or Tech Communities? Drop me a message.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              required 
            />
          </div>
          <textarea 
            placeholder="Your Message..." 
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            required
          />
          <button 
            type="submit"
            className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors self-start mt-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
