import { GoogleGenAI, Type } from "@google/genai";
import type { UserPreferences, Recipe, SocialCarouselImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const getIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { 
            text: "Analyze this image of a fridge or grocery receipt and list all the food ingredients you can identify. Be precise and avoid generic terms. Respond only with a JSON object with a single key 'ingredients' which is an array of strings." 
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.ingredients || [];
  } catch (error) {
    console.error("Error getting ingredients from image:", error);
    throw new Error("Failed to parse ingredients from image.");
  }
};

export const getRecipes = async (ingredients: string[], preferences: UserPreferences): Promise<Recipe[]> => {
  const prompt = `
    You are a creative chef's assistant. Based on the following ingredients and user preferences, generate 4 diverse and delicious recipe ideas.

    Available Ingredients: ${ingredients.join(', ')}

    User Preferences:
    - Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
    - Favorite Cuisines: ${preferences.favoriteCuisines.join(', ') || 'Any'}
    - Available Kitchen Equipment: ${preferences.kitchenEquipment.join(', ')}
    - Preferred Cook Time: ${preferences.cookTimePreference || 'Any'}

    Please provide a response in JSON format. The root should be an object with a single key "recipes" which is an array of 4 recipe objects.
    Each recipe object must include: title, description (make it appealing, 1-2 sentences), ingredients (a list of strings, including quantities), instructions (a list of strings for each step), cookTime (e.g., "30 minutes"), and cuisine (e.g., "Italian").
    Ensure the recipes heavily feature the provided ingredients.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cookTime: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                },
                required: ["title", "description", "ingredients", "instructions", "cookTime", "cuisine"],
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.recipes || [];
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw new Error("Failed to generate recipes.");
  }
};

export const generateSocialCarouselImages = async (recipe: Recipe): Promise<SocialCarouselImage[]> => {
  const prompts = [
    {
      title: 'Cover Photo',
      prompt: `A delicious, vibrant, professionally shot photo of ${recipe.title}, ready to eat. Food photography style, appetizing, bright lighting on a rustic wooden table.`,
    },
    {
      title: 'Ingredients',
      prompt: `A clean, modern flat lay photo of the following fresh ingredients: ${recipe.ingredients.map(i => i.split('(')[0].trim()).join(', ')}. Neatly arranged on a white marble countertop.`,
    },
    {
      title: 'Final Dish',
      prompt: `A beautiful final plating of ${recipe.title}, garnished and ready to serve. Close-up shot, depth of field, focused on the texture of the food.`,
    }
  ];

  try {
    const imageGenerationPromises = prompts.map(p => 
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: p.prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      })
    );

    const responses = await Promise.all(imageGenerationPromises);

    const generatedImages = responses.map((response, index) => {
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return {
          title: prompts[index].title,
          imageUrl,
        };
      }
      throw new Error(`Image generation failed for prompt: ${prompts[index].title}`);
    });

    return generatedImages;

  } catch (error) {
    console.error("Error generating social carousel images:", error);
    throw new Error("Failed to generate images for the social post.");
  }
};