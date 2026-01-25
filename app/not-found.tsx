import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-ice flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <Home className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-primary-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-text-body mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="btn-saffron inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
