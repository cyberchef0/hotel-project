import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineArrowLeft,
  HiOutlineMail,
} from "react-icons/hi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
    { href: "/admin/rooms", label: "Rooms", icon: HiOutlineViewGrid },
    { href: "/admin/bookings", label: "Bookings", icon: HiOutlineCalendar },
    { href: "/admin/customers", label: "Customers", icon: HiOutlineUsers },
    { href: "/admin/gallery", label: "Gallery", icon: HiOutlinePhotograph },
    { href: "/admin/reviews", label: "Reviews", icon: HiOutlineStar },
    { href: "/admin/messages", label: "Messages", icon: HiOutlineMail },
    { href: "/admin/analytics", label: "Analytics", icon: HiOutlineChartBar },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 fixed h-full overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <span className="text-xl font-serif font-bold">Admin</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 mt-auto border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
