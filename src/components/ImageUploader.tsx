import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUpload: (dataUrl: string) => Promise<void>;
  label?: string;
  isAnalyzing?: boolean;
  analyzingMessages?: string[];
}

export function ImageUploader({ 
  onUpload, 
  label = "Upload Image", 
  isAnalyzing = false,
  analyzingMessages = ["AI is analyzing..."]
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (isAnalyzing && analyzingMessages.length > 1) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % analyzingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setMsgIndex(0);
    }
  }, [isAnalyzing, analyzingMessages]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        await onUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[2rem] transition-all duration-500 group overflow-hidden ${
        dragActive ? 'border-[#6366f1] bg-[#6366f1]/10 scale-[1.02]' : 'border-white/10 bg-[#111] hover:bg-white/5 hover:border-white/20'
      } ${isAnalyzing ? 'opacity-90 pointer-events-none' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
      
      {isAnalyzing && (
        <motion.div 
          className="absolute left-0 right-0 h-1 bg-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-[#6366f1] relative z-10"
          >
            <Loader2 className="w-12 h-12 mb-6 animate-spin" />
            <AnimatePresence mode="wait">
              <motion.p 
                key={msgIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-bold uppercase tracking-widest text-center px-6 h-6"
              >
                {analyzingMessages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-gray-400 relative z-10"
          >
            <div className="p-5 mb-5 rounded-full bg-[#0a0a0a] shadow-2xl border border-white/5 group-hover:scale-110 group-hover:border-[#6366f1]/30 transition-all duration-500">
              <Upload className="w-8 h-8 text-[#6366f1]" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-200">{label}</p>
            <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
