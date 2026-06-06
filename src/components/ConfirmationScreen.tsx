/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, Package, Truck, Compass, Calendar, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { OrderDetails } from '../types';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ConfirmationScreenProps {
  orderDetails: OrderDetails;
  onReturnToShop: () => void;
}

export default function ConfirmationScreen({
  orderDetails,
  onReturnToShop
}: ConfirmationScreenProps) {
  const [currentStep, setCurrentStep] = useState(1); // 0: Placed, 1: Quality Check, 2: Packaging, 3: Shipped, 4: Out for Delivery

  const trackingSteps = [
    { title: 'Order Received', desc: 'Secure payment approved', icon: CheckCircle2 },
    { title: 'Atelier Quality Assessment', desc: 'Precision inspection of fabric', icon: ShieldCheck },
    { title: 'Bespoke Packaging', desc: 'Scented tissue & protective cardboard box', icon: Package },
    { title: 'Shipped via Express', desc: 'Transit route assigned', icon: Truck },
    { title: 'Out for Delivery', desc: 'Scheduled premium van delivery', icon: CheckCircle2 }
  ];

  const handleSimulateNextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto" id="confirmation-screen">
      
      {/* Thank you and header card */}
      <div className="text-center bg-surface p-8 sm:p-12 rounded-xl border border-outline-variant/30 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#712ae2] via-[#004ac6] to-[#712ae2]" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full w-16 h-16 border border-emerald-100"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#004ac6] font-extrabold bg-primary/5 px-2.5 py-1 rounded">
            Payment & Secure Approval Confirmed
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-on-surface tracking-tight">
            Thank you for shopping at ShopEase.
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
            Your luxury garment acquisition is currently in active processing. We have dispatched a purchase confirmation receipt to <span className="font-semibold text-on-surface">{orderDetails.shippingInfo.email}</span>.
          </p>
        </div>
      </div>

      {/* Interactive Shipment Milestone Tracker */}
      <div className="bg-surface-container p-6 sm:p-8 rounded-xl border border-outline-variant/30 space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-on-surface">
              Live Shipment Tracking
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Simulate or monitor transportation progress
            </p>
          </div>

          <button
            onClick={handleSimulateNextStep}
            className="flex items-center gap-1 text-[10px] sm:text-xs text-[#712ae2] font-bold uppercase tracking-wider bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 px-2.5 py-1.5 rounded transition-all active:scale-95 duration-200 cursor-pointer"
            id="simulation-step-btn"
            title="Accelerate delivery dispatch process"
          >
            <RefreshCw className="w-3 h-3 text-[#712ae2] animate-spin" />
            <span>Simulate Step Update</span>
          </button>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          
          {/* Timeline connecting line (desktop helper) */}
          <div className="absolute top-6 left-8 right-8 h-0.5 bg-outline-variant/35 hidden md:block z-0" />
          <div 
            className="absolute top-6 left-8 h-0.5 bg-primary hidden md:block transition-all duration-500 z-0" 
            style={{ width: `${(currentStep / 4) * 85}%` }}
          />

          {trackingSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isFuture = idx > currentStep;

            return (
              <div key={idx} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-4 relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary text-white scale-102 shadow-sm' 
                      : isCurrent 
                        ? 'bg-[#712ae2] text-white scale-105 ring-4 ring-secondary/20 animate-pulse'
                        : 'bg-surface border border-outline-variant/65 text-outline'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-0.5 max-w-[150px]">
                  <p className={`font-sans font-bold text-xs sm:text-sm ${
                    isCompleted ? 'text-primary' : isCurrent ? 'text-secondary' : 'text-outline'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Receipt Box */}
        <div className="md:col-span-8 bg-surface p-6 rounded-lg border border-outline-variant/30 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30">
            <div>
              <p className="text-xs text-outline font-medium uppercase tracking-wider">Receipt Invoice</p>
              <h4 className="font-sans font-bold text-sm text-on-surface mt-0.5 font-mono">
                #{orderDetails.orderId}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-outline font-medium uppercase tracking-wider">Date Purchased</p>
              <p className="font-sans font-bold text-xs text-on-surface mt-0.5">
                {orderDetails.orderDate}
              </p>
            </div>
          </div>

          {/* Items breakdown list */}
          <div className="space-y-3.5">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center">
                  <img
                    className="w-10 h-14 object-cover rounded bg-surface border border-outline-variant/20"
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-on-surface line-clamp-1">{item.product.name}</h5>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      {item.quantity} × Size: {item.selectedSize} | {item.selectedColor}
                    </p>
                  </div>
                </div>
                <span className="font-sans font-bold text-on-surface font-mono">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/30 pt-4 space-y-2 text-xs text-on-surface-variant font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-on-surface font-mono">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            {orderDetails.discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Promotional Reduction</span>
                <span className="font-mono">-${orderDetails.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Premium Shipping Rate</span>
              <span className="font-semibold text-on-surface font-mono">${orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-semibold text-on-surface font-mono">${orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-on-surface pt-3 border-t border-outline-variant/30">
              <span>Invoice Total</span>
              <span className="font-mono">${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping details cards */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-surface-container p-5 rounded-lg border border-outline-variant/30 space-y-3.5 text-xs text-on-surface-variant">
            <h4 className="font-sans font-bold text-sm text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline-variant/30">
              Delivery Destination
            </h4>
            
            <div className="space-y-2 leading-relaxed">
              <p className="font-bold text-on-surface">{orderDetails.shippingInfo.fullName}</p>
              <p>{orderDetails.shippingInfo.address}</p>
              <p>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zipCode}</p>
              <p className="uppercase font-semibold tracking-wider text-[10px] mt-1">{orderDetails.shippingInfo.country}</p>
            </div>
          </div>

          {/* Back Home Button trigger */}
          <button
            id="continue-shopping-btn"
            onClick={onReturnToShop}
            className="w-full bg-primary text-white py-3 rounded font-sans font-bold uppercase tracking-widest text-xs tracking-wider transition-all duration-300 shadow-sm hover:opacity-95 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
