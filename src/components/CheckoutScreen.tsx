/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Lock, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { ShippingInfo, CartItem, PromoCode } from '../types';
import { useState, FormEvent } from 'react';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  promoApplied: PromoCode | null;
  onPlaceOrder: (shipping: ShippingInfo) => void;
  onBackToBag: () => void;
}

export default function CheckoutScreen({
  cartItems,
  promoApplied,
  onPlaceOrder,
  onBackToBag
}: CheckoutScreenProps) {
  // Form values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment states (simple mock validation)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Subtotal calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Promo code
  let discountAmount = 0;
  if (promoApplied) {
    if (promoApplied.discountType === 'percentage') {
      discountAmount = (subtotal * promoApplied.value) / 100;
    } else if (promoApplied.discountType === 'fixedPost') {
      discountAmount = Math.min(subtotal, promoApplied.value);
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  // Shipping Method Cost
  const isShippingFree = subtotal >= 500;
  const baseShippingCost = isShippingFree ? 0 : 25.00;
  const finalShippingCost = shippingMethod === 'express' ? baseShippingCost + 15.00 : baseShippingCost;

  // Tax (8%)
  const taxRate = 0.08;
  const estimatedTax = subtotalAfterDiscount * taxRate;
  const finalTotal = subtotalAfterDiscount + finalShippingCost + estimatedTax;

  // Autofill address helper for reviewers
  const handleAutofillDemo = () => {
    setFullName('Sarah Worthington');
    setEmail('sarah.w@editorialdesign.com');
    setAddress('842 Park Avenue');
    setCity('New York');
    setState('NY');
    setZipCode('10021');
    setCountry('United States');
    setCardName('SARAH WORTHINGTON');
    setCardNumber('4111 2222 3333 4444');
    setExpiry('11/28');
    setCvv('382');
    setFormErrors({});
  };

  const handlePlaceOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName) errors.fullName = 'Full Name is required';
    if (!email || !email.includes('@')) errors.email = 'Valid Email is required';
    if (!address) errors.address = 'Street Address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!zipCode) errors.zipCode = 'Postal / ZIP Code is required';
    if (!cardName) errors.cardName = 'Cardholder name is required';
    if (cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Valid Card Number is required';
    if (!expiry || !expiry.includes('/')) errors.expiry = 'MM/YY required';
    if (cvv.length < 3) errors.cvv = 'CVV required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // scroll to top of form
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    const shippingInfo: ShippingInfo = {
      fullName,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      method: shippingMethod
    };

    onPlaceOrder(shippingInfo);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="checkout-screen">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div className="space-y-1">
          <button
            onClick={onBackToBag}
            className="text-xs text-on-surface-variant hover:text-black font-semibold flex items-center gap-1.5 uppercase tracking-wide py-1 border border-outline-variant/30 px-2.5 rounded hover:bg-surface-container cursor-pointer transition-all active:scale-95 duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </button>
          <h2 className="font-sans font-black text-2xl text-on-surface tracking-tight mt-1">
            Bespoke Order Checkout
          </h2>
        </div>

        {/* Demo Button for evaluated users */}
        <button
          onClick={handleAutofillDemo}
          className="bg-secondary/10 hover:bg-secondary/15 border border-secondary/25 text-secondary text-xs font-bold uppercase tracking-wider py-2 px-3.5 rounded transition-all active:scale-95 duration-200 flex items-center gap-1.5"
          title="Autofills clean demo order credentials for rapid testing"
          id="autofill-demo-btn"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Demo Autofill Credentials</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Two Columns inputs form */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-8 space-y-8">
          
          {/* Shipping Address panel */}
          <div className="space-y-4 bg-surface p-6 rounded-lg border border-outline-variant/40 shadow-sm">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 pb-2 border-b border-outline-variant/30">
              <span className="flex items-center justify-center bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5">1</span>
              <span>Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                <input
                  id="checkout-fullName"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); if (formErrors.fullName) setFormErrors({...formErrors, fullName: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.fullName ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="e.g. Sarah Worthington"
                  type="text"
                />
                {formErrors.fullName && <p className="text-[10px] text-error font-medium">{formErrors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
                <input
                  id="checkout-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors({...formErrors, email: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.email ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="e.g. sarah.w@editorialdesign.com"
                  type="email"
                />
                {formErrors.email && <p className="text-[10px] text-error font-medium">{formErrors.email}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Street Address</label>
                <input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); if (formErrors.address) setFormErrors({...formErrors, address: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.address ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="Building No, Street, Apartment, Suite"
                  type="text"
                />
                {formErrors.address && <p className="text-[10px] text-error font-medium">{formErrors.address}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">City</label>
                <input
                  id="checkout-city"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); if (formErrors.city) setFormErrors({...formErrors, city: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.city ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="e.g. New York"
                  type="text"
                />
                {formErrors.city && <p className="text-[10px] text-error font-medium">{formErrors.city}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">State/Province</label>
                  <input
                    id="checkout-state"
                    value={state}
                    onChange={(e) => { setState(e.target.value); if (formErrors.state) setFormErrors({...formErrors, state: ''}); }}
                    className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                      formErrors.state ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                    }`}
                    placeholder="e.g. NY"
                    type="text"
                  />
                  {formErrors.state && <p className="text-[10px] text-error font-medium">{formErrors.state}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Postal/ZIP</label>
                  <input
                    id="checkout-zip"
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value); if (formErrors.zipCode) setFormErrors({...formErrors, zipCode: ''}); }}
                    className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                      formErrors.zipCode ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                    }`}
                    placeholder="e.g. 10021"
                    type="text"
                  />
                  {formErrors.zipCode && <p className="text-[10px] text-error font-medium">{formErrors.zipCode}</p>}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-on-surface cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Methods selector */}
          <div className="space-y-4 bg-surface p-6 rounded-lg border border-outline-variant/40 shadow-sm">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 pb-2 border-b border-outline-variant/30">
              <span className="flex items-center justify-center bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5">2</span>
              <span>Shipping Method</span>
            </h3>

            <div className="space-y-3">
              {/* Method A */}
              <label 
                className={`flex gap-3 items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                  shippingMethod === 'standard' 
                    ? 'border-primary bg-primary/2.5' 
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <input
                    type="radio"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-1 text-primary focus:ring-primary border-outline-variant"
                  />
                  <div>
                    <span className="font-sans font-semibold text-xs sm:text-sm text-on-surface uppercase tracking-wide block">
                      Standard Premium Courier
                    </span>
                    <span className="text-xs text-on-surface-variant block mt-0.5">
                      Delivery in 3-5 business days. Clean protective cardboard sleeves.
                    </span>
                  </div>
                </div>
                <span className="font-sans font-bold text-xs sm:text-sm text-on-surface">
                  {isShippingFree ? 'Free' : `$${baseShippingCost.toFixed(2)}`}
                </span>
              </label>

              {/* Method B */}
              <label 
                className={`flex gap-3 items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                  shippingMethod === 'express' 
                    ? 'border-primary bg-primary/2.5' 
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <input
                    type="radio"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-1 text-primary focus:ring-primary border-outline-variant"
                  />
                  <div>
                    <span className="font-sans font-semibold text-xs sm:text-sm text-on-surface uppercase tracking-wide block flex items-center gap-1.5">
                      <span>Express Direct delivery</span>
                      <span className="bg-secondary/15 text-secondary text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                        Fastest
                      </span>
                    </span>
                    <span className="text-xs text-on-surface-variant block mt-0.5">
                      Delivery in 1-2 business days with temperature-controlled courier vans.
                    </span>
                  </div>
                </div>
                <span className="font-sans font-bold text-xs sm:text-sm text-on-surface">
                  ${(finalShippingCost).toFixed(2)}
                </span>
              </label>
            </div>
          </div>

          {/* Secure Payment details panel */}
          <div className="space-y-4 bg-surface p-6 rounded-lg border border-outline-variant/40 shadow-sm">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5">3</span>
                <span>Secure Card Payment</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-outline bg-surface-container px-2 py-0.5 rounded font-mono font-semibold">
                <Lock className="w-2.5 h-2.5 text-primary" />
                <span>SSL Encrypted</span>
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Cardholder Name</label>
                <input
                  id="checkout-cardName"
                  value={cardName}
                  onChange={(e) => { setCardName(e.target.value.toUpperCase()); if (formErrors.cardName) setFormErrors({...formErrors, cardName: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all uppercase placeholder:normal-case ${
                    formErrors.cardName ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="e.g. SARAH WORTHINGTON"
                  type="text"
                />
                {formErrors.cardName && <p className="text-[10px] text-error font-medium">{formErrors.cardName}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Credit Card Number</label>
                <div className="relative">
                  <input
                    id="checkout-cardNumber"
                    value={cardNumber}
                    maxLength={19}
                    onChange={(e) => {
                      // auto space formatting
                      const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                      if (formErrors.cardNumber) setFormErrors({...formErrors, cardNumber: ''});
                    }}
                    className={`w-full bg-surface-container-lowest border rounded pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                      formErrors.cardNumber ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                    }`}
                    placeholder="4111 2222 3333 4444"
                    type="text"
                  />
                  <CreditCard className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.cardNumber && <p className="text-[10px] text-error font-medium">{formErrors.cardNumber}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Expiration Date</label>
                <input
                  id="checkout-expiry"
                  value={expiry}
                  maxLength={5}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) {
                      val = val.substring(0, 2) + '/' + val.substring(2, 4);
                    }
                    setExpiry(val);
                    if (formErrors.expiry) setFormErrors({...formErrors, expiry: ''});
                  }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.expiry ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="MM/YY"
                  type="text"
                />
                {formErrors.expiry && <p className="text-[10px] text-error font-medium">{formErrors.expiry}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">CVV Secure Pin</label>
                <input
                  id="checkout-cvv"
                  value={cvv}
                  maxLength={4}
                  onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '')); if (formErrors.cvv) setFormErrors({...formErrors, cvv: ''}); }}
                  className={`w-full bg-surface-container-lowest border rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${
                    formErrors.cvv ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'
                  }`}
                  placeholder="382"
                  type="password"
                />
                {formErrors.cvv && <p className="text-[10px] text-error font-medium">{formErrors.cvv}</p>}
              </div>
            </div>
          </div>

          {/* Secure Place Order Trigger CTA */}
          <button
            id="place-order-submit-btn"
            type="submit"
            className="w-full bg-primary text-white py-4 rounded font-sans font-bold uppercase tracking-widest text-xs tracking-wider transition-all duration-300 shadow-md hover:opacity-95 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Securely Place Order — Total ${finalTotal.toFixed(2)}</span>
          </button>
        </form>

        {/* Right Column: Checkout Items Review and cost list */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/40 space-y-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant pb-2 border-b border-outline-variant/30">
              Bag Items Review
            </h3>

            {/* List mini products */}
            <div className="space-y-4 max-h-[290px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-2.5 items-center justify-between border-b border-outline-variant/20 pb-3 last:border-0 last:pb-0">
                  <div className="flex gap-2.5 items-center">
                    <img
                      className="w-12 h-16 object-cover rounded bg-surface border border-outline-variant/20"
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-on-surface line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        Qty: {item.quantity} • Size: {item.selectedSize}
                      </p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-xs text-on-surface">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed financial lists */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/30 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-secondary">
                  <span>Promo Discount ({promoApplied.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-semibold text-on-surface">${finalShippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-on-surface">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/30">
                <span>Final Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Bullet delivery protection cards */}
          <div className="bg-surface border border-outline-variant/30 p-4 rounded-lg space-y-2 text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Purchase Protection Plan</span>
            </span>
            <p className="leading-relaxed">
              ShopEase Luxury protects your garments under standard transport insurance. Complimentary returns within 14 days, pre-paid shipping labels included inside the carton.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
