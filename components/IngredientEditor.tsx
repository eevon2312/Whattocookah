import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { XIcon } from './icons/XIcon';

interface IngredientEditorProps {
  initialIngredients: string[];
  onFindRecipes: (ingredients: string[]) => void;
  imagePreview: string | null;
}

const IngredientEditor: React.FC<IngredientEditorProps> = ({ initialIngredients, onFindRecipes, imagePreview }) => {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddIngredient();
      }
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft p-6 sm:p-10 animate-fade-in">
        <h2 className="font-display text-3xl font-bold text-center text-text-primary mb-2">Confirm Ingredients</h2>
        <p className="text-center text-lg text-text-secondary mb-8">We found these items. Adjust the list for the best recipes!</p>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/5 flex-shrink-0">
                {imagePreview && (
                    <img src={imagePreview} alt="Uploaded ingredients" className="rounded-md shadow-subtle w-full object-cover" />
                )}
            </div>
            <div className="w-full md:w-3/5">
                <div className="bg-muted-surface/50 p-6 rounded-md h-full">
                    <div className="flex flex-wrap gap-3 min-h-[6rem]">
                        {ingredients.map((ingredient, index) => (
                        <span key={index} className="flex items-center bg-accent text-primary-variant text-sm font-medium pl-3 pr-2 py-1 rounded-pill">
                            {ingredient}
                            <button onClick={() => handleRemoveIngredient(ingredient)} className="ml-2 text-primary-variant/70 hover:text-primary-variant">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </span>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a missing ingredient..."
                            className="flex-grow p-3 bg-surface border border-muted-surface rounded-pill focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            onClick={handleAddIngredient}
                            className="flex-shrink-0 p-3 bg-primary text-white rounded-full hover:bg-primary-variant transition-colors"
                            aria-label="Add ingredient"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center mt-8">
            <button
                onClick={() => onFindRecipes(ingredients)}
                disabled={ingredients.length === 0}
                className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-pill shadow-md hover:bg-primary-variant transition-transform transform hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                Find Recipes
            </button>
        </div>
    </div>
  );
};

export default IngredientEditor;