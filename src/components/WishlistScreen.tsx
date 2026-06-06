/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, Trash, MoveRight, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface WishlistScreenProps {
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToBag: (product: Product) => void;
  onViewProductDetails: (productId: string) => void;
  onExploreProducts: () => void;
}

export default function WishlistScreen({
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToBag,
  onViewProductDetails,
  onExploreProducts
}: WishlistScreenProps) {
  return (
    <div className="space-y-8 animate-fadeIn" id="wishlist-screen">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-outline-variant/65">
        <h2 className="font-sans font-black text-2xl text-on-surface tracking-tight">
          Your Curated Wishlist
        </h2>
        <p className="font-sans text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Review, analyze, and migrate your favorite luxury picks straight into your checkout bag.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low border border-dashed border-outline-variant/60 rounded-xl max-w-2xl mx-auto p-8 space-y-4">
          <div className="inline-flex items-center justify-center bg-[#712ae2]/5 text-secondary p-4 rounded-full border border-secondary/15 animate-pulse">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-sans font-bold text-base text-on-surface">Your wishlist is currently empty</h3>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Save beautiful items from our latest collection by clicking the heart badge overlay during exploration.
            </p>
          </div>
          <button
            onClick={onExploreProducts}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded hover:bg-opacity-90 active:scale-95 duration-200 cursor-pointer"
          >
            <span>Explore Curated Store</span>
            <MoveRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="wishlist-grid">
          {wishlistItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="group flex flex-col justify-between border border-outline-variant/20 rounded bg-surface p-2.5 shadow-sm transition-all hover:shadow-md"
            >
              {/* Product Image preview 3:4 */}
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-container rounded">
                <img
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onViewProductDetails(item.id)}
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                />

                {/* Quick Delete Trash badge */}
                <button
                  onClick={() => onRemoveFromWishlist(item)}
                  className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white text-outline-variant hover:text-error rounded-full p-2.5 shadow-sm transition-all active:scale-95 duration-200 cursor-pointer"
                  title="Remove from favorites list"
                >
                  <Trash className="w-3.5 h-3.5 text-on-surface-variant hover:text-error" />
                </button>
              </div>

              {/* Product Details info header */}
              <div className="pt-3.5 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-1">
                    <h3 
                      onClick={() => onViewProductDetails(item.id)}
                      className="font-sans font-bold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center text-amber-500 text-[10px]">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="font-mono font-medium ml-0.5">{item.rating}</span>
                    </div>
                  </div>
                  <p className="font-sans font-bold text-xs text-on-surface">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quick moves and specifications actions */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                  <button
                    onClick={() => onMoveToBag(item)}
                    className="w-full bg-primary text-white py-2 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move To Bag</span>
                  </button>
                  <button
                    onClick={() => onViewProductDetails(item.id)}
                    className="w-full bg-surface border border-outline-variant/50 hover:bg-surface-container-low text-on-surface py-1.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
