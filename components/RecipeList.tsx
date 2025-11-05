import React, { useState, useMemo } from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import SocialPostModal from './SocialPostModal';
import { XIcon } from './icons/XIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';


interface RecipeListProps {
  recipes: Recipe[];
  onStartOver: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  ingredients: string[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onStartOver, onSaveRecipe, ingredients }) => {
  const [selectedRecipeForPost, setSelectedRecipeForPost] = useState<Recipe | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragState, setDragState] = useState({ x: 0, isDragging: false });
  const [animationClass, setAnimationClass] = useState('');

  const currentRecipe = useMemo(() => recipes[currentIndex], [recipes, currentIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState({ ...dragState, isDragging: true });
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.isDragging) return;
    setDragState(prev => ({...prev, x: prev.x + e.movementX }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragState(prev => ({ ...prev, isDragging: false }));

    if (Math.abs(dragState.x) > 100) {
      const direction = dragState.x > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      setDragState({ ...dragState, x: 0 });
    }
  };
  
  const handleSwipe = (direction: 'left' | 'right') => {
      setAnimationClass(direction === 'right' ? 'animate-swipe-out-right' : 'animate-swipe-out-left');
      if (direction === 'right') {
          onSaveRecipe(currentRecipe);
      }
      setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setAnimationClass('');
          setDragState({ x: 0, isDragging: false });
      }, 300);
  };
  
  const cardStyle = {
    transform: `translateX(${dragState.x}px) rotate(${dragState.x / 20}deg)`,
    transition: dragState.isDragging ? 'none' : 'transform 0.2s ease-out',
  };

  const allDone = currentIndex >= recipes.length;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Recipe Ideas</h2>
        <p className="text-lg text-text-secondary">Based on: <span className="font-semibold text-text-primary">{ingredients.join(', ')}</span></p>
      </div>
      
      <div className="relative h-[600px] flex items-center justify-center">
        {allDone ? (
             <div className="text-center p-8 bg-surface rounded-lg shadow-soft">
                <ChefHatIcon className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="font-display text-2xl font-bold text-text-primary">That's all for now!</h3>
                <p className="text-text-secondary mt-2">Check your saved recipes or start over with new ingredients.</p>
             </div>
        ) : (
          recipes.slice(currentIndex).map((recipe, index) => {
            const isTopCard = index === 0;
            return (
              <div
                key={recipe.title}
                className={`absolute w-full max-w-md cursor-grab transition-transform duration-200 ${isTopCard ? animationClass : ''}`}
                style={isTopCard ? cardStyle : { transform: `scale(${1 - index * 0.05}) translateY(${index * -15}px) rotate(${index * 2}deg)`, opacity: 1 - index * 0.2 }}
                onPointerDown={isTopCard ? handlePointerDown : undefined}
                onPointerMove={isTopCard ? handlePointerMove : undefined}
                onPointerUp={isTopCard ? handlePointerUp : undefined}
                aria-label={`Recipe card for ${recipe.title}. Swipe left to pass, right to save.`}
              >
                <RecipeCard
                  recipe={recipe}
                  onGenerateSocialPost={() => setSelectedRecipeForPost(recipe)}
                />
              </div>
            );
          }).reverse()
        )}
      </div>

      {!allDone && (
         <div className="flex justify-center items-center gap-6 mt-6">
            <button 
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-surface shadow-soft flex items-center justify-center text-danger hover:scale-105 transition-transform"
                aria-label="Pass recipe"
            >
                <XIcon className="w-8 h-8"/>
            </button>
            <button 
                onClick={() => handleSwipe('right')}
                className="w-20 h-20 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Save recipe"
            >
                <ChefHatIcon className="w-10 h-10"/>
            </button>
        </div>
      )}


      <div className="text-center mt-12">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-primary text-white font-bold rounded-pill shadow-lg hover:bg-primary-variant transition-transform transform hover:-translate-y-px"
        >
          Start Over with a New Photo
        </button>
      </div>

      {selectedRecipeForPost && (
        <SocialPostModal 
          recipe={selectedRecipeForPost}
          onClose={() => setSelectedRecipeForPost(null)}
        />
      )}
    </div>
  );
};

export default RecipeList;