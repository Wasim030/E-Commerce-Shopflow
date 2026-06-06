/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FC } from 'react';
import { motion } from 'motion/react';
import { Trash, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onViewProductDetails: (productId: string) => void;
}

const CartItemRow: FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onViewProductDetails
}) => {
  const { product, selectedSize, selectedColor, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 p-2 border-b border-outline-variant/60 transition-all hover:bg-surface-container-low/50"
      id={`cart-item-row-${item.id}`}
    >
      {/* Product Image */}
      <div 
        onClick={() => onViewProductDetails(product.id)}
        className="w-24 h-32 sm:w-32 sm:h-44 flex-shrink-0 bg-surface-container overflow-hidden rounded-md cursor-pointer group relative shadow-inner"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-500 scale-102 group-hover:scale-106"
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Details Content */}
      <div className="flex flex-col justify-between py-1 flex-grow">
        
        {/* Top Details & Delete Button */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 
              onClick={() => onViewProductDetails(product.id)}
              className="font-sans font-medium text-sm sm:text-base text-on-surface hover:text-primary transition-colors cursor-pointer tracking-tight"
            >
              {product.name}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
              {product.sizes[0] === 'One Size' ? 'One Size' : `Size: ${selectedSize}`}
              <span className="mx-1.5 opacity-40">|</span>
              Color: {selectedColor}
            </p>
          </div>

          <button
            id={`remove-item-${item.id}`}
            onClick={() => onRemoveItem(item.id)}
            className="p-1 px-1.5 border border-transparent rounded text-outline hover:border-error/20 hover:bg-error/5 hover:text-error transition-all active:scale-90 duration-200"
            title="Remove item"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity Controls & Dynamic Price */}
        <div className="flex justify-between items-end gap-4 mt-2">
          {/* Custom Capsule Quantity Adjuster */}
          <div className="flex items-center border border-outline-variant rounded-full px-2 py-1 gap-3 bg-surface shadow-sm">
            <button
              id={`qty-decrease-${item.id}`}
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={quantity <= 1}
              className={`hover:text-primary active:scale-90 transition-all p-0.5 rounded-full ${
                quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-sans font-semibold text-xs sm:text-sm text-on-surface w-4 text-center select-none">
              {quantity}
            </span>
            <button
              id={`qty-increase-${item.id}`}
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="hover:text-primary active:scale-90 transition-all p-0.5 rounded-full"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pricing detail */}
          <div className="text-right">
            {quantity > 1 && (
              <p className="text-[10px] sm:text-xs text-outline font-mono mb-0.5">
                {quantity} × ${product.price.toFixed(2)}
              </p>
            )}
            <p className="font-sans font-bold text-sm sm:text-base text-on-surface">
              ${itemTotal.toFixed(2)}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CartItemRow;
