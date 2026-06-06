/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, SlidersHorizontal, Heart, View, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { Product } from '../types';
import { LUXURY_PRODUCTS } from '../data';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface ShopExplorerProps {
  onViewProductDetails: (productId: string) => void;
  onQuickAddToBag: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export default function ShopExplorer({
  onViewProductDetails,
  onQuickAddToBag,
  onToggleWishlist,
  wishlistIds
}: ShopExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Outerwear', 'Knitwear', 'Accessories', 'Footwear', 'Dresses'];

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...LUXURY_PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Hero Block */}
      <div className="relative bg-surface border border-outline-variant/30 overflow-hidden rounded-xl p-8 sm:p-12 flex flex-col justify-center min-h-[220px] shadow-sm">
        {/* Subtle decorative mesh background gradient */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#712ae2] via-[#004ac6] to-transparent" />
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>The Collection — Vol. IV</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-on-surface tracking-tighter leading-tight">
            Designed for Effortless Exclusivity
          </h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Discover precision tailored blazers, luxury grade-A cashmere, and architectural accessories cut from the finest leather. Elegant staples for modern uniform dressing.
          </p>
        </div>
      </div>

      {/* Inputs Filters bar */}
      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/40 flex flex-col md:flex-row gap-4 justify-between items-center shadow-inner">
        {/* Search bar input wrapper */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="product-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-full pl-10 pr-4 py-2 font-sans text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline/70"
            placeholder="Search bespoke garments (e.g. blazer, bag, boots)..."
            type="text"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-outline-variant" />
          <span className="font-sans text-xs font-semibold uppercase text-on-surface-variant tracking-wider hidden sm:block">
            Sort:
          </span>
          <select
            id="product-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-outline-variant rounded px-3 py-1.5 font-sans text-xs font-medium focus:border-primary outline-none text-on-surface cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills filtering */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-category-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid list */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low border border-dashed border-outline-variant/60 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-on-surface-variant">No items match your search filter</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-primary font-bold uppercase tracking-wider hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10" id="shop-products-grid">
          {filteredAndSortedProducts.map((product) => {
            const isLiked = wishlistIds.includes(product.id);
            return (
              <motion.div
                key={product.id}
                layoutId={`product-card-${product.id}`}
                className="group flex flex-col justify-between"
              >
                {/* Image Container with 3:4 aspect ratio */}
                <div className="relative aspect-[3/4] overflow-hidden rounded bg-surface-container shadow-sm border border-outline-variant/20">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104 cursor-pointer"
                    onClick={() => onViewProductDetails(product.id)}
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Heart Quick Favorite Toggle Overlay */}
                  <button
                    id={`toggle-like-${product.id}`}
                    onClick={() => onToggleWishlist(product)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white text-on-surface transition-all active:scale-90 duration-200 cursor-pointer border border-outline-variant/20"
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isLiked 
                          ? 'fill-secondary text-secondary scale-110' 
                          : 'text-on-surface-variant/80 hover:text-black hover:scale-105'
                      }`} 
                    />
                  </button>

                  {/* Editorial Actions Slide-up Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col gap-2">
                    <button
                      onClick={() => onViewProductDetails(product.id)}
                      className="w-full bg-white/95 text-on-surface py-2 rounded text-[11px] font-semibold uppercase tracking-wider hover:bg-white transition-all duration-200 flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <View className="w-3.5 h-3.5" />
                      <span>View Specifications</span>
                    </button>
                    <button
                      onClick={() => onQuickAddToBag(product)}
                      className="w-full bg-primary text-white py-2 rounded text-[11px] font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* Info and Pricing */}
                <div className="pt-4 space-y-1">
                  <div className="flex justify-between items-baseline gap-1">
                    <h3 
                      onClick={() => onViewProductDetails(product.id)}
                      className="font-sans font-medium text-xs sm:text-sm text-on-surface hover:text-primary cursor-pointer line-clamp-1 transition-colors tracking-tight"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center text-amber-500 text-[10px] sm:text-xs">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="font-mono font-medium ml-0.5">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="font-sans font-bold text-xs sm:text-sm text-on-surface">
                      ${product.price.toFixed(2)}
                    </p>
                    <span className="font-mono text-[9px] sm:text-[10px] text-outline uppercase tracking-widest font-semibold border border-outline-variant/30 px-1 rounded bg-surface">
                      {product.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
