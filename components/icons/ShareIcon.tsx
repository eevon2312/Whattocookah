import React from 'react';

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.042.583.042h6a2.25 2.25 0 012.25 2.25v3.867c0 .923-.593 1.728-1.442 2.053a2.25 2.25 0 10-1.213-3.867M7.217 10.907a2.25 2.25 0 00-1.213-3.867m1.213 3.867c.195.025.39.042.583.042h6a2.25 2.25 0 002.25-2.25v-3.867c0-.923-.593-1.728-1.442-2.053a2.25 2.25 0 00-1.213 3.867"
    />
  </svg>
);