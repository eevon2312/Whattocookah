import React, {useState} from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import SocialPostModal from './SocialPostModal';

interface SavedRecipeListProps {
  savedRecipes: Recipe[];
  onFindNew: () => void;
}

const SavedRecipeList: React.FC<SavedRecipeListProps> = ({ savedRecipes, onFindNew }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">My Saved Recipes</h2>
        <p className="text-lg text-text-secondary">
          {savedRecipes.length > 0
            ? "Here are the delicious recipes you've saved."
            : "You haven't saved any recipes yet. Go find some!"}
        </p>
      </div>

      {savedRecipes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {savedRecipes.map((recipe, index) => (
            <RecipeCard 
              key={index} 
              recipe={recipe} 
              onGenerateSocialPost={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={onFindNew}
          className="px-8 py-3 bg-primary text-white font-bold rounded-pill shadow-lg hover:bg-primary-variant transition-transform transform hover:-translate-y-px"
        >
          Find New Recipes
        </button>
      </div>

      {selectedRecipe && (
        <SocialPostModal 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default SavedRecipeList;