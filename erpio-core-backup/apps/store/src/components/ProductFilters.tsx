import React from 'react';

interface Props {
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: { min: number; max: number }) => void;
}

export const ProductFilters: React.FC<Props> = ({ onCategoryChange, onPriceChange }) => {
  return (
    <div className="w-64 p-4 border-r border-zinc-200">
      <h3 className="font-semibold mb-4">Категории</h3>
      <div className="space-y-2">
        {['Все', 'Продукты', 'Напитки', 'Снеки'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => onCategoryChange(cat === 'Все' ? '' : cat)}
            className="block text-sm text-zinc-600 hover:text-emerald-600"
          >
            {cat}
          </button>
        ))}
      </div>
      <h3 className="font-semibold mt-8 mb-4">Цена</h3>
      <input 
        type="range" 
        className="w-full" 
        onChange={(e) => onPriceChange({ min: 0, max: Number(e.target.value) })}
      />
    </div>
  );
};
