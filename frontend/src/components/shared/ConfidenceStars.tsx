import React from 'react';
import { Star } from 'lucide-react';

interface ConfidenceStarsProps {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
}

export const ConfidenceStars: React.FC<ConfidenceStarsProps> = ({ value, onChange, size = 16 }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${star <= value ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          <Star size={size} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};
