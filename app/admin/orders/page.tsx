import Link from 'next/link';
import { getOrders, getOrderStats } from '@/lib/actions/orders';
import { formatPriceSimple } from '@/lib/utils/formatPrice';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { QrCode, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const runtime = 'edge';

export const metadata = {
  title: 'Orders | Admin',
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="danger" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function AdminOrdersPage() {
  const simplified = isSimplifiedMode();
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage customer orders and process payments
          </p>
        </div>
        <Button
          href="/admin/orders/scan"
          className="flex items-center gap-2"
          disabled={simplified}
        >
          <QrCode className="w-4 h-4" />
          Scan QR Code
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Pending
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {stats.completed}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Cancelled
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-400">
            {stats.cancelled}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Today&apos;s Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {formatPriceSimple(stats.todayRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="font-medium text-neutral-900">Recent Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="w-10 h-10 mx-auto text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.referenceCode}`}
                className="block px-5 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-neutral-900">
                          {order.referenceCode}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {order.customer.name} &middot; {order.customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">
                      {formatPriceSimple(order.totalPrice)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(order.items as Array<{ name: string; quantity: number }>).map(
                    (item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-neutral-100 text-xs text-neutral-600"
                      >
                        {item.name} x{item.quantity}
                      </span>
                    )
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
