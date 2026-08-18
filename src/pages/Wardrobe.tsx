import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Trash2, Maximize2, X } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { useAppContext } from '../context/AppContext';
import { WardrobeItem } from '../types';

export const Wardrobe: React.FC = () => {
  const { wardrobe, handleUploadItem, isAnalyzingItem, removeWardrobeItem } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  console.log('Wardrobe rendering, items count:', wardrobe.length);

  return (
    <motion.div
      key="wardrobe"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Header Banner */}
      <div className="bg-[#111] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366f1]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex-1 space-y-4 z-10 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-white">Digital Wardrobe</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Digitize your closet. Upload your clothing items and let our AI automatically categorize, tag, and organize them for you.
          </p>
        </div>
        
        <div className="w-full lg:w-[400px] shrink-0 z-10">
          <ImageUploader 
            onUpload={handleUploadItem} 
            isAnalyzing={isAnalyzingItem}
            label="Add Clothing Item"
            analyzingMessages={[
              "Scanning item...",
              "Detecting category...",
              "Analyzing colors & style...",
              "Adding to wardrobe..."
            ]}
          />
        </div>
      </div>

      {/* Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-serif font-medium text-white">
            Your Items <span className="text-gray-500 text-lg ml-2">({wardrobe.length})</span>
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {wardrobe.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="h-80 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] text-gray-500 bg-white/5 hover:bg-white/10 hover:border-[#6366f1]/30 transition-all duration-500 group"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shirt className="w-16 h-16 mb-6 opacity-50 text-[#6366f1] group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              </motion.div>
              <p className="font-serif text-2xl text-gray-300 mb-2 group-hover:text-white transition-colors">Your wardrobe is empty</p>
              <p className="text-sm group-hover:text-gray-400 transition-colors">Add items above to get personalized recommendations</p>
            </motion.div>
          ) : (
            <motion.div 
              key="wardrobe-grid"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              <AnimatePresence>
                {wardrobe.map((item) => (
                  <motion.div 
                    layout
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 20 },
                      show: { opacity: 1, scale: 1, y: 0 }
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ 
                      type: 'spring',
                      damping: 25,
                      stiffness: 120
                    }}
                    whileHover={{ y: -12, scale: 1.03, rotateZ: 1 }}
                    key={item.id} 
                    className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[#6366f1]/20 hover:border-[#6366f1]/50 transition-all duration-500 ease-out cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="aspect-[4/5] bg-[#0a0a0a] p-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-0 opacity-60" />
                      <img 
                        src={item.imageUrl} 
                        alt={item.description} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                      <span className="absolute top-5 left-5 z-20 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg group-hover:bg-[#6366f1] group-hover:text-black group-hover:border-[#6366f1] transition-colors duration-300">
                        {item.category}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWardrobeItem(item.id);
                        }}
                        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center backdrop-blur-md border border-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 relative z-20 bg-[#111]">
                      <p className="text-base font-medium text-gray-200 truncate mb-1.5 group-hover:text-white transition-colors">{item.description}</p>
                      <p className="text-xs text-[#6366f1] truncate font-bold tracking-widest uppercase">{item.color} • {item.style}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-full md:w-1/2 bg-[#0a0a0a] p-12 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={selectedItem.imageUrl} alt={selectedItem.description} className="w-full h-full object-contain relative z-10" />
              </div>
              
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-[80px] pointer-events-none" />
                
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-xs font-bold uppercase tracking-widest border border-[#6366f1]/20 w-max mb-6">
                  {selectedItem.category}
                </span>
                
                <h3 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-4 leading-tight">
                  {selectedItem.description}
                </h3>
                
                <div className="space-y-6 mt-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Color</p>
                    <p className="text-lg text-gray-200 capitalize">{selectedItem.color}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Style</p>
                    <p className="text-lg text-gray-200 capitalize">{selectedItem.style}</p>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/10">
                  <button 
                    onClick={() => {
                      removeWardrobeItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
                  >
                    <Trash2 className="w-5 h-5" /> Remove from Wardrobe
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
