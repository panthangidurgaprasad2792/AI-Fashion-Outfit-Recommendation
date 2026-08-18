import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { useAppContext } from '../context/AppContext';

export const Profile: React.FC = () => {
  const { profile, setProfile, handleUploadProfile, isAnalyzingProfile } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-serif font-semibold tracking-tight text-white mb-6">Your Style Profile</h2>
        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-lg">Upload a photo to let AI analyze your features for better, more personalized recommendations.</p>
      </div>

      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="bg-[#111] border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366f1]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        {profile ? (
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-10" style={{ transform: "translateZ(50px)" }}>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#6366f1]/20 shrink-0 shadow-2xl shadow-[#6366f1]/10 relative group">
              <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 border-4 border-[#6366f1] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100" />
            </div>
            <div className="space-y-8 flex-1 w-full">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm hover:border-[#6366f1]/30 transition-colors group">
                  <p className="text-[11px] text-[#6366f1] uppercase tracking-widest font-bold mb-3">Skin Tone</p>
                  <p className="text-2xl font-serif font-medium text-gray-100 group-hover:text-white transition-colors">{profile.skinTone}</p>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm hover:border-[#6366f1]/30 transition-colors group">
                  <p className="text-[11px] text-[#6366f1] uppercase tracking-widest font-bold mb-3">Body Shape</p>
                  <p className="text-2xl font-serif font-medium text-gray-100 group-hover:text-white transition-colors">{profile.bodyShape}</p>
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm hover:border-[#6366f1]/30 transition-colors">
                <p className="text-[11px] text-[#6366f1] uppercase tracking-widest font-bold mb-4">Stylist Notes</p>
                <p className="text-base text-gray-300 leading-relaxed">{profile.styleNotes}</p>
              </div>
              <button 
                onClick={() => setProfile(null)}
                className="text-sm text-[#6366f1] hover:text-white font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Retake Analysis
              </button>
            </div>
          </div>
        ) : (
          <div style={{ transform: "translateZ(50px)" }}>
            <ImageUploader 
              onUpload={handleUploadProfile} 
              isAnalyzing={isAnalyzingProfile}
              label="Upload Full Body Photo"
              analyzingMessages={[
                "Analyzing body type...",
                "Detecting color palette...",
                "Generating style profile..."
              ]}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
