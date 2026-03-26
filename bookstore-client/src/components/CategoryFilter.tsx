import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-4">
      <h3 className="h5 mb-3 fw-bold">Categories</h3>
      <div className="list-group list-group-flush shadow-sm rounded">
        <button
          className={`list-group-item list-group-item-action ${
            selectedCategory === null ? 'active bg-primary text-white fw-bold' : ''
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              selectedCategory === category ? 'active bg-primary text-white fw-bold' : ''
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
