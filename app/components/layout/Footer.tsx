import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-emerald-400">
                Beban Way
              </span>
              <span className="block text-xs uppercase tracking-widest text-neutral-400">
                Market
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Quality products for everyday life. Serving Nineveh with care.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              Shop
            </h3>
            <nav className="space-y-3">
              <Link
                href="/products"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/products/grains"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Rice & Grains
              </Link>
              <Link
                href="/products/dairy"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Dairy Products
              </Link>
              <Link
                href="/products/beverages"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Beverages
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              Categories
            </h3>
            <nav className="space-y-3">
              <Link
                href="/products/produce"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Produce
              </Link>
              <Link
                href="/products/snacks"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Snacks
              </Link>
              <Link
                href="/products/frozen"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Frozen
              </Link>
              <Link
                href="/products/household"
                className="block text-sm text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                Household
              </Link>
            </nav>
          </div>

          {/* Visit */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              Visit Us
            </h3>
            <div className="space-y-3 text-sm text-neutral-300">
              <p>Biban, Nineveh Governorate</p>
              <p>Iraq</p>
              <div className="pt-2">
                <p className="text-emerald-400 font-medium">Open Daily</p>
                <p className="text-neutral-400">9:00 AM – 12:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Beban Way Market. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Proudly serving Nineveh
          </p>
        </div>
      </div>
    </footer>
  );
}
