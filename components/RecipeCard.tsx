import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { ShareIcon } from './icons/ShareIcon';

interface RecipeCardProps {
  recipe: Recipe;
  onGenerateSocialPost: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onGenerateSocialPost }) => {
  return (
    <div className="bg-surface rounded-lg shadow-soft overflow-hidden flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6 flex-grow">
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-3">{recipe.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center text-xs font-semibold text-text-secondary bg-muted-surface px-3 py-1 rounded-pill">
                <ClockIcon className="w-4 h-4 mr-1.5 text-text-muted"/>
                <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center text-xs font-semibold text-text-secondary bg-muted-surface px-3 py-1 rounded-pill">
                <GlobeAltIcon className="w-4 h-4 mr-1.5 text-text-muted"/>
                <span>{recipe.cuisine}</span>
            </div>
        </div>
        
        <p className="text-text-secondary mb-6">{recipe.description}</p>
        
        <div className="space-y-5 text-sm">
            <div>
                <h4 className="text-lg font-display font-bold text-text-primary mb-3">Ingredients</h4>
                <ul className="list-none space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-3 flex-shrink-0"></span>
                            <span className="text-text-secondary">{ing}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-display font-bold text-text-primary mb-3">Instructions</h4>
                <ol className="list-none space-y-3">
                    {recipe.instructions.map((step, i) => (
                        <li key={i} className="flex">
                            <span className="flex-shrink-0 font-bold text-primary mr-3">{i + 1}.</span>
                            <span className="text-text-secondary leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
      </div>
      <div className="p-4 bg-muted-surface/50 mt-auto flex justify-end items-center">
        <button 
          onClick={onGenerateSocialPost}
          className="flex items-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-pill shadow-md hover:bg-primary-variant transition-transform hover:-translate-y-px"
          aria-label="Create social media post for this recipe"
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          <span>Share this Recipe</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;