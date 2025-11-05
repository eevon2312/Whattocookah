import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft p-6 sm:p-10 text-center animate-fade-in">
      <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Find Your Next Dish</h2>
      <p className="text-lg text-text-secondary mb-8">Upload a photo of your fridge or receipt.</p>
      
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
        <label
          htmlFor="input-file-upload"
          className={`relative block w-full h-64 rounded-md border-2 border-dashed transition-colors duration-300 ${
            dragActive ? 'border-primary bg-primary/10' : 'border-muted-surface bg-muted-surface/50 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <UploadIcon className="w-16 h-16 text-text-muted mb-4" />
            <p className="font-semibold text-text-primary">Drag & drop your photo here</p>
            <p className="text-text-secondary mt-2">or</p>
            <button
              type="button"
              onClick={onButtonClick}
              className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-pill shadow-md hover:bg-primary-variant transition-colors"
            >
              Browse Files
            </button>
          </div>
        </label>
      </form>
    </div>
  );
};

export default ImageUploader;