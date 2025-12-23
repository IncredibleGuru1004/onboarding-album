"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white  border-t border-zinc-200  mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IG</span>
              </div>
              <span className="font-semibold text-zinc-900 ">
                Image Gallery
              </span>
            </Link>
            <p className="text-sm text-zinc-600 ">
              Your visual story, beautifully organized.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-zinc-900  mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-600 ">
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Connect
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="mailto:support@imagegallery.com"
                  className="hover:text-zinc-900  transition-colors"
                >
                  support@imagegallery.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="hover:text-zinc-900  transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="hover:text-zinc-900  transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {currentYear} Image Gallery. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <Link
                href="/accessibility"
                className="hover:text-zinc-900  transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-zinc-900  transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
