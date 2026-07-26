import React, { useState, useRef, useEffect } from 'react';
import { MembershipCategoryType, MEMBERSHIP_CATEGORIES } from '../types';

interface SearchableCategorySelectProps {
  value: MembershipCategoryType;
  onChange: (category: MembershipCategoryType) => void;
  className?: string;
  error?: string;
}

export const SearchableCategorySelect: React.FC<SearchableCategorySelectProps> = ({
  value,
  onChange,
  className = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = MEMBERSHIP_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (category: MembershipCategoryType) => {
    onChange(category);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#1a2744] mb-1">
        Membership Category <span className="text-red-600">*</span>
      </label>
      
      {/* Search Input / Display Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          error ? 'border-red-500' : 'border-[#9d7f46]/50 focus-within:border-[#1a2744]'
        } rounded-md px-2.5 py-1.5 flex items-center justify-between cursor-pointer shadow-sm hover:border-[#1a2744] transition-colors`}
      >
        <span className="text-[11px] font-bold text-[#1a2744] tracking-wide">
          {value || 'Select Membership Category'}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#9d7f46] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#9d7f46]/40 rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1.5 bg-[#f8f9fa] border-b border-[#9d7f46]/20">
            <input
              type="text"
              autoFocus
              placeholder="Search category (e.g. Life, Corporate)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[11px] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#1a2744] focus:outline-none focus:border-[#1a2744]"
            />
          </div>

          <ul className="max-h-48 overflow-y-auto py-1 divide-y divide-gray-100">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const isSelected = category === value;
                return (
                  <li
                    key={category}
                    onClick={() => handleSelect(category)}
                    className={`px-3 py-1.5 text-[11px] font-medium cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#1a2744] text-[#c4a56a] font-bold'
                        : 'text-[#2c2c2c] hover:bg-[#f0e8d8] hover:text-[#1a2744]'
                    }`}
                  >
                    <span>{category}</span>
                    {isSelected && (
                      <span className="text-[#c4a56a] text-xs font-bold">✓</span>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-[10px] text-gray-500 italic text-center">
                No matching categories found
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-[9px] text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};
