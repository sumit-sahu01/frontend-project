import React from 'react';
import { CATEGORIES } from '../data/sampleAudio';

export const CategoryFilters = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="category-filters-container">
      <div className="category-filters-scroll">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
