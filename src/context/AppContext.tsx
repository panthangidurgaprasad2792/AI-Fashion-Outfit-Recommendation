import React, { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { WardrobeItem, UserProfile, OutfitRecommendation } from '../types';
import { analyzeClothingItem, analyzeUserProfile, generateOutfits } from '../services/gemini';

interface AppContextType {
  wardrobe: WardrobeItem[];
  setWardrobe: React.Dispatch<React.SetStateAction<WardrobeItem[]>>;
  isAnalyzingItem: boolean;
  handleUploadItem: (dataUrl: string) => Promise<void>;
  removeWardrobeItem: (id: string) => void;
  
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAnalyzingProfile: boolean;
  handleUploadProfile: (dataUrl: string) => Promise<void>;
  
  occasion: string;
  setOccasion: React.Dispatch<React.SetStateAction<string>>;
  weather: string;
  setWeather: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  recommendations: OutfitRecommendation[];
  handleGenerateOutfits: () => Promise<void>;
  
  savedOutfits: OutfitRecommendation[];
  handleSaveOutfit: (outfit: OutfitRecommendation) => void;
  
  builderSlots: Record<string, WardrobeItem | null>;
  setBuilderSlots: React.Dispatch<React.SetStateAction<Record<string, WardrobeItem | null>>>;
  builderScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isAnalyzingItem, setIsAnalyzingItem] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAnalyzingProfile, setIsAnalyzingProfile] = useState(false);
  
  const [occasion, setOccasion] = useState('Casual');
  const [weather, setWeather] = useState('Sunny');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<OutfitRecommendation[]>([]);

  const [builderSlots, setBuilderSlots] = useState<Record<string, WardrobeItem | null>>({
    Top: null,
    Bottom: null,
    Shoes: null,
    Accessory: null
  });

  // Debug log for wardrobe changes
  React.useEffect(() => {
    console.log('Current wardrobe state:', wardrobe);
  }, [wardrobe]);

  const handleUploadItem = async (dataUrl: string) => {
    try {
      setIsAnalyzingItem(true);
      console.log('Starting item analysis...');
      const analysis = await analyzeClothingItem(dataUrl);
      console.log('Analysis successful:', analysis);
      const newItem = {
        id: Math.random().toString(36).substring(7),
        imageUrl: dataUrl,
        ...analysis
      } as WardrobeItem;
      setWardrobe(prev => {
        const updated = [...prev, newItem];
        console.log('Updated wardrobe count:', updated.length);
        return updated;
      });
      toast.success('Item added to wardrobe!');
    } catch (error) {
      console.error('Error analyzing item:', error);
      toast.error('Failed to analyze clothing item. Please try again.');
    } finally {
      setIsAnalyzingItem(false);
    }
  };

  const removeWardrobeItem = (id: string) => {
    setWardrobe(prev => prev.filter(item => item.id !== id));
    setBuilderSlots(prev => {
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach(key => {
        if (newSlots[key]?.id === id) newSlots[key] = null;
      });
      return newSlots;
    });
    toast.success('Item removed from wardrobe');
  };

  const handleUploadProfile = async (dataUrl: string) => {
    try {
      setIsAnalyzingProfile(true);
      const analysis = await analyzeUserProfile(dataUrl);
      setProfile({
        imageUrl: dataUrl,
        ...analysis
      });
      toast.success('Style profile updated!');
    } catch (error) {
      console.error('Error analyzing profile:', error);
      toast.error('Failed to analyze profile. Please try again.');
    } finally {
      setIsAnalyzingProfile(false);
    }
  };

  const handleGenerateOutfits = async () => {
    if (wardrobe.length === 0 && !profile) {
      toast.error('Please add some items to your wardrobe or upload a profile photo first!');
      return;
    }
    try {
      setIsGenerating(true);
      const outfits = await generateOutfits(wardrobe, profile, occasion, weather);
      setRecommendations(outfits);
      toast.success('Outfits generated successfully!');
    } catch (error) {
      console.error('Error generating outfits:', error);
      toast.error('Failed to generate outfits. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOutfit = (outfit: OutfitRecommendation) => {
    if (!savedOutfits.find(o => o.id === outfit.id)) {
      setSavedOutfits(prev => [...prev, outfit]);
      toast.success('Outfit saved to your looks!');
    } else {
      setSavedOutfits(prev => prev.filter(o => o.id !== outfit.id));
      toast.success('Outfit removed from saved looks');
    }
  };

  const builderScore = useMemo(() => {
    const filledSlots = Object.values(builderSlots).filter(Boolean).length;
    if (filledSlots === 0) return 0;
    const hash = Object.values(builderSlots).filter(Boolean).reduce((acc: number, item) => acc + (item as WardrobeItem).id.charCodeAt(0), 0) as number;
    return Math.min(99, 75 + (hash % 25));
  }, [builderSlots]);

  return (
    <AppContext.Provider value={{
      wardrobe, setWardrobe, isAnalyzingItem, handleUploadItem, removeWardrobeItem,
      profile, setProfile, isAnalyzingProfile, handleUploadProfile,
      occasion, setOccasion, weather, setWeather, isGenerating, recommendations, handleGenerateOutfits,
      savedOutfits, handleSaveOutfit,
      builderSlots, setBuilderSlots, builderScore
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
