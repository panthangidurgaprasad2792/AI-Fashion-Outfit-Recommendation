import { GoogleGenAI, Type } from '@google/genai';
import { WardrobeItem, UserProfile, OutfitRecommendation } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Helper to convert base64 data URL to the format Gemini expects
function base64ToGenerativePart(dataUrl: string) {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

export async function analyzeClothingItem(dataUrl: string): Promise<Omit<WardrobeItem, 'id' | 'imageUrl'>> {
  const imagePart = base64ToGenerativePart(dataUrl);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        { text: 'Analyze this clothing item. Categorize it and describe its color and style.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'One of: Top, Bottom, Shoes, Accessory, Outerwear',
            enum: ['Top', 'Bottom', 'Shoes', 'Accessory', 'Outerwear']
          },
          color: {
            type: Type.STRING,
            description: 'The primary color of the item'
          },
          style: {
            type: Type.STRING,
            description: 'The style of the item (e.g., Casual, Formal, Sporty, Vintage)'
          },
          description: {
            type: Type.STRING,
            description: 'A short, catchy description of the item (max 5 words)'
          }
        },
        required: ['category', 'color', 'style', 'description']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Failed to analyze image');
  
  // Sanitize potential markdown-wrapped JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const sanitizedJson = jsonMatch ? jsonMatch[0] : text;
  
  return JSON.parse(sanitizedJson);
}

export async function analyzeUserProfile(dataUrl: string): Promise<Omit<UserProfile, 'imageUrl'>> {
  const imagePart = base64ToGenerativePart(dataUrl);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        { text: 'Analyze this person for fashion styling purposes. Be respectful and focus on fashion-relevant attributes.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skinTone: {
            type: Type.STRING,
            description: 'General skin tone category (e.g., Warm, Cool, Neutral, Deep, Fair)'
          },
          bodyShape: {
            type: Type.STRING,
            description: 'General body shape category (e.g., Athletic, Slim, Curvy, Broad)'
          },
          styleNotes: {
            type: Type.STRING,
            description: 'Brief notes on what colors or styles might complement them best based on their features.'
          }
        },
        required: ['skinTone', 'bodyShape', 'styleNotes']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Failed to analyze profile');
  
  // Sanitize potential markdown-wrapped JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const sanitizedJson = jsonMatch ? jsonMatch[0] : text;
  
  return JSON.parse(sanitizedJson);
}

export async function generateOutfits(
  wardrobe: WardrobeItem[],
  profile: UserProfile | null,
  occasion: string,
  weather: string
): Promise<OutfitRecommendation[]> {
  const prompt = `
    You are an expert personal stylist. Create 3 outfit recommendations based on the user's profile, occasion, weather, and available wardrobe (if any).
    
    Occasion: ${occasion}
    Weather: ${weather}
    User Profile: ${profile ? JSON.stringify(profile) : 'Not provided'}
    
    Available Wardrobe Items:
    ${wardrobe.length > 0 ? JSON.stringify(wardrobe.map(item => ({ id: item.id, category: item.category, color: item.color, style: item.style, description: item.description }))) : 'No items in wardrobe. Suggest complete outfits to buy.'}
    
    Instructions:
    1. Create exactly 3 distinct outfit combinations.
    2. Each outfit should ideally include a Top, Bottom, Shoes, and optionally Outerwear or Accessory.
    3. If wardrobe items are provided, try to use them by referencing their "id".
    4. If a crucial item is missing (or if the wardrobe is empty), suggest an "external" item to buy (set isExternal: true, omit wardrobeItemId, and provide a searchQuery to find it online).
    5. Explain why the outfit works well for the user and occasion.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'A unique ID for this outfit recommendation' },
            title: { type: Type.STRING, description: 'A catchy name for the outfit' },
            description: { type: Type.STRING, description: 'Overall description of why this outfit works' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wardrobeItemId: { type: Type.STRING, description: 'The ID of the wardrobe item used (if applicable)' },
                  isExternal: { type: Type.BOOLEAN, description: 'True if this item is not in the wardrobe and needs to be bought' },
                  category: { type: Type.STRING, description: 'Top, Bottom, Shoes, Accessory, or Outerwear' },
                  description: { type: Type.STRING, description: 'Description of the item' },
                  color: { type: Type.STRING, description: 'Color of the item' },
                  reasoning: { type: Type.STRING, description: 'Why this specific item was chosen for the outfit' },
                  searchQuery: { type: Type.STRING, description: 'A search query to find this item online (e.g., "mens black leather chelsea boots"). Required if isExternal is true.' }
                },
                required: ['isExternal', 'category', 'description', 'color', 'reasoning']
              }
            }
          },
          required: ['id', 'title', 'description', 'items']
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate outfits');
  
  // Sanitize potential markdown-wrapped JSON (could be an array)
  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  const sanitizedJson = jsonMatch ? jsonMatch[0] : text;
  
  return JSON.parse(sanitizedJson);
}
