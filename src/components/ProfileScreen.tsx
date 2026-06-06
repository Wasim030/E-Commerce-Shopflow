/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Package, MapPin, Eye, Award, ExternalLink, Calendar, Mail } from 'lucide-react';
import { OrderDetails } from '../types';

interface ProfileScreenProps {
  orders: OrderDetails[];
  onViewOrder: (order: OrderDetails) => void;
  onExploreProducts: () => void;
}

export default function ProfileScreen({
  orders,
  onViewOrder,
  onExploreProducts
}: ProfileScreenProps) {
  return (
    <div className="space-y-8 animate-fadeIn" id="profile-screen">
      
      {/* Visual Identity Profile Panel */}
      <div className="bg-surface p-6 sm:p-10 rounded-xl border border-outline-variant/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-sm relative overflow-hidden">
        {/* Subtle geometric circle designs in the background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary/5 border border-secondary/10 pointer-events-none" />
        
        {/* Left: Avatar container */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-outline-variant/30 pb-6 md:pb-0 md:pr-6 whitespace-nowrap">
          <div className="bg-primary/5 text-primary p-5 rounded-full border border-primary/10 relative">
            <User className="w-12 h-12" />
            <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              VIP
            </span>
          </div>
          <h3 className="font-sans font-bold text-lg text-on-surface mt-4">
            Sarah Worthington
          </h3>
          <p className="text-xs text-[#712ae2] font-semibold tracking-wider flex items-center gap-1.5 mt-1 font-sans">
            <Award className="w-3.5 h-3.5 fill-secondary/10" />
            <span>Platinum Elite Client</span>
          </p>
        </div>

        {/* Right: Personal specifications */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-on-surface-variant pl-0 md:pl-4">
          <div className="space-y-1 bg-surface-container-low p-3.5 rounded border border-outline-variant/20">
            <span className="font-semibold text-outline text-[10px] uppercase tracking-wider block">Email Address</span>
            <span className="font-medium text-on-surface flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>sarah.w@editorialdesign.com</span>
            </span>
          </div>

          <div className="space-y-1 bg-surface-container-low p-3.5 rounded border border-outline-variant/20">
            <span className="font-semibold text-outline text-[10px] uppercase tracking-wider block">Acquisition Status</span>
            <span className="font-medium text-on-surface flex items-center gap-1.5 mt-0.5">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span>Complimentary Expedited Delivery</span>
            </span>
          </div>

          <div className="space-y-1 bg-surface-container-low p-3.5 rounded border border-outline-variant/20">
            <span className="font-semibold text-outline text-[10px] uppercase tracking-wider block">Member Since</span>
            <span className="font-medium text-on-surface flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-outline" />
              <span>November 2024</span>
            </span>
          </div>

          <div className="space-y-1 bg-surface-container-low p-3.5 rounded border border-outline-variant/20">
            <span className="font-semibold text-outline text-[10px] uppercase tracking-wider block">Preferred Storehouse</span>
            <span className="font-medium text-on-surface flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>New York Atelier Fifth Ave</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Dynamic Orders History records column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="pb-3 border-b border-outline-variant/30 flex justify-between items-baseline">
            <h4 className="font-sans font-bold text-base text-on-surface">Order Acquisition History</h4>
            <span className="font-mono text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              {orders.length} Active Records
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-14 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-4 p-6">
              <Package className="w-10 h-10 text-outline mx-auto" />
              <div className="space-y-1">
                <p className="font-sans font-semibold text-sm text-on-surface">No orders placed during this session</p>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  Acquire tailored blazers and minimalist totes to fill this ledger with stateful orders.
                </p>
              </div>
              <button
                onClick={onExploreProducts}
                className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-2 px-3.5 rounded hover:bg-opacity-95 transition-all"
              >
                Go Shop Products
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="order-history-list">
              {orders.map((or) => (
                <div
                  key={or.orderId}
                  className="bg-surface border border-outline-variant/30 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-surface-container-low/30"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Active Order
                      </span>
                      <span className="font-mono font-bold text-xs text-on-surface">
                        #{or.orderId}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Placed on <span className="font-semibold text-on-surface">{or.orderDate}</span> • Total of <span className="font-semibold text-on-surface">{or.items.length} items</span>
                    </p>
                    <p className="text-xs text-outline">
                      To: {or.shippingInfo.fullName} • Destination city: {or.shippingInfo.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-outline-variant/10">
                    <div className="text-right">
                      <p className="text-[10px] text-outline font-medium uppercase tracking-wider">Amount Paid</p>
                      <p className="font-sans font-extrabold text-sm text-on-surface">
                        ${or.total.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => onViewOrder(or)}
                      className="inline-flex items-center gap-1 bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded hover:opacity-95 cursor-pointer transition-all active:scale-95 duration-200 shadow-sm"
                      title="Inspect delivery milestones"
                    >
                      <span>Track Shipment</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Addresses list column */}
        <div className="lg:col-span-4 bg-surface p-5 border border-outline-variant/30 rounded-lg space-y-4">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-on-surface pb-2 border-b border-outline-variant/30 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Saved Storehouses</span>
          </h4>

          <div className="space-y-3 text-xs text-on-surface-variant">
            <div className="p-3 border border-primary/20 bg-primary/2.5 rounded relative space-y-1">
              <span className="absolute top-2 right-2 bg-primary text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
                Default
              </span>
              <p className="font-bold text-on-surface">Sarah Worthington (Primary)</p>
              <p className="leading-relaxed">842 Park Avenue</p>
              <p>New York, NY 10021, US</p>
            </div>

            <div className="p-3 border border-outline-variant/30 rounded relative space-y-1 hover:bg-surface-container-low transition-colors">
              <p className="font-bold text-on-surface">Sarah Worthington (Paris Study)</p>
              <p className="leading-relaxed">14 Rue de l'Atelier</p>
              <p>75001 Paris, France</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
