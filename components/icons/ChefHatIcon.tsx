
import React from 'react';

export const ChefHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 21h4" />
    <path d="M6 17h12" />
    <path d="M12 4a4 4 0 0 1 4 4v1a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V8a4 4 0 0 1-4-4" />
    <path d="M12 4a4 4 0 0 0-4 4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a4 4 0 0 0 4-4" />
  </svg>
);