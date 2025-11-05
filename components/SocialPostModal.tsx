import React, { useState, useEffect } from 'react';
import type { Recipe, SocialCarouselImage } from '../types';
import { generateSocialCarouselImages } from '../services/geminiService';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import Spinner from './Spinner';


interface SocialPostModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const SocialPostModal: React.FC<SocialPostModalProps> = ({ recipe, onClose }) => {
  const [images, setImages] = useState<SocialCarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const generateImages = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const generatedImages = await generateSocialCarouselImages(recipe);
        setImages(generatedImages);
      } catch (err) {
        setError('Sorry, we couldn\'t generate social media images for this recipe. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    generateImages();
  }, [recipe]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleDownload = () => {
    if(images[currentSlide]) {
        const link = document.createElement('a');
        link.href = images[currentSlide].imageUrl;
        link.download = `${recipe.title.replace(/\s+/g, '-')}-${images[currentSlide].title.replace(/\s+/g, '-')}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-surface rounded-lg shadow-soft w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        <div className="p-4 border-b border-muted-surface flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-text-primary">Social Post for {recipe.title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted-surface transition-colors" aria-label="Close modal">
                <XIcon className="w-6 h-6 text-text-secondary" />
            </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
            {isLoading && <Spinner message="Generating stunning visuals..." />}
            {error && <p className="text-center text-danger bg-danger/10 p-4 rounded-md">{error}</p>}
            
            {!isLoading && !error && images.length > 0 && (
                <div className="space-y-4">
                    <div className="relative w-full aspect-square bg-muted-surface rounded-md overflow-hidden shadow-inner">
                        <img 
                            src={images[currentSlide].imageUrl} 
                            alt={images[currentSlide].title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-center">
                            <p className="font-semibold">{images[currentSlide].title}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-muted-surface hover:bg-accent transition-colors" aria-label="Previous image">
                            <ChevronLeftIcon className="w-6 h-6"/>
                        </button>
                        <span className="text-sm font-medium text-text-secondary">
                            {currentSlide + 1} / {images.length}
                        </span>
                        <button onClick={nextSlide} className="p-2 rounded-full bg-muted-surface hover:bg-accent transition-colors" aria-label="Next image">
                            <ChevronRightIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            )}
        </div>

        {!isLoading && !error && images.length > 0 && (
            <div className="p-4 border-t border-muted-surface flex justify-end">
                <button 
                    onClick={handleDownload}
                    className="flex items-center px-6 py-2 bg-primary text-white font-semibold rounded-pill shadow-md hover:bg-primary-variant transition-colors"
                    aria-label="Download current image"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    <span>Download Image</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SocialPostModal;