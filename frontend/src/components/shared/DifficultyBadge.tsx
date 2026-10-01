import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const styles = {
    EASY: 'bg-green-500/10 text-green-400 border-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    HARD: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};
