import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shirt, LayoutGrid, ShoppingBag, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../context/AppContext';
import { WardrobeItem } from '../types';

export const OutfitBuilder: React.FC = () => {
  const { wardrobe, builderSlots, setBuilderSlots, builderScore } = useAppContext();
  const [draggedItem, setDraggedItem] = useState<WardrobeItem | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  useEffect(() => {
    if (builderScore >= 85) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#4f46e5', '#FFFFFF']
      });
    }
  }, [builderScore]);

  const handleDragStart = (e: React.DragEvent, item: WardrobeItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setHoveredSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, slotName: string) => {
    e.preventDefault();
    setHoveredSlot(slotName);
  };

  const handleDragLeave = () => {
    setHoveredSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotName: string) => {
    e.preventDefault();
    setHoveredSlot(null);
    setDraggedItem(null);
    try {
      const itemData = e.dataTransfer.getData('application/json');
      if (itemData) {
        const item = JSON.parse(itemData) as WardrobeItem;
        setBuilderSlots(prev => ({ ...prev, [slotName]: item }));
      }
    } catch (err) {
      console.error("Drop error", err);
    }
  };

  return (
    <motion.div
      key="builder"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-5xl font-serif font-semibold tracking-tight text-white mb-4">Outfit Builder</h2>
        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-lg">Drag and drop items from your wardrobe to build your own look and see your AI style compatibility score.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Slots */}
          <div className="flex-1 space-y-8">
             <h3 className="text-2xl font-serif text-white mb-2">Outfit Canvas</h3>
              <div className="grid grid-cols-2 gap-6">
                {['Top', 'Bottom', 'Shoes', 'Accessory'].map(slot => {
                   const isHovered = hoveredSlot === slot;
                   const isFilled = !!builderSlots[slot];
                   const isCompatible = draggedItem?.category === slot;

                   return (
                     <div 
                     key={slot}
                     onDragOver={(e) => handleDragOver(e, slot)}
                     onDragLeave={handleDragLeave}
                     onDrop={(e) => handleDrop(e, slot)}
                     className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                       isFilled ? 'border-[#6366f1]/50 bg-[#6366f1]/5 shadow-inner' : 
                       isHovered ? 'border-[#6366f1] bg-[#6366f1]/10 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.2)]' :
                       'border-white/10 bg-black/50 hover:border-white/30 hover:bg-white/5'
                     }`}
                   >
                     {isFilled ? (
                       <motion.div
                         initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                         animate={{ scale: 1, opacity: 1, rotate: 0 }}
                         transition={{ type: 'spring', bounce: 0.6 }}
                         className="w-full h-full relative group"
                       >
                         <img src={builderSlots[slot]!.imageUrl} className="w-full h-full object-contain p-6 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                         <button onClick={() => setBuilderSlots(p => ({...p, [slot]: null}))} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                           <X className="w-5 h-5" />
                         </button>
                       </motion.div>
                     ) : (
                       <div className={`text-center transition-colors duration-300 ${isHovered ? 'text-[#6366f1]' : 'text-gray-500'}`}>
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border transition-all duration-300 ${isHovered ? 'bg-[#6366f1]/20 border-[#6366f1]/50 scale-110' : 'bg-white/5 border-white/5'}`}>
                           {slot === 'Top' && <Shirt className={`w-6 h-6 ${isHovered ? 'text-[#6366f1]' : 'text-[#6366f1]/50'}`} />}
                           {slot === 'Bottom' && <LayoutGrid className={`w-6 h-6 ${isHovered ? 'text-[#6366f1]' : 'text-[#6366f1]/50'}`} />}
                           {slot === 'Shoes' && <ShoppingBag className={`w-6 h-6 ${isHovered ? 'text-[#6366f1]' : 'text-[#6366f1]/50'}`} />}
                           {slot === 'Accessory' && <Sparkles className={`w-6 h-6 ${isHovered ? 'text-[#6366f1]' : 'text-[#6366f1]/50'}`} />}
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest">{isHovered ? 'Drop Here' : `Drop ${slot}`}</span>
                       </div>
                     )}
                   </div>
                )})}
              </div>
          </div>

          {/* Score & Wardrobe selection */}
          <div className="w-full lg:w-96 flex flex-col gap-8">
             {/* Score Card */}
             <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-[2rem] p-8 text-white shadow-2xl shadow-[#6366f1]/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-700" />
               <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">AI Compatibility Score</p>
               <div className="flex items-end gap-2 mb-8">
                 <span className="text-7xl font-serif font-bold tracking-tighter">{builderScore}</span>
                 <span className="text-2xl font-medium mb-3">%</span>
               </div>
               <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${builderScore}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                 />
               </div>
             </div>

             {/* Draggable Wardrobe Items */}
             <div className="flex-1 bg-[#0a0a0a] rounded-[2rem] border border-white/10 p-6 flex flex-col shadow-inner">
               <h4 className="text-xs font-bold uppercase tracking-widest text-[#6366f1] mb-6">Drag Items to Canvas</h4>
               <div className="flex-1 overflow-y-auto pr-3 space-y-4 max-h-[400px] custom-scrollbar">
                 {wardrobe.map(item => (
                   <motion.div 
                     whileHover={{ scale: 1.05, y: -5 }}
                     key={item.id}
                     draggable
                     onDragStart={(e) => handleDragStart(e, item)}
                     onDragEnd={handleDragEnd}
                     className="bg-[#111] border border-white/10 rounded-2xl p-3 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:border-[#6366f1]/50 hover:bg-white/5 transition-all duration-300 group hover:shadow-lg hover:shadow-[#6366f1]/10"
                   >
                     <div className="w-16 h-16 rounded-xl bg-black/50 p-2 shrink-0 border border-white/5 group-hover:border-[#6366f1]/30 transition-colors">
                       <img src={item.imageUrl} className="w-full h-full object-contain" />
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-sm font-medium text-white truncate mb-1">{item.description}</p>
                       <p className="text-[10px] text-[#6366f1] uppercase tracking-widest font-bold">{item.category}</p>
                     </div>
                   </motion.div>
                 ))}
                 {wardrobe.length === 0 && (
                   <div className="text-center py-12">
                     <Shirt className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                     <p className="text-sm text-gray-500">Wardrobe is empty</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
