"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/api" // Import formatCurrency

// Interface cho bộ lọc nâng cao
interface AdvancedFilter {
  category: string;
  brand: string;
  priceRange: {
    min: number;
    max: number;
  };
  stockStatus: string;
  status: string;
}

// Interface cho Category/Brand data from API
interface Category {
  id: number;
  ten_loai: string;
}

interface Brand {
  id: number;
  ten_thuong_hieu: string;
}

interface LocNangCaoProps {
  filter: AdvancedFilter;
  onFilterChange: (newFilter: Partial<AdvancedFilter>) => void;
  categories: Category[]; // Nhận danh sách danh mục từ props
  brands: Brand[];     // Nhận danh sách thương hiệu từ props
}

export default function LocNangCao({ filter, onFilterChange, categories, brands }: LocNangCaoProps) {
  // Hàm xử lý thay đổi khoảng giá
  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    const numValue = Number.parseInt(value) || 0;
    onFilterChange({
      priceRange: {
        ...filter.priceRange,
        [type]: numValue,
      },
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <i className="fas fa-sliders-h text-blue-600"></i>
            Bộ lọc nâng cao
          </h3>
          <button
            onClick={() =>
              onFilterChange({
                category: "",
                brand: "",
                priceRange: { min: 0, max: 2000000000 }, // Reset max price to a large number
                stockStatus: "",
                status: "",
              })
            }
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <i className="fas fa-undo text-xs"></i>
            Đặt lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Lọc theo danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-tags mr-1"></i>
              Danh mục
            </label>
            <select
              value={filter.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.ten_loai}>
                  {category.ten_loai}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo thương hiệu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-copyright mr-1"></i>
              Thương hiệu
            </label>
            <select
              value={filter.brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.ten_thuong_hieu}>
                  {brand.ten_thuong_hieu}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo trạng thái tồn kho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-boxes mr-1"></i>
              Tồn kho
            </label>
            <select
              value={filter.stockStatus}
              onChange={(e) => onFilterChange({ stockStatus: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="in-stock">Còn hàng</option>
              <option value="low-stock">Sắp hết (≤10)</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>

          {/* Lọc theo trạng thái sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-toggle-on mr-1"></i>
              Trạng thái
            </label>
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>

          {/* Khoảng giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-dollar-sign mr-1"></i>
              Khoảng giá
            </label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Giá từ"
                value={filter.priceRange.min || ""}
                onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Giá đến"
                value={filter.priceRange.max || ""}
                onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500">
                {formatCurrency(filter.priceRange.min)} - {formatCurrency(filter.priceRange.max)}
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị tóm tắt bộ lọc đang áp dụng */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filter.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                Danh mục: {filter.category}
                <button onClick={() => onFilterChange({ category: "" })} className="hover:text-blue-600">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            )}
            {filter.brand && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Thương hiệu: {filter.brand}
                <button onClick={() => onFilterChange({ brand: "" })} className="hover:text-green-600">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            )}
            {filter.stockStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                Tồn kho:{" "}
                {filter.stockStatus === "in-stock"
                  ? "Còn hàng"
                  : filter.stockStatus === "low-stock"
                    ? "Sắp hết"
                    : "Hết hàng"}
                <button onClick={() => onFilterChange({ stockStatus: "" })} className="hover:text-yellow-600">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            )}
            {filter.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                Trạng thái: {filter.status === "active" ? "Đang bán" : "Ngừng bán"}
                <button onClick={() => onFilterChange({ status: "" })} className="hover:text-purple-600">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            )}
            {(filter.priceRange.min > 0 || filter.priceRange.max < 2000000000) && ( // Check if range is actually filtered
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                Giá: {formatCurrency(filter.priceRange.min)} - {formatCurrency(filter.priceRange.max)}
                <button onClick={() => onFilterChange({ priceRange: { min: 0, max: 2000000000 } })} className="hover:text-orange-600">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}