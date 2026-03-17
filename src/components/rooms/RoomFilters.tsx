"use client";

interface RoomFiltersProps {
  filters: {
    type: string;
    minPrice: string;
    maxPrice: string;
    capacity: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const roomTypes = ["All", "Suite", "King", "Family", "Executive", "Standard", "Penthouse", "Double"];

export default function RoomFilters({ filters, onFilterChange }: RoomFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h3 className="text-lg font-serif font-bold text-gray-900">Filters</h3>

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-3">Room Type</label>
        <div className="flex flex-wrap gap-2">
          {roomTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange("type", type === "All" ? "" : type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                (type === "All" && !filters.type) || filters.type === type
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-3">
          Price Range (per night)
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Guest Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-3">
          Minimum Guests
        </label>
        <select
          value={filters.capacity}
          onChange={(e) => onFilterChange("capacity", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+ Guests
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onFilterChange("type", "");
          onFilterChange("minPrice", "");
          onFilterChange("maxPrice", "");
          onFilterChange("capacity", "");
        }}
        className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
