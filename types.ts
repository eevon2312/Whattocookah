export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  kitchenEquipment: string[];
  cookTimePreference: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  cuisine: string;
}

export interface SocialCarouselImage {
  title: string;
  imageUrl: string;
}

export enum AppStep {
  AUTH,
  LOADING,
  ONBOARDING,
  UPLOAD,
  PROCESSING_IMAGE,
  EDIT_INGREDIENTS,
  PROCESSING_RECIPES,
  SHOW_RECIPES,
  VIEW_SAVED_RECIPES,
}