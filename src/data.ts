/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, PromoCode } from './types';

export const LUXURY_PRODUCTS: Product[] = [
  {
    id: 'midnight-tailored-blazer',
    name: 'Midnight Tailored Blazer',
    price: 450.00,
    description: 'A premium, structured blazer crafted from Italian virgin wool. Features dual rear vents, clean notch lapels, and custom tortoiseshell buttons. Crafted in modern ateliers with pristine attention to shoulder structure.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmbBJVubRN7SnIDOtAI4K4Lv5tC8LEc9jr9mCIX-OajP26h5pb5wQMT4hPVAQPS2Ktlz_tzY5B0daEiEI10Ln6XES2PMGCfTRjvPvyv6Nke2p2qfgN3pxF2bAaPVPH6QEulCZesB1EMiJAKWjoAi2QGCbfuzezFbBp-45yVhkICNC9NFK7fxsTZCW0A3JeLmumDg6XSjcOgW2-eYVvjnKn0mCzNKH4DsOkd6rPulN1Sif6N1NxtPELgVCOpzxloR8-aLXp7i5doVY',
    category: 'Outerwear',
    colors: ['Navy', 'Charcoal', 'Onyx'],
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '100% Italian Virgin Wool outer shell',
      '100% Cupro lining for smooth layering',
      'Dual rear vents and slim-cut lapels',
      'Dry clean only',
      'Made in Italy'
    ],
    rating: 4.9
  },
  {
    id: 'minimalist-tote-bag',
    name: 'Minimalist Tote Bag',
    price: 225.00,
    description: 'A sleek, structured tote bag featuring clean architectural lines and an elegant drop handle. Crafted in fine-grained calfskin leather, offering a perfectly organized interior compartments for all daily essentials.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOF2O5w1NXu145m50OsCO3Vh3rqCevvXEzov1xxIbkS72DRlb-JfqaT47iEtuHVYZ8UL-w5Kzr-NdWbZOG0RX_tvQb0NicrPP8rnOqPiD8wXEz-33q6ZWqHBBYxXOw0yVH6dYuinsptPgDMf9qr6j8LFaET3DQIaLufKDieCV17vl0vXv-nPRQHMjQnhU6SaJ6X5B5DHD34xd-xg0iAnQarc1bZ_vW5-Hbgzb0zjUOGLw8_VfgMIEUVjNGjUY976pvKk5Z-zksnZs',
    category: 'Accessories',
    colors: ['Onyx', 'Tan', 'Alabaster'],
    sizes: ['One Size'],
    details: [
      '100% Full-grain calfskin leather',
      'Hand-painted raw edges',
      'Dual interior patch pockets & zipped secure compartment',
      'Sized perfectly to accommodate up to a 15-inch laptop',
      'Dust bag included'
    ],
    rating: 4.8
  },
  {
    id: 'cashmere-knit-sweater',
    name: 'Cashmere Ribbed Sweater',
    price: 295.00,
    description: 'An exceptionally soft rib-knit sweater constructed from rare Inner Mongolian cashmere. Features a slightly relaxed mock-neck collar and structured cuffs, making it a luxurious layering staple.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    category: 'Knitwear',
    colors: ['Cream', 'Camel', 'Slate'],
    sizes: ['XS', 'S', 'M', 'L'],
    details: [
      '100% Grade-A Inner Mongolian Cashmere',
      '12-gauge tight rib knit structure',
      'Mock neck collar detail',
      'Breathable, lightweight, yet exceptional insulation',
      'Hand wash recommended'
    ],
    rating: 4.95
  },
  {
    id: 'wool-trench-coat',
    name: 'Classic Double-Breasted Trench',
    price: 650.00,
    description: 'A striking statement coat sculpted from thick wool-cashmere blend. Details present military-inspired storm flaps, tortoiseshell hardware, and a high-cinch waist belt for a commanding silhouette.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    category: 'Outerwear',
    colors: ['Camel', 'Onyx'],
    sizes: ['S', 'M', 'L'],
    details: [
      '85% Virgin Wool, 15% Cashmere',
      'Water-repellent structured finish',
      'Genuine horn buttons',
      'Adjustable belt with leather-covered buckle',
      'Fully lined with signature stripe pattern'
    ],
    rating: 4.7
  },
  {
    id: 'leather-chelsea-boots',
    name: 'Suede Chelsea Boots',
    price: 340.00,
    description: 'Clean silhouette Chelsea boots crafted from hand-selected calfskin suede. Finished with elasticated side panels, custom woven pull tabs, and a Blake-stitched Italian leather sole with protective rubber accents.',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
    category: 'Footwear',
    colors: ['Sand', 'Onyx'],
    sizes: ['40', '41', '42', '43', '44'],
    details: [
      'Premium Italian calfskin suede',
      'Flexible elastic side gussets for easy entry',
      'Full leather lining with padded footbed',
      'Durable Blake-stitch outsoles',
      'Handcrafted in Portugal'
    ],
    rating: 4.88
  },
  {
    id: 'premium-silk-slip-dress',
    name: 'Silk Charmeuse Pleated Dress',
    price: 380.00,
    description: 'An elegant cowl neck dress cut on the bias from high-weight silk charmeuse. Radiates a subtle, fluid luster. Complete with delicate cross-back spaghetti straps and an asymmetrical midi-length hem.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    category: 'Dresses',
    colors: ['Emerald', 'Champagne', 'Onyx'],
    sizes: ['XS', 'S', 'M', 'L'],
    details: [
      '100% 19mm Mulberry Silk',
      'Bias cut for natural, fluid body drape',
      'Adjustable double-strap back ties',
      'French seam finishes throughout',
      'Dry clean only'
    ],
    rating: 4.92
  }
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'ELEGANCE', discountType: 'percentage', value: 15 }, // 15% off
  { code: 'LUXURY20', discountType: 'percentage', value: 20 }, // 20% off
  { code: 'WELCOME50', discountType: 'fixedPost', value: 50 },  // $50 off
];
