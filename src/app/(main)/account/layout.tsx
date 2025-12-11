import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  RotateCcw,
  MapPin,
  User,
  Lock,
  LogOut
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Return Orders", href: "/account/return-orders", icon: RotateCcw },
  { label: "Track Orders", href: "/account/track-orders", icon: MapPin },
  { label: "Account Details", href: "/account/details", icon: User },
  { label: "Change Password", href: "/account/change-password", icon: Lock },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
            <nav className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8 min-h-[500px]">
          {children}
        </section>
      </div>
    </div>
  );
}
