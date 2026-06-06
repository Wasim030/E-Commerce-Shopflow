/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, Star, Heart, Shield, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToBag: (product: Product, size: string, color: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToBag,
  onToggleWishlist,
  isWishlisted
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Navy');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToBag(product, selectedSize, selectedColor, quantity);
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm"
      />

      {/* Main Modal Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative bg-surface w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden z-10 border border-outline-variant/30 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
        id="product-detail-modal"
      >
        {/* Mobile Go Back button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-20 md:hidden bg-surface/90 hover:bg-surface-container rounded-full p-2 shadow border border-outline-variant/20 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-on-surface"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Close Button Top Right (Desktop Only) */}
        <button
          onClick={onClose}
          id="close-detail-modal"
          className="absolute top-4 right-4 z-20 hidden md:block bg-surface/90 hover:bg-surface-container rounded-full p-2.5 shadow-sm transition-all text-on-surface hover:text-error border border-outline-variant/30 active:scale-90"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Hand: High-Definition Portrait image */}
        <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden bg-surface-container relative">
          <img
            className="w-full h-full object-cover"
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 md:hidden">
            <button
              onClick={() => onToggleWishlist(product)}
              className="bg-surface/90 rounded-full p-2.5 shadow border border-outline-variant/20 text-on-surface"
            >
              <Heart 
                className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-secondary text-secondary scale-110' : 'text-on-surface-variant'}`} 
              />
            </button>
          </div>
        </div>

        {/* Right Hand: Detailed Custom Form configurations */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
          <div className="space-y-5">
            <div>
              <span className="font-sans text-xs font-semibold tracking-widest text-[#712ae2] uppercase bg-secondary/5 px-2.5 py-1.5 rounded-sm border border-secondary/10">
                {product.category}
              </span>
              <h2 className="font-sans font-bold text-xl md:text-2xl text-on-surface mt-3 tracking-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-xs font-bold text-on-surface font-mono">{product.rating}</span>
                </div>
                <span className="text-outline text-xs">•</span>
                <span className="text-xs text-outline font-medium">Authentic Curated Stock</span>
              </div>
            </div>

            {/* Price section */}
            <p className="font-sans font-extrabold text-2xl text-on-surface">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Color selection swatches */}
            <div>
              <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
                Select Color: <span className="font-medium text-on-surface">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  // Map display values
                  let colorBg = 'bg-neutral-800';
                  if (color === 'Navy') colorBg = 'bg-blue-900';
                  if (color === 'Onyx') colorBg = 'bg-neutral-900';
                  if (color === 'Tan') colorBg = 'bg-amber-800';
                  if (color === 'Alabaster') colorBg = 'bg-[#f7f5f0] border border-outline-variant';
                  if (color === 'Charcoal') colorBg = 'bg-slate-700';
                  if (color === 'Cream') colorBg = 'bg-amber-50';
                  if (color === 'Camel') colorBg = 'bg-amber-700';
                  if (color === 'Slate') colorBg = 'bg-slate-500';
                  if (color === 'Sand') colorBg = 'bg-stone-300';
                  if (color === 'Emerald') colorBg = 'bg-emerald-900';
                  if (color === 'Champagne') colorBg = 'bg-yellow-100';

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                      }`}
                      title={color}
                    >
                      <span className={`w-5 h-5 rounded-full ${colorBg} inline-block`} />
                      {isSelected && (
                        <Check className={`w-3 h-3 absolute ${color === 'Alabaster' || color === 'Champagne' || color === 'Cream' ? 'text-neutral-900' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Sizing selector */}
            {product.sizes[0] !== 'One Size' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Select Size: <span className="font-medium text-on-surface">{selectedSize}</span>
                  </label>
                  <button className="text-xs text-primary hover:underline font-semibold font-sans">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded font-sans text-xs font-semibold uppercase tracking-wider text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'bg-surface border-outline-variant/60 text-on-surface hover:bg-surface-container-low hover:border-outline'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fabric Details checklist items */}
            <div className="pt-2 border-t border-outline-variant/30">
              <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                Specifications Checklist
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1.5 pl-1">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Action CTA layout */}
          <div className="pt-6 border-t border-outline-variant/30 mt-6 flex gap-3">
            {/* Wishlist Toggle Button (Desktop Only) */}
            <button
              onClick={() => onToggleWishlist(product)}
              className={`hidden md:inline-flex p-3 rounded border text-on-surface-variant hover:text-black transition-all active:scale-95 cursor-pointer ${
                isWishlisted 
                  ? 'border-secondary/20 bg-secondary/5 text-secondary' 
                  : 'border-outline-variant/60 hover:border-outline'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-secondary text-secondary' : ''}`} />
            </button>

            {/* Main Add to Bag button */}
            <button
              id={`detail-add-bag-${product.id}`}
              onClick={handleAdd}
              disabled={isAdding}
              className={`flex-grow text-white py-3 px-4 rounded font-sans font-semibold uppercase tracking-widest text-xs tracking-wider transition-all duration-300 shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                isAdding 
                  ? 'bg-outline-variant cursor-not-allowed' 
                  : 'bg-primary hover:opacity-95'
              }`}
            >
              {isAdding ? (
                <>
                  <span className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-white inline-block mr-1"></span>
                  <span>Adding To Bag...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Add To Bag — Total ${(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
