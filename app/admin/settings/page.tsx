import { User, Globe, Bell, Database, ChevronRight } from 'lucide-react';

export const runtime = 'edge';

export const metadata = {
  title: 'Settings | Admin',
};

const settingsItems = [
  {
    icon: User,
    title: 'Account',
    description: 'Manage your admin account settings',
  },
  {
    icon: Globe,
    title: 'Store Info',
    description: 'Update store name, address, and hours',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure low stock alerts',
  },
  {
    icon: Database,
    title: 'Data & Export',
    description: 'Database backup and import/export',
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-neutral-500 mt-1">
          Manage your store settings
        </p>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 divide-y divide-neutral-100">
        {settingsItems.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 p-5 hover:bg-neutral-50/50 transition-colors cursor-not-allowed opacity-60"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900">{item.title}</p>
              <p className="text-sm text-neutral-500">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md">Coming soon</span>
              <ChevronRight className="w-4 h-4 text-neutral-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Version Info */}
      <div className="text-center py-4">
        <p className="text-neutral-400 text-sm">
          Beban Way Market Admin v0.1.0
        </p>
      </div>
    </div>
  );
}
