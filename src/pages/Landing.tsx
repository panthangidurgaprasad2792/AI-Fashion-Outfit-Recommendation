import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutGrid, Scissors, Wand2, Star } from 'lucide-react';

export const Landing: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#6366f1]/30 overflow-hidden font-sans">
      {/* Mouse Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
        }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">AI Fashion<span className="text-[#6366f1]">.</span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 text-[#6366f1] text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3" /> Meet Your AI Stylist
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold leading-[1.1] tracking-tight">
              AI Powered <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#4f46e5]">Fashion Outfit Recommendation System.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Digitize your wardrobe, get AI-powered outfit recommendations, and build your perfect look for any occasion.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/wardrobe"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-black font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[#6366f1]/50"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <div className="relative h-[600px] hidden lg:block" style={{ perspective: '2000px' }}>
            <motion.div 
              style={{ 
                y: y1,
                rotateX: (mousePosition.y - window.innerHeight / 2) / 50,
                rotateY: (mousePosition.x - window.innerWidth / 2) / 50,
              }}
              className="absolute top-10 right-20 w-64 bg-[#111] border border-white/10 rounded-[2rem] p-4 shadow-2xl rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-700 ease-out z-10"
            >
              <div className="aspect-[4/5] rounded-xl bg-[#0a0a0a] border border-white/5 mb-4 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500" alt="Fashion" />
              </div>
              <div className="h-4 w-1/2 bg-white/10 rounded-full mb-2" />
              <div className="h-3 w-1/3 bg-[#6366f1]/50 rounded-full" />
            </motion.div>

            <motion.div 
              style={{ 
                y: y2,
                rotateX: (mousePosition.y - window.innerHeight / 2) / -60,
                rotateY: (mousePosition.x - window.innerWidth / 2) / -60,
              }}
              className="absolute top-40 left-10 w-72 bg-[#111] border border-white/10 rounded-[2rem] p-4 shadow-2xl -rotate-6 z-20 hover:rotate-0 hover:scale-110 transition-all duration-700 ease-out"
            >
              <div className="aspect-square rounded-xl bg-[#0a0a0a] border border-white/5 mb-4 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1434389678369-182cb143cb65?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500" alt="Fashion" />
              </div>
              <div className="h-4 w-2/3 bg-white/10 rounded-full mb-2" />
              <div className="h-3 w-1/4 bg-[#6366f1]/50 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Marquee */}
      <div className="py-10 border-y border-white/5 bg-[#0a0a0a] overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center px-8"
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-4xl font-serif text-white/20">AI OUTFIT GENERATION</span>
              <Star className="w-6 h-6 text-[#6366f1]/50" />
              <span className="text-4xl font-serif text-white/20">SMART WARDROBE</span>
              <Star className="w-6 h-6 text-[#6366f1]/50" />
              <span className="text-4xl font-serif text-white/20">STYLE ANALYTICS</span>
              <Star className="w-6 h-6 text-[#6366f1]/50" />
              <span className="text-4xl font-serif text-white/20">DRAG & DROP BUILDER</span>
              <Star className="w-6 h-6 text-[#6366f1]/50" />
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-serif font-semibold mb-6">Everything you need to dress better.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">AI Fashion combines advanced AI vision with personal styling algorithms to revolutionize how you interact with your clothes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: LayoutGrid, title: "Digital Closet", desc: "Upload photos of your clothes. Our AI automatically removes backgrounds, categorizes, and tags them by color and style." },
            { icon: Wand2, title: "AI Stylist", desc: "Tell AI Fashion the occasion and weather. Get instantly curated, highly compatible outfit recommendations from your own clothes." },
            { icon: Scissors, title: "Outfit Builder", desc: "Mix and match items on a freeform canvas. Get real-time AI compatibility scores for your custom creations." }
          ].map((feature, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              key={i} 
              className="bg-[#111] border border-white/10 p-10 rounded-[3rem] hover:border-[#6366f1]/30 transition-colors group hover:-translate-y-2 duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#6366f1]/10 group-hover:scale-110 transition-all duration-500">
                <feature.icon className="w-8 h-8 text-[#6366f1]" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366f1]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-7xl font-serif font-semibold mb-8">Ready to transform your style?</h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/wardrobe"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold uppercase tracking-widest hover:bg-[#6366f1] transition-all text-lg shadow-2xl"
              >
                Open Your Wardrobe <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AI Fashion. All rights reserved.</p>
      </footer>
    </div>
  );
};
