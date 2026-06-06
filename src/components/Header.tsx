/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Menu, ShoppingBag, Heart, User, Compass, X } from 'lucide-react';
import { ActiveScreen } from '../types';
import { useState } from 'react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  ordersCount: number;
}

export default function Header({
  activeScreen,
  setActiveScreen,
  cartCount,
  ordersCount
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop' as ActiveScreen, label: 'Curated Shop', icon: Compass },
    { id: 'bag' as ActiveScreen, label: 'Your Bag', icon: ShoppingBag, badge: cartCount },
    { id: 'wishlist' as ActiveScreen, label: 'Wishlist', icon: Heart },
    { id: 'profile' as ActiveScreen, label: 'Profile', icon: User, badge: ordersCount > 0 ? ordersCount : undefined },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-45 bg-surface/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/30">
        <nav className="flex justify-between items-center px-4 md:px-16 h-16 w-full max-w-7xl mx-auto">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <button 
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden active:scale-95 transition-transform duration-200 hover:opacity-75 text-on-surface"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div 
              onClick={() => setActiveScreen('shop')} 
              className="flex items-center gap-2 cursor-pointer group"
              id="header-brand-logo"
            >
              <span className="font-sans font-black text-xl tracking-tighter text-on-surface transition-colors group-hover:text-primary">
                ShopEase
              </span>
              <span className="hidden md:inline-block font-mono text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 font-semibold">
                Luxury
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id || (item.id === 'bag' && activeScreen === 'checkout');
                return (
                  <button
                    key={item.id}
                    id={`desktop-nav-${item.id}`}
                    onClick={() => setActiveScreen(item.id)}
                    className={`relative py-5 text-sm font-medium tracking-wide transition-all uppercase flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-primary scale-102 font-semibold' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label === 'Your Bag' ? 'Bag' : item.label.split(' ')[0]}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-4">
            <button
              id="header-shortcut-bag"
              onClick={() => setActiveScreen('bag')}
              className={`relative p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-95 duration-200 border border-outline-variant/20 ${
                activeScreen === 'bag' ? 'text-primary bg-primary/5 border-primary/20' : 'text-on-surface'
              }`}
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-mono border-2 border-surface animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="header-shortcut-wishlist"
              onClick={() => setActiveScreen('wishlist')}
              className={`hidden sm:inline-flex p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-95 duration-200 border border-outline-variant/20 ${
                activeScreen === 'wishlist' ? 'text-secondary bg-secondary/5 border-secondary/20' : 'text-on-surface-variant'
              }`}
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-surface p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-outline-variant/40">
                  <span className="font-sans font-black text-xl tracking-tighter text-on-surface">
                    ShopEase Luxury
                  </span>
                  <button 
                    id="close-mobile-menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 hover:bg-surface-container rounded-full text-on-surface"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-5 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-nav-${item.id}`}
                        onClick={() => {
                          setActiveScreen(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-lg text-left transition-all ${
                          isActive 
                            ? 'bg-primary/5 text-primary font-bold' 
                            : 'hover:bg-surface-container-low text-on-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium tracking-wide uppercase text-sm">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-mono">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/40 text-center">
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
                  Secure Direct Delivery
                </p>
                <p className="text-[11px] text-outline mt-1">
                  Free over $500 • Worldwide Express
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
