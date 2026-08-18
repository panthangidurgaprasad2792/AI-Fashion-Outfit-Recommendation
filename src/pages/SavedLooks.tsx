import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, ShoppingBag, Maximize2, X, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OutfitRecommendation } from '../types';

export const SavedLooks: React.FC = () => {
  const { savedOutfits, handleSaveOutfit, wardrobe } = useAppContext();
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null);

  return (
    <motion.div
      key="saved"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-5xl font-serif font-semibold tracking-tight text-white">Saved Looks</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6366f1]/50 to-transparent ml-12" />
      </div>

      {savedOutfits.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="h-80 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] text-gray-500 bg-white/5 hover:bg-white/10 hover:border-[#6366f1]/30 transition-all duration-500 group"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bookmark className="w-16 h-16 mb-6 opacity-50 text-[#6366f1] group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </motion.div>
          <p className="font-serif text-2xl text-gray-300 mb-2 group-hover:text-white transition-colors">No saved outfits yet</p>
          <p className="text-sm group-hover:text-gray-400 transition-colors">Generate and save outfits from the AI Stylist to see them here.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10"
        >
          {savedOutfits.map((outfit, idx) => (
            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              key={outfit.id} 
              onClick={() => setSelectedOutfit(outfit)}
              className="bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl hover:shadow-[#6366f1]/10 hover:border-[#6366f1]/30 transition-all duration-500 group relative cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#6366f1]/20 transition-colors duration-700 pointer-events-none" />
              
              <div className="p-8 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="pr-4">
                    <h4 className="text-2xl font-serif font-semibold text-white group-hover:text-[#6366f1] transition-colors mb-2 leading-tight">{outfit.title}</h4>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveOutfit(outfit);
                    }}
                    className="w-10 h-10 rounded-full bg-[#6366f1] border border-[#6366f1] text-white flex items-center justify-center transition-all shadow-lg hover:bg-red-500 hover:border-red-500 hover:text-white shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex-1 bg-[#0a0a0a] relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  {outfit.items.slice(0, 4).map((item, i) => {
                    const wItem = item.wardrobeItemId ? wardrobe.find(w => w.id === item.wardrobeItemId) : null;
                    return (
                      <div key={i} className="aspect-square rounded-2xl bg-[#111] border border-white/5 p-3 relative group/img overflow-hidden">
                        {wItem ? (
                          <img src={wItem.imageUrl} className="w-full h-full object-contain group-hover/img:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#6366f1]/5">
                            <ShoppingBag className="w-8 h-8 text-[#6366f1]/40" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                           <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border border-white/10 truncate block text-center">
                             {item.category}
                           </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Outfit Detail Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOutfit(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden max-w-5xl w-full shadow-2xl relative my-auto"
            >
              <button 
                onClick={() => setSelectedOutfit(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-10 md:p-16 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-[100px] pointer-events-none" />
                <h3 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-4 leading-tight relative z-10">
                  {selectedOutfit.title}
                </h3>
                <p className="text-lg text-gray-400 max-w-2xl relative z-10">{selectedOutfit.description}</p>
              </div>
              
              <div className="p-10 md:p-16 bg-[#0a0a0a]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h4 className="text-xl font-serif text-white border-b border-white/10 pb-4">Outfit Items</h4>
                    {selectedOutfit.items.map((item, i) => {
                      const wItem = item.wardrobeItemId ? wardrobe.find(w => w.id === item.wardrobeItemId) : null;
                      return (
                        <div key={i} className="flex gap-6 items-start bg-[#111] p-4 rounded-2xl border border-white/5">
                          <div className="w-24 h-24 rounded-xl bg-black/50 p-2 shrink-0 border border-white/5">
                            {wItem ? (
                              <img src={wItem.imageUrl} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#6366f1]/5">
                                <ShoppingBag className="w-8 h-8 text-[#6366f1]/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]">{item.category}</span>
                              {item.isExternal && (
                                <span className="text-[9px] bg-[#6366f1] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm shadow-[#6366f1]/20">
                                  Suggest to Buy
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-200 mb-2 leading-tight">{item.description}</p>
                            {item.isExternal && item.searchQuery && (
                              <a 
                                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.searchQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold uppercase tracking-wider text-[#6366f1] hover:text-white transition-colors group/link"
                              >
                                Shop Item <ExternalLink className="w-3 h-3 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-8">
                    <h4 className="text-xl font-serif text-white border-b border-white/10 pb-4">Styling Notes</h4>
                    <div className="space-y-6">
                      {selectedOutfit.items.map((item, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1] mb-2">{item.category}</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{item.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
