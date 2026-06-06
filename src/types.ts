/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  details: string[];
  rating: number;
}

export interface CartItem {
  id: string; // unique cart item instance ID (product.id + '-' + size + '-' + color)
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type ActiveScreen = 'bag' | 'shop' | 'wishlist' | 'profile' | 'checkout' | 'confirmation';

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixedPost';
  value: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  method: 'standard' | 'express';
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
  orderDate: string;
}
