/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartItemRow from './components/CartItemRow';
import OrderSummary from './components/OrderSummary';
import ShopExplorer from './components/ShopExplorer';
import CheckoutScreen from './components/CheckoutScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import WishlistScreen from './components/WishlistScreen';
import ProfileScreen from './components/ProfileScreen';
import ProductDetailModal from './components/ProductDetailModal';
import { ActiveScreen, CartItem, Product, PromoCode, ShippingInfo, OrderDetails } from './types';
import { LUXURY_PRODUCTS } from './data';
import { 
  ShoppingBag, 
  ArrowRight, 
  Heart, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Undo2, 
  CheckCircle2, 
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  User
} from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('bag');
  const [wishlistIds, setWishlistIds] = useState<string[]>(['cashmere-knit-sweater']);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderDetails | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoCode | null>(null);
  const [selectedDetailProductId, setSelectedDetailProductId] = useState<string | null>(null);

  // Floating responsive toast system
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'secondary';
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Initializing Shopping cart items list state pre-loaded with blazer and bag matching the graphic
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'midnight-tailored-blazer-M-Navy',
      product: LUXURY_PRODUCTS[0], // Midnight Tailored Blazer
      selectedSize: 'M',
      selectedColor: 'Navy',
      quantity: 1
    },
    {
      id: 'minimalist-tote-bag-One Size-Onyx',
      product: LUXURY_PRODUCTS[1], // Minimalist Tote Bag
      selectedSize: 'One Size',
      selectedColor: 'Onyx',
      quantity: 1
    }
  ]);

  // Keep backup of recently deleted item for Undo capability
  const [deletedBackup, setDeletedBackup] = useState<{
    item: CartItem;
    originalIndex: number;
  } | null>(null);

  // Toast automiss handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const triggerToast = (
    message: string,
    type: 'success' | 'info' | 'secondary' = 'success',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToast({ message, type, actionLabel, onAction });
  };

  // Cart actions
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const updated = Math.max(1, item.quantity + delta);
          return { ...item, quantity: updated };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    const itemIndex = cartItems.findIndex((it) => it.id === cartItemId);
    if (itemIndex === -1) return;

    const removedItem = cartItems[itemIndex];
    
    // Save backup and update cart items list state
    setDeletedBackup({ item: removedItem, originalIndex: itemIndex });
    setCartItems((prev) => prev.filter((it) => it.id !== cartItemId));

    triggerToast(
      `Removed "${removedItem.product.name}" from your bag`,
      'secondary',
      'Undo Deletion',
      () => {
        setCartItems((current) => {
          const restored = [...current];
          restored.splice(itemIndex, 0, removedItem);
          return restored;
        });
        triggerToast('Item successfully restored to bag.', 'success');
      }
    );
  };

  const handleAddToBag = (product: Product, size: string, color: string, quantity: number) => {
    const instanceId = `${product.id}-${size}-${color}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.id === instanceId);
      if (existingIdx !== -1) {
        // Increment quantity
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity
        };
        return updated;
      } else {
        // Appends new Instance
        return [
          ...prev,
          {
            id: instanceId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity
          }
        ];
      }
    });

    triggerToast(`Added ${quantity} × "${product.name}" to your bag`, 'success');
  };

  const handleQuickAddToBag = (product: Product) => {
    const size = product.sizes[0] || 'M';
    const color = product.colors[0] || 'Onyx';
    handleAddToBag(product, size, color, 1);
  };

  const handleToggleWishlist = (product: Product) => {
    const isLiked = wishlistIds.includes(product.id);
    if (isLiked) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      triggerToast(`Removed "${product.name}" from your wishlist`, 'secondary');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      triggerToast(`"${product.name}" saved to your wishlist portfolio`, 'success');
    }
  };

  const handleMoveWishlistItemToBag = (product: Product) => {
    handleQuickAddToBag(product);
    // Remove from wishlist
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
  };

  // Secure checkout operations
  const handlePlaceOrder = (shippingInfo: ShippingInfo) => {
    // Finance subtotals
    const currentSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    
    let currentDiscount = 0;
    if (promoApplied) {
      if (promoApplied.discountType === 'percentage') {
        currentDiscount = (currentSubtotal * promoApplied.value) / 100;
      } else if (promoApplied.discountType === 'fixedPost') {
        currentDiscount = Math.min(currentSubtotal, promoApplied.value);
      }
    }

    const discountedSub = Math.max(0, currentSubtotal - currentDiscount);
    const isShippingFree = currentSubtotal >= 500;
    const standardShippingCost = 25.0;
    const finalShippingCost = shippingInfo.method === 'express' 
      ? (isShippingFree ? 15.0 : standardShippingCost + 15.0) 
      : (isShippingFree ? 0 : standardShippingCost);

    const taxAmount = discountedSub * 0.08;
    const currentTotal = discountedSub + finalShippingCost + taxAmount;

    // Generate bespoke order trace object
    const newOrder: OrderDetails = {
      orderId: `SE-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      subtotal: currentSubtotal,
      discount: currentDiscount,
      shipping: finalShippingCost,
      tax: taxAmount,
      total: currentTotal,
      shippingInfo,
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCartItems([]); // Cleans cart items list
    setPromoApplied(null); // Resets promo code state
    setActiveScreen('confirmation');
    triggerToast('Order securely approved and placed!', 'success');
  };

  // Total cart calculation helpers
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const selectedDetailProduct = LUXURY_PRODUCTS.find((p) => p.id === selectedDetailProductId);

  // Return to lists
  const handleViewProduct = (id: string) => {
    setSelectedDetailProductId(id);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans selection:bg-primary/10 selection:text-primary">
      
      {/* Absolute floating toast overlay */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 w-full max-w-sm px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`p-4 rounded-lg shadow-xl flex items-start justify-between gap-3 border ${
                toast.type === 'success'
                  ? 'bg-emerald-950 border-emerald-500/30 text-emerald-100'
                  : toast.type === 'secondary'
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
                    : 'bg-[#004ac6]/10 border-[#004ac6]/20 text-on-surface'
              }`}
            >
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Updates</span>
                </div>
                <p className="text-xs">{toast.message}</p>
                {toast.actionLabel && toast.onAction && (
                  <button
                    id="toast-action-btn"
                    onClick={() => {
                      toast.onAction?.();
                      setToast(null);
                    }}
                    className="mt-2 text-xs font-bold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>{toast.actionLabel}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        cartCount={cartCount}
        ordersCount={orders.length}
      />

      {/* Main Core Container */}
      <main className="flex-grow pt-24 pb-32 px-4 md:px-16 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeScreen === 'bag' && (
            <motion.div
              key="bag-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
              id="shopping-bag-view"
            >
              {/* Title Section */}
              <div className="space-y-2">
                <h2 className="font-sans font-black text-2xl sm:text-3.5xl text-on-surface tracking-tight">
                  Your Cart
                </h2>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Review your selection before proceeding to luxury checkout.
                </p>
              </div>

              {cartItems.length === 0 ? (
                /* Empty bag State */
                <div className="text-center py-20 bg-surface-container p-8 rounded-xl border border-outline-variant/30 space-y-4 max-w-xl mx-auto">
                  <div className="bg-primary/5 text-primary p-4 rounded-full border border-primary/10 inline-flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-sans font-bold text-lg text-on-surface">Your bag is completely empty</h3>
                    <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                      Explore our premium wool tailoring, fine mock knitwear, and architectural totes to initiate checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveScreen('shop')}
                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest py-3 px-5 rounded shadow hover:opacity-95 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Boutique Items</span>
                  </button>
                </div>
              ) : (
                /* Dynamic Split Column Grid Layout */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left component: Cart items list */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="pb-2 border-b border-outline-variant/30">
                      <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        Acquisitions Ledger ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                      </span>
                    </div>

                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemoveItem={handleRemoveItem}
                          onViewProductDetails={handleViewProduct}
                        />
                      ))}
                    </div>

                    {/* Promotion quick indicators under items list */}
                    <div className="bg-surface-container-low p-4 rounded border border-outline-variant/35 flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Eligible for Complimentary Express Hand-off Delivery</span>
                      </span>
                      <button 
                        onClick={() => setActiveScreen('shop')}
                        className="text-primary hover:underline font-bold uppercase tracking-wide inline-flex items-center gap-0.5"
                      >
                        <span>Add items</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right component: Order static Calculation summary Card */}
                  <aside className="lg:col-span-4">
                    <OrderSummary
                      subtotal={cartSubtotal}
                      promoApplied={promoApplied}
                      onApplyPromo={setPromoApplied}
                      onProceedToCheckout={() => setActiveScreen('checkout')}
                      showCheckoutBtn={true}
                    />
                  </aside>

                </div>
              )}
            </motion.div>
          )}

          {activeScreen === 'shop' && (
            <motion.div
              key="shop-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShopExplorer
                onViewProductDetails={handleViewProduct}
                onQuickAddToBag={handleQuickAddToBag}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            </motion.div>
          )}

          {activeScreen === 'wishlist' && (
            <motion.div
              key="wishlist-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <WishlistScreen
                wishlistItems={LUXURY_PRODUCTS.filter((p) => wishlistIds.includes(p.id))}
                onRemoveFromWishlist={handleToggleWishlist}
                onMoveToBag={handleMoveWishlistItemToBag}
                onViewProductDetails={handleViewProduct}
                onExploreProducts={() => setActiveScreen('shop')}
              />
            </motion.div>
          )}

          {activeScreen === 'profile' && (
            <motion.div
              key="profile-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileScreen
                orders={orders}
                onViewOrder={(order) => {
                  setLastPlacedOrder(order);
                  setActiveScreen('confirmation');
                }}
                onExploreProducts={() => setActiveScreen('shop')}
              />
            </motion.div>
          )}

          {activeScreen === 'checkout' && (
            <motion.div
              key="checkout-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CheckoutScreen
                cartItems={cartItems}
                promoApplied={promoApplied}
                onPlaceOrder={handlePlaceOrder}
                onBackToBag={() => setActiveScreen('bag')}
              />
            </motion.div>
          )}

          {activeScreen === 'confirmation' && lastPlacedOrder && (
            <motion.div
              key="confirmation-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ConfirmationScreen
                orderDetails={lastPlacedOrder}
                onReturnToShop={() => setActiveScreen('shop')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Bottom Navigation bar (Mobile screens only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 bg-surface border-t border-outline-variant z-40 shadow-lg px-2">
        <button
          onClick={() => setActiveScreen('shop')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer w-1/4 transition-colors ${
            activeScreen === 'shop' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide mt-1 uppercase">Shop</span>
        </button>

        <button
          onClick={() => setActiveScreen('bag')}
          className={`relative flex flex-col items-center justify-center p-1 cursor-pointer w-1/4 transition-colors ${
            activeScreen === 'bag' || activeScreen === 'checkout' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-5 bg-primary text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center font-mono">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-wide mt-1 uppercase">Bag</span>
        </button>

        <button
          onClick={() => setActiveScreen('wishlist')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer w-1/4 transition-colors ${
            activeScreen === 'wishlist' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide mt-1 uppercase">Wishlist</span>
        </button>

        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer w-1/4 transition-colors ${
            activeScreen === 'profile' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide mt-1 uppercase">Profile</span>
        </button>
      </nav>

      {/* Global Product Specification Drawer Details Modal */}
      <AnimatePresence>
        {selectedDetailProductId && selectedDetailProduct && (
          <ProductDetailModal
            product={selectedDetailProduct}
            onClose={() => setSelectedDetailProductId(null)}
            onAddToBag={handleAddToBag}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedDetailProduct.id)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
