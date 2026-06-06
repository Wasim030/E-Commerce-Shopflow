/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Tag, X } from 'lucide-react';
import { PromoCode } from '../types';
import { PROMO_CODES } from '../data';

interface OrderSummaryProps {
  subtotal: number;
  promoApplied: PromoCode | null;
  onApplyPromo: (code: PromoCode | null) => void;
  onProceedToCheckout: () => void;
  showCheckoutBtn?: boolean;
}

export default function OrderSummary({
  subtotal,
  promoApplied,
  onApplyPromo,
  onProceedToCheckout,
  showCheckoutBtn = true
}: OrderSummaryProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Shipping Rules
  // Over $500: Free shipping, or $25 standard premium shipping
  const shippingThreshold = 500;
  const standardShipping = 25.0;
  const isShippingFree = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isShippingFree ? 0 : standardShipping;

  // Calculate discount
  let discountAmount = 0;
  if (promoApplied) {
    if (promoApplied.discountType === 'percentage') {
      discountAmount = (subtotal * promoApplied.value) / 100;
    } else if (promoApplied.discountType === 'fixedPost') {
      discountAmount = Math.min(subtotal, promoApplied.value);
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  // Tax rate (8%)
  const taxRate = 0.08;
  const estimatedTax = subtotalAfterDiscount * taxRate;
  const finalTotal = subtotalAfterDiscount + shippingCost + estimatedTax;

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) {
      setPromoError('Please enter a promotional code');
      return;
    }

    const matchedPromo = PROMO_CODES.find(
      (pc) => pc.code.toLowerCase() === promoInput.trim().toLowerCase()
    );

    if (matchedPromo) {
      onApplyPromo(matchedPromo);
      setPromoInput('');
    } else {
      setPromoError("Invalid code. Try 'ELEGANCE' or 'LUXURY20'");
    }
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
  };

  return (
    <div className="bg-surface-container p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30 space-y-6 sticky top-24">
      <h3 className="font-sans font-bold text-lg md:text-xl text-on-surface">Order Summary</h3>
      
      {/* Visual Calculations layout */}
      <div className="space-y-3.5 pt-2">
        <div className="flex justify-between items-center text-on-surface-variant text-sm">
          <span>Subtotal</span>
          <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
        </div>

        {/* Promo code reduction row */}
        {promoApplied && (
          <div className="flex justify-between items-center text-xs text-secondary font-medium bg-secondary/5 px-2.5 py-1.5 rounded border border-secondary/10">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount ({promoApplied.code})</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span>-${discountAmount.toFixed(2)}</span>
              <button 
                id="remove-promo-btn"
                onClick={handleRemovePromo} 
                className="text-on-surface-variant hover:text-error hover:bg-error/10 p-0.5 rounded transition-all"
                title="Remove discount"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-on-surface-variant text-sm">
          <span>Shipping</span>
          {isShippingFree ? (
            <span className="text-primary font-bold uppercase text-[11px] tracking-wide bg-primary/10 px-2 py-0.5 rounded">
              Complimentary
            </span>
          ) : (
            <div className="text-right">
              <span className="font-semibold text-on-surface">${standardShipping.toFixed(2)}</span>
              <p className="text-[10px] text-outline mt-0.5">
                Spend ${(shippingThreshold - subtotal).toFixed(2)} more for Free Shipping
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-on-surface-variant text-sm">
          <span>Estimated Tax (8%)</span>
          <span className="font-semibold text-on-surface">${estimatedTax.toFixed(2)}</span>
        </div>

        <div className="border-t border-outline-variant/60 pt-4 mt-2 flex justify-between items-baseline text-on-surface">
          <span className="font-sans font-bold text-base md:text-lg">Total</span>
          <span className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-on-surface">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Coupon promo code fields */}
      <div className="pt-2">
        <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            id="promo-code-input"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value);
              setPromoError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            className="flex-grow bg-surface border border-outline-variant/60 rounded focus:border-primary focus:ring-1 focus:ring-primary/20 font-sans text-sm px-3 py-2 transition-all outline-none"
            placeholder="e.g. ELEGANCE"
            type="text"
          />
          <button
            id="apply-promo-btn"
            onClick={handleApplyPromo}
            className="bg-secondary text-white px-4 py-2 font-sans font-semibold text-sm rounded hover:bg-secondary/90 transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-xs text-error font-medium mt-1.5" id="promo-error-msg">
            {promoError}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button 
            onClick={() => setPromoInput('ELEGANCE')}
            className="text-[10px] font-mono text-secondary-container hover:bg-secondary/5 px-1.5 py-0.5 rounded bg-surface border border-outline-variant/30 transition-all"
          >
            ELEGANCE (15% off)
          </button>
          <button 
            onClick={() => setPromoInput('LUXURY20')}
            className="text-[10px] font-mono text-secondary-container hover:bg-secondary/5 px-1.5 py-0.5 rounded bg-surface border border-outline-variant/30 transition-all"
          >
            LUXURY20 (20% off)
          </button>
        </div>
      </div>

      {/* Action CTA Button */}
      {showCheckoutBtn && (
        <button
          id="checkout-cta-btn"
          onClick={onProceedToCheckout}
          disabled={subtotal === 0}
          className={`w-full text-white py-3.5 mt-4 rounded font-sans font-semibold tracking-wider text-sm uppercase transition-all duration-300 shadow-sm active:scale-98 ${
            subtotal === 0 
              ? 'bg-outline-variant cursor-not-allowed text-on-surface-variant' 
              : 'bg-primary hover:opacity-95'
          }`}
        >
          Proceed to Checkout
        </button>
      )}

      {/* Trust Signifiers */}
      <div className="flex items-center justify-center gap-1.5 text-on-surface-variant pt-2 border-t border-outline-variant/30">
        <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-sans font-medium text-xs text-outline">
          Secure Encrypted Transaction Guaranteed
        </span>
      </div>
    </div>
  );
}
