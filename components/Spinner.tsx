import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Loading..."}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-primary"></div>
      <p className="text-text-secondary text-lg mt-4 font-semibold">{message}</p>
    </div>
  );
};

export default Spinner;