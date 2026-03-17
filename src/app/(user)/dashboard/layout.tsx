import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HiOutlineHome, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: HiOutlineHome },
    { href: "/dashboard/bookings", label: "My Bookings", icon: HiOutlineCalendar },
    { href: "/dashboard/profile", label: "Profile", icon: HiOutlineUser },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Welcome, {session?.user?.name || "Guest"}
            </h1>
            <p className="text-gray-500 mt-1">Manage your bookings and profile</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-56 flex-shrink-0">
              <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors font-medium text-sm"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
