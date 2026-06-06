/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Globe, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function Footer() {
  const links = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Shipping & Returns', href: '#shipping' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <footer className="w-full py-12 bg-surface-container-lowest dark:bg-surface-container-high border-t border-outline-variant dark:border-outline mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-16 flex flex-col items-center text-center gap-6">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-sans font-black text-2xl tracking-tighter text-on-surface">
            ShopEase Luxury
          </h2>
          <p className="max-w-md text-xs text-on-surface-variant leading-relaxed">
            Curated garments and bespoke accessories designed with architectural precision for the modern lifestyle.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 my-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Badges */}
        <div className="flex items-center justify-center gap-8 py-2 border-t border-b border-outline-variant/30 w-full max-w-lg text-[11px] text-outline uppercase tracking-wider font-semibold">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Guaranteed Authenticity</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>Worldwide Express</span>
          </div>
        </div>

        {/* Footnotes */}
        <div className="flex flex-col gap-1.5 opacity-60">
          <p className="font-sans text-[11px] text-on-surface font-medium">
            © {new Date().getFullYear()} ShopEase Luxury Inc. All rights reserved.
          </p>
          <p className="text-[10px] text-outline font-mono">
            Designed for editorial commerce with high-precision micro-interactions.
          </p>
        </div>
      </div>
    </footer>
  );
}
