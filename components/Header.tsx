import React from 'react';

interface HeaderProps {
  onViewSaved: () => void;
  savedRecipeCount: number;
}


const Header: React.FC<HeaderProps> = ({ onViewSaved, savedRecipeCount }) => {
  return (
    <header className="py-8">
      <div className="container mx-auto px-4 relative flex justify-center items-center">
        <h1 className="font-display text-3xl font-bold text-primary text-center">
          Whattocookah
        </h1>
        <button 
          onClick={onViewSaved} 
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 bg-surface text-sm text-primary font-semibold rounded-pill shadow-subtle hover:bg-muted-surface transition-colors"
          aria-label={`View saved recipes. You have ${savedRecipeCount} saved.`}
        >
          <span>My Recipes</span>
          {savedRecipeCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {savedRecipeCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;