import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Cloud, Coffee, Briefcase, PartyPopper, Heart, Crown, Plane, Activity, Sun, CloudRain, Snowflake, Flame, Loader2, Sparkles, Bookmark, ShoppingBag, ExternalLink, Maximize2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OutfitRecommendation } from '../types';

export const Stylist: React.FC = () => {
  const { 
    wardrobe, profile, occasion, setOccasion, weather, setWeather, 
    isGenerating, handleGenerateOutfits, recommendations, savedOutfits, handleSaveOutfit 
  } = useAppContext();
  
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null);

  return (
    <motion.div
      key="stylist"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      {/* Controls */}
      <div className="bg-[#111] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6366f1]/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-6">
            <label className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
              <User className="w-5 h-5 text-[#6366f1]" /> Select Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { id: 'Casual', icon: Coffee, img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=400' },
                { id: 'Office', icon: Briefcase, img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=400' },
                { id: 'Party', icon: PartyPopper, img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400' },
                { id: 'Date', icon: Heart, img: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=400' },
                { id: 'Wedding', icon: Crown, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400' },
                { id: 'Travel', icon: Plane, img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=400' },
                { id: 'Workout', icon: Activity, img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' },
              ].map(opt => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={opt.id}
                  onClick={() => setOccasion(opt.id)}
                  className={`relative aspect-[4/5] sm:aspect-square rounded-[2rem] border flex flex-col items-center justify-center gap-4 transition-all duration-500 overflow-hidden group ${
                    occasion === opt.id
                      ? 'border-[#6366f1] shadow-lg shadow-[#6366f1]/20'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <img 
                    src={opt.img} 
                    alt={opt.id} 
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                      occasion === opt.id ? 'scale-110 brightness-75' : 'brightness-[0.4] group-hover:brightness-50 group-hover:scale-110'
                    }`} 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${occasion === opt.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-40'}`} />
                  
                  <opt.icon className={`w-8 h-8 relative z-10 transition-all duration-500 ${occasion === opt.id ? 'text-[#6366f1] scale-110' : 'text-white/70 group-hover:text-white group-hover:scale-110'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest relative z-10 transition-colors duration-500 ${occasion === opt.id ? 'text-[#6366f1]' : 'text-white/70 group-hover:text-white'}`}>{opt.id}</span>
                  
                  {occasion === opt.id && (
                    <motion.div 
                      layoutId="occasion-active" 
                      className="absolute inset-0 border-4 border-[#6366f1] rounded-[2rem] z-20 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
              <Cloud className="w-5 h-5 text-[#6366f1]" /> Select Weather
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { id: 'Sunny', icon: Sun, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400' },
                { id: 'Cloudy', icon: Cloud, img: 'https://images.unsplash.com/photo-1483977399921-6cf3810ff51a?auto=format&fit=crop&q=80&w=400' },
                { id: 'Rainy', icon: CloudRain, img: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=400' },
                { id: 'Cold', icon: Snowflake, img: 'https://images.unsplash.com/photo-1477601263568-184e2c65358b?auto=format&fit=crop&q=80&w=400' },
                { id: 'Snowy', icon: Snowflake, img: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=400' },
                { id: 'Hot', icon: Flame, img: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&q=80&w=400' },
              ].map(opt => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={opt.id}
                  onClick={() => setWeather(opt.id)}
                  className={`relative aspect-[4/5] sm:aspect-square rounded-[2rem] border flex flex-col items-center justify-center gap-4 transition-all duration-500 overflow-hidden group ${
                    weather === opt.id
                      ? 'border-[#6366f1] shadow-lg shadow-[#6366f1]/20'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <img 
                    src={opt.img} 
                    alt={opt.id} 
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                      weather === opt.id ? 'scale-110 brightness-75' : 'brightness-[0.4] group-hover:brightness-50 group-hover:scale-110'
                    }`} 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${weather === opt.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-40'}`} />
                  
                  <opt.icon className={`w-8 h-8 relative z-10 transition-all duration-500 ${weather === opt.id ? 'text-[#6366f1] scale-110' : 'text-white/70 group-hover:text-white group-hover:scale-110'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest relative z-10 transition-colors duration-500 ${weather === opt.id ? 'text-[#6366f1]' : 'text-white/70 group-hover:text-white'}`}>{opt.id}</span>
                  
                  {weather === opt.id && (
                    <motion.div 
                      layoutId="weather-active" 
                      className="absolute inset-0 border-4 border-[#6366f1] rounded-[2rem] z-20 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: isGenerating || (wardrobe.length === 0 && !profile) ? 1 : 1.02 }}
              whileTap={{ scale: isGenerating || (wardrobe.length === 0 && !profile) ? 1 : 0.98 }}
              animate={!isGenerating && wardrobe.length > 0 ? {
                boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.4)", "0 0 0px rgba(99,102,241,0)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleGenerateOutfits}
              disabled={isGenerating || (wardrobe.length === 0 && !profile)}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white hover:from-[#4f46e5] hover:to-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest py-6 px-8 rounded-[2rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-[#6366f1]/20 hover:shadow-[#6366f1]/40 text-lg"
            >
              {isGenerating ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Curating Your Looks...</>
              ) : (
                <><Sparkles className="w-6 h-6" /> Generate Outfits</>
              )}
            </motion.button>
            {wardrobe.length === 0 && !profile && (
              <p className="text-sm text-red-400 mt-6 text-center font-medium">Please add items to your wardrobe or upload a profile photo first.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {isGenerating ? (
        <div className="space-y-10 mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-serif font-semibold tracking-tight text-white animate-pulse">Curating Looks...</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6366f1]/50 to-transparent ml-12" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-pulse">
                <div className="p-8 border-b border-white/10 bg-white/5 h-48"></div>
                <div className="p-8 flex-1 space-y-8 bg-[#0a0a0a]">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[1, 2, 3, 4].map(j => <div key={j} className="aspect-square rounded-2xl bg-white/5"></div>)}
                  </div>
                  <div className="space-y-6">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="space-y-2">
                        <div className="h-3 w-1/4 bg-white/10 rounded"></div>
                        <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                        <div className="h-3 w-full bg-white/5 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : recommendations.length > 0 && (
        <div className="space-y-10 mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-serif font-semibold tracking-tight text-white">Lookbook</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6366f1]/50 to-transparent ml-12" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {recommendations.map((outfit, idx) => {
              const score = 92 + (idx % 7); // Mock score for UI
              const isSaved = savedOutfits.find(o => o.id === outfit.id);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    rotateX: 2,
                    rotateY: -2,
                    boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)"
                  }}
                  key={outfit.id} 
                  onClick={() => setSelectedOutfit(outfit)}
                  className="bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl hover:border-[#6366f1]/40 transition-all duration-500 ease-out group relative cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#6366f1]/20 transition-colors duration-700 pointer-events-none" />
                  
                  <div className="p-8 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="pr-4">
                        <h4 className="text-3xl font-serif font-semibold text-white group-hover:text-[#6366f1] transition-colors mb-3 leading-tight">{outfit.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{outfit.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-4 shrink-0">
                        <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{score}% Match</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveOutfit(outfit);
                          }}
                          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-lg ${
                            isSaved 
                              ? 'bg-[#6366f1] border-[#6366f1] text-white' 
                              : 'bg-black/50 border-white/20 text-white hover:bg-[#6366f1] hover:border-[#6366f1] hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        {occasion}
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        {weather}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 space-y-8 bg-[#0a0a0a] relative z-10">
                    {/* Visual Grid of Items */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
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

                    {/* Detailed List */}
                    <div className="space-y-6">
                      {outfit.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start group/item">
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
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.reasoning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
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
