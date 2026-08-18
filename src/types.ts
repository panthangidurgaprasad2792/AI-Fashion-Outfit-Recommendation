export type Category = 'Top' | 'Bottom' | 'Shoes' | 'Accessory' | 'Outerwear';

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: Category;
  color: string;
  style: string;
  description: string;
}

export interface UserProfile {
  imageUrl: string;
  skinTone: string;
  bodyShape: string;
  styleNotes: string;
}

export interface OutfitItem {
  wardrobeItemId?: string; // ID of the item if it's from the wardrobe
  isExternal: boolean; // True if it's a suggested item to buy
  category: Category;
  description: string;
  color: string;
  reasoning: string;
  searchQuery?: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  items: OutfitItem[];
}
