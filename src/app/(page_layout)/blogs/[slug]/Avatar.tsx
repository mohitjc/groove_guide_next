// components/Avatar.tsx
'use client'; // if using Next.js App Router

import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const colors = [
  'bg-red-500',    // danger
  'bg-green-500',  // success
  'bg-blue-500',   // primary
  'bg-cyan-500',   // info
  'bg-purple-500', // secondary
  'bg-yellow-500', // warning
  'bg-gray-800',   // dark
];

const generateAvatar = (name: string): string => {
  if (!name) return 'NA';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getColorClass = (initials: string): string => {
  const charCodeSum = initials
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md' }) => {
  const initials = generateAvatar(name);
  const colorClass = getColorClass(initials);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full ${colorClass} text-white font-bold ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;