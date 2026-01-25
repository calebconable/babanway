'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShoppingCart,
} from 'lucide-react';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const simplified = useSimplified();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/60 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-neutral-900 tracking-tight">Beban</span>
          <div className="w-9" />
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200/60 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-100">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center">
                <span className="text-white font-semibold text-xs">B</span>
              </div>
              <span className="font-semibold text-neutral-900 tracking-tight">Beban</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-neutral-700' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-neutral-100 space-y-0.5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-150"
            >
              <ExternalLink className="w-[18px] h-[18px]" />
              <span className="text-sm font-medium">View Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 lg:px-10 lg:py-12">
          {simplified && (
            <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Simplified mode is enabled. Admin data is read-only and ordering is disabled.
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
