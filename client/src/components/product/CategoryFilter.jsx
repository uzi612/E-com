import React from 'react';
import { Layers } from 'lucide-react';

const CategoryFilter = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
}) => {
  const allList = [{ _id: 'all', name: 'All' }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allList.map((cat) => {
        const isActive =
          selectedCategory === cat.name ||
          (selectedCategory === 'All' && cat.name === 'All') ||
          selectedCategory === cat._id;

        return (
          <button
            key={cat._id || cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.name === 'All' && <Layers className="w-3.5 h-3.5" />}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
