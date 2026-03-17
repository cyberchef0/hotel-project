"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Stats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  occupancyRate: number;
  monthlyBookings: { createdAt: string; _sum: { totalPrice: number | null }; _count: number }[];
}

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#ec4899"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  // Sample chart data
  const revenueData = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 18200 },
    { month: "Mar", revenue: 22100 },
    { month: "Apr", revenue: 19800 },
    { month: "May", revenue: 26400 },
    { month: "Jun", revenue: 31200 },
  ];

  const bookingData = [
    { month: "Jan", bookings: 24 },
    { month: "Feb", bookings: 35 },
    { month: "Mar", bookings: 42 },
    { month: "Apr", bookings: 38 },
    { month: "May", bookings: 51 },
    { month: "Jun", bookings: 58 },
  ];

  const roomPopularity = [
    { name: "Suites", value: 35 },
    { name: "King", value: 25 },
    { name: "Family", value: 20 },
    { name: "Executive", value: 12 },
    { name: "Standard", value: 8 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Performance overview and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Popularity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Popularity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roomPopularity} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                {roomPopularity.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Summary</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-2xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(stats.occupancyRate, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="text-xl font-bold text-amber-600">{stats.occupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Bookings</span>
              <span className="text-xl font-bold text-gray-900">{stats.totalBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Guests</span>
              <span className="text-xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
