import React, { useState, useCallback } from 'react';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import ImageUploader from './components/ImageUploader';
import IngredientEditor from './components/IngredientEditor';
import RecipeList from './components/RecipeList';
import Header from './components/Header';
import Spinner from './components/Spinner';
import SavedRecipeList from './components/SavedRecipeList';
import type { UserPreferences, Recipe } from './types';
import { AppStep } from './types';
import { getIngredientsFromImage, getRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.AUTH);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoading(true);
    try {
      const savedPrefs = localStorage.getItem('whattocookah-prefs');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
        setAppStep(AppStep.UPLOAD);
      } else {
        setAppStep(AppStep.ONBOARDING);
      }
      const savedRecs = localStorage.getItem('whattocookah-saved-recipes');
      if (savedRecs) {
        setSavedRecipes(JSON.parse(savedRecs));
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      setAppStep(AppStep.ONBOARDING);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = (newPreferences: UserPreferences) => {
    localStorage.setItem('whattocookah-prefs', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setAppStep(AppStep.UPLOAD);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setIsLoading(true);
    setAppStep(AppStep.PROCESSING_IMAGE);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(',')[1];
      setUploadedImage(reader.result as string);
      try {
        const detectedIngredients = await getIngredientsFromImage(base64Image);
        setIngredients(detectedIngredients);
        setAppStep(AppStep.EDIT_INGREDIENTS);
      } catch (err) {
        setError('Could not get ingredients from the image. Please try another one.');
        setAppStep(AppStep.UPLOAD);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
      setAppStep(AppStep.UPLOAD);
      setIsLoading(false);
    };
  }, []);

  const handleFindRecipes = useCallback(async (finalIngredients: string[]) => {
    if (!preferences) {
      setError('User preferences are not set.');
      setAppStep(AppStep.ONBOARDING);
      return;
    }
    setError(null);
    setIsLoading(true);
    setAppStep(AppStep.PROCESSING_RECIPES);
    setIngredients(finalIngredients);

    try {
      const generatedRecipes = await getRecipes(finalIngredients, preferences);
      setRecipes(generatedRecipes);
      setAppStep(AppStep.SHOW_RECIPES);
    } catch (err) {
      setError('Could not generate recipes. The AI might be busy. Please try again.');
      setAppStep(AppStep.EDIT_INGREDIENTS);
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);
  
  const handleStartOver = () => {
    setUploadedImage(null);
    setIngredients([]);
    setRecipes([]);
    setError(null);
    setAppStep(AppStep.UPLOAD);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    const newSavedRecipes = [...savedRecipes, recipe];
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem('whattocookah-saved-recipes', JSON.stringify(newSavedRecipes));
  };
  
  const handleViewSaved = () => {
    setAppStep(AppStep.VIEW_SAVED_RECIPES);
  };

  const renderContent = () => {
    if (appStep === AppStep.AUTH) {
        return <Auth onLogin={handleLogin} />;
    }
    
    if (isLoading || appStep === AppStep.PROCESSING_IMAGE || appStep === AppStep.PROCESSING_RECIPES) {
        let message = "Loading...";
        if(appStep === AppStep.PROCESSING_IMAGE) message = "Analyzing your ingredients...";
        if(appStep === AppStep.PROCESSING_RECIPES) message = "Generating delicious recipes...";
        return <div className="bg-surface rounded-lg shadow-soft p-6 sm:p-10"><Spinner message={message} /></div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-danger/10 border border-danger/20 text-danger-700 rounded-lg">
                <p className="font-bold text-lg">Oops! Something went wrong.</p>
                <p>{error}</p>
                <button
                    onClick={handleStartOver}
                    className="mt-6 px-8 py-3 bg-primary text-white font-semibold rounded-pill shadow-md hover:bg-primary-variant transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }
    
    switch (appStep) {
      case AppStep.ONBOARDING:
        return <Onboarding onSave={handlePreferencesSave} />;
      case AppStep.UPLOAD:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppStep.EDIT_INGREDIENTS:
        return <IngredientEditor initialIngredients={ingredients} onFindRecipes={handleFindRecipes} imagePreview={uploadedImage} />;
      case AppStep.SHOW_RECIPES:
        return <RecipeList recipes={recipes} onStartOver={handleStartOver} onSaveRecipe={handleSaveRecipe} ingredients={ingredients} />;
      case AppStep.VIEW_SAVED_RECIPES:
        return <SavedRecipeList savedRecipes={savedRecipes} onFindNew={handleStartOver} />;
      default:
        return <p>Something went wrong. Please refresh.</p>;
    }
  };

  return (
    <div className={`min-h-screen font-body ${!isAuthenticated ? 'bg-primary' : 'bg-background text-text-primary'}`}>
      {isAuthenticated && <Header onViewSaved={handleViewSaved} savedRecipeCount={savedRecipes.length}/>}
      <main className={isAuthenticated ? "container mx-auto p-4 md:p-8" : ""}>
        <div className={isAuthenticated ? "max-w-3xl mx-auto" : ""}>
            {renderContent()}
        </div>
      </main>
      {isAuthenticated && 
        <footer className="text-center py-6 text-text-muted text-sm">
            <p>Whattocookah &copy; 2025</p>
        </footer>
      }
    </div>
  );
};

export default App;