import React, { useState } from 'react';
import type { UserPreferences } from '../types';
import { DIETARY_OPTIONS, CUISINE_OPTIONS, EQUIPMENT_OPTIONS, COOK_TIME_OPTIONS } from '../constants';

interface OnboardingProps {
  onSave: (preferences: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSave }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    favoriteCuisines: [],
    kitchenEquipment: [],
    cookTimePreference: '',
  });

  const handleToggle = (field: 'dietaryRestrictions' | 'favoriteCuisines' | 'kitchenEquipment', value: string) => {
    setPreferences(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSetSingleChoice = (field: 'cookTimePreference', value: string) => {
      setPreferences(prev => ({...prev, [field]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preferences);
  };
  
  const MultiChoiceSection: React.FC<{ title: string, options: string[], selected: string[], onToggle: (value: string) => void }> = ({ title, options, selected, onToggle }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-4 py-2 rounded-pill font-semibold text-sm transition-all duration-200 ${
              selected.includes(option)
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-muted-surface text-text-primary hover:bg-accent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const SingleChoiceSection: React.FC<{ title: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ title, options, selected, onSelect }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`px-4 py-2 rounded-pill font-semibold text-sm transition-all duration-200 ${
              selected === option
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-muted-surface text-text-primary hover:bg-accent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-surface rounded-lg shadow-soft p-6 sm:p-10 animate-fade-in">
      <h2 className="font-display text-3xl font-bold text-center mb-2 text-text-primary">Welcome!</h2>
      <p className="text-center text-text-secondary mb-10">Let's personalize your experience.</p>
      
      <form onSubmit={handleSubmit}>
        <MultiChoiceSection 
            title="Dietary Preferences"
            options={DIETARY_OPTIONS}
            selected={preferences.dietaryRestrictions}
            onToggle={(value) => handleToggle('dietaryRestrictions', value)}
        />
        <MultiChoiceSection 
            title="Favorite Cuisines"
            options={CUISINE_OPTIONS}
            selected={preferences.favoriteCuisines}
            onToggle={(value) => handleToggle('favoriteCuisines', value)}
        />
        <SingleChoiceSection
            title="How long do you want to cook for?"
            options={COOK_TIME_OPTIONS}
            selected={preferences.cookTimePreference}
            onSelect={(value) => handleSetSingleChoice('cookTimePreference', value)}
        />
        <MultiChoiceSection 
            title="Your Kitchen Equipment"
            options={EQUIPMENT_OPTIONS}
            selected={preferences.kitchenEquipment}
            onToggle={(value) => handleToggle('kitchenEquipment', value)}
        />

        <div className="text-center mt-8">
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-pill shadow-md hover:bg-primary-variant transition-transform transform hover:-translate-y-px"
          >
            Let's get cooking
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;