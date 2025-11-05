import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // Simulate login
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col justify-center items-center px-6 sm:px-8 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold tracking-wider">Tasty</h1>
        </div>
        
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-10 leading-tight">
          Find Your Next Favorite Dish with Tasty
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Email" 
              className="w-full bg-primary border border-white/20 rounded-md px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
              required 
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              type={passwordVisible ? 'text' : 'password'} 
              id="password" 
              placeholder="Password" 
              className="w-full bg-primary border border-white/20 rounded-md px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
              required 
            />
            <button 
              type="button" 
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 px-4 flex items-center text-white/60 hover:text-white"
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            >
              {passwordVisible ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-white/80 hover:text-white transition">Forgot password?</a>
          </div>
          <div>
            <button 
              type="submit" 
              className="w-full bg-surfaceLight text-primary font-bold py-3 rounded-pill hover:bg-mutedSurface transition-all transform hover:scale-[1.02]"
            >
              Explore the app
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-white/80">
          Don't have an account? <a href="#" className="font-semibold text-white hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
