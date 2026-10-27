
import React from 'react';

const LandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2H19.95m-16.9 0a2 2 0 00-2 2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1m16.9 0a2 2 0 012 2v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1" />
    </svg>
);

export default LandIcon;
