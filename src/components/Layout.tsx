import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { 
  User, Sparkles, LayoutGrid, Scissors, Bookmark, X, Search, Bell
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = [...Array(25)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-[#6366f1]/20 rounded-full blur-[1px]"
          style={{ width: p.size, height: p.size }}
          initial={{
            left: p.left,
            top: p.top,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: [0, -400],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 0.4, 0],
            scale: [0.5, 2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const CustomCursor = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], input, select, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#6366f1]/50 rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.3)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#6366f1] rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 400, mass: 0.1 }}
      />
    </>
  );
};

const navItems = [
  { id: '/wardrobe', label: 'Wardrobe', icon: LayoutGrid },
  { id: '/profile', label: 'Style Profile', icon: User },
  { id: '/stylist', label: 'AI Stylist', icon: Sparkles },
  { id: '/builder', label: 'Outfit Builder', icon: Scissors },
  { id: '/saved', label: 'Saved Looks', icon: Bookmark },
];

export const Layout: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const { profile } = useAppContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 font-sans overflow-hidden selection:bg-[#6366f1]/30 relative">
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }} />
      <BackgroundParticles />
      <CustomCursor mousePosition={mousePosition} />
      
      {/* Mouse Glow */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
        }}
      />
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-72 hidden lg:flex flex-col bg-[#050505]/95 backdrop-blur-3xl border-r border-white/5 h-screen sticky top-0 z-50">
        <div className="p-8 flex items-center gap-4 relative z-10">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#6366f1]/20"
          >
            <Sparkles className="w-6 h-6 text-black" />
          </motion.div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight text-white leading-tight">AI Fashion<span className="text-[#6366f1]">.</span></h1>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4 relative z-10">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.id}
              className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                location.pathname === item.id 
                  ? 'text-black shadow-lg shadow-[#6366f1]/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {location.pathname === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#6366f1] rounded-2xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {location.pathname !== item.id && (
                <div className="absolute inset-0 bg-white/5 rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${location.pathname === item.id ? 'text-black' : 'text-gray-500 group-hover:text-[#6366f1] transition-colors'}`} />
              <span className="font-medium tracking-wide relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Mini */}
        <Link to="/profile">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 m-6 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer relative z-10" 
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 overflow-hidden border border-white/10">
               {profile?.imageUrl ? (
                 <img src={profile.imageUrl} className="w-full h-full object-cover"/>
               ) : (
                 <User className="w-6 h-6 m-auto mt-3 text-gray-400" />
               )}
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Style Profile</p>
              <p className="text-xs text-[#6366f1] font-medium mt-0.5">{profile ? 'Active' : 'Not configured'}</p>
            </div>
          </motion.div>
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden custom-scrollbar overflow-y-auto">
        
        {/* Top Nav */}
        <header className="h-20 lg:h-24 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-4 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">AI Fashion<span className="text-[#6366f1]">.</span></span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md group">
               <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6366f1] transition-colors" />
               <input type="text" placeholder="Search your wardrobe..." className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-[#6366f1]/50 focus:bg-white/10 transition-all placeholder:text-gray-600" />
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
               <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
             </button>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full pb-32 lg:pb-12">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
          <nav className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl shadow-black/50">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.id}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.id 
                    ? 'text-[#6366f1] bg-white/5' 
                    : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${location.pathname === item.id ? 'text-[#6366f1]' : ''}`} />
                {location.pathname === item.id && (
                  <motion.div 
                    layoutId="bottomNavActive"
                    className="absolute -bottom-1 w-1 h-1 bg-[#6366f1] rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
};
