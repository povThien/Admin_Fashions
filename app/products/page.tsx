// app/products/page.tsx
"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Filter, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BoCucAdmin from '@/components/layout/bo-cuc-admin';

interface Variant {
  sku: string;
  kich_thuoc: string;
  mau_sac: string;
  gia: number;
  gia_km?: number | null;
  phan_tram_km?: number | null;
  so_luong: number;
  so_luong_da_ban: number;
  hinh_chinh: string;
  hinh_thumbnail: string[];
}

interface Product {
  _id: string;
  ten_sp: string;
  slug?: string | null;
  id_loai: number;
  id_thuong_hieu: number;
  ten_loai?: string;
  ten_thuong_hieu?: string;
  mo_ta: string;
  chat_lieu: string;
  xuat_xu: string;
  variants: Variant[];
  hot: boolean;
  an_hien: boolean;
  luot_xem: number;
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories?: number[];
  brands?: number[];
}

interface Category {
  id: number;
  ten_loai: string;
}

interface Brand {
  id: number;
  ten_thuong_hieu: string;
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
}

interface BrandResponse {
  success: boolean;
  data: Brand[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<string>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('all');

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const router = useRouter();

  const fetchProducts = useCallback(async (
    page: number = 1,
    search: string = '',
    brand: string = 'all',
    category: string = 'all',
    visibility: string = 'all',
    stock: string = 'all',
    priceRange: string = 'all'
  ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc',
        ...(search && { search }),
        ...(brand !== 'all' && { brand }),
        ...(category !== 'all' && { category }),
        ...(visibility !== 'all' && { visibility }),
        ...(stock !== 'all' && { stock }),
        ...(priceRange !== 'all' && { priceRange })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ApiResponse = await response.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/categories/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: CategoryResponse = await response.json();
        setCategories(data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/brands/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        const data: BrandResponse = await response.json();
        setBrands(data.data);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, filterBrand, filterCategory, filterVisibility, filterStock, filterPriceRange);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, searchTerm, filterBrand, filterCategory, filterVisibility, filterStock, filterPriceRange);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterBrand, filterCategory, filterVisibility, filterStock, filterPriceRange, fetchProducts]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all duration-200 ${currentPage === i
            ? 'bg-[#edb54e] text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-600 hover:bg-[#edb54e] hover:text-white border border-gray-200 hover:border-[#edb54e]'
            }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Đang hoạt động' : 'Không hoạt động';
  };

  const getTotalStock = (variants: Variant[]) => {
    return variants.reduce((total, variant) => total + variant.so_luong, 0);
  };

  const getMinPrice = (variants: Variant[]) => {
    if (variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.gia_km || v.gia));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStockWarning = (stock: number) => {
    if (stock === 0) return 'text-red-600 font-semibold';
    if (stock < 10) return 'text-amber-600 font-semibold';
    return 'text-gray-700';
  };

  const handleClickAddProduct = () => {
    router.push('/products/add-product/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/${id}/toggle-visibility`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Cập nhật trạng thái thất bại');
      fetchProducts(currentPage, searchTerm, filterBrand, filterCategory, filterVisibility, filterStock, filterPriceRange);
    } catch (err) {
      alert('Không thể cập nhật trạng thái ẩn/hiện.');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/product/phucdev/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Xóa sản phẩm thất bại');
      fetchProducts(currentPage, searchTerm, filterBrand, filterCategory, filterVisibility, filterStock, filterPriceRange);
    } catch (err) {
      alert('Không thể xóa sản phẩm.');
      console.error(err);
    }
  };

  if (loading && products.length === 0) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#edb54e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải sản phẩm...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Đã xảy ra lỗi</h3>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  return (
    <BoCucAdmin title="Quản lý sản phẩm">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100">
          {/* Filter Row */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-[#edb54e] mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.ten_loai}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              >
                <option value="all">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.ten_thuong_hieu}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="visible">Đang hoạt động</option>
                <option value="hidden">Không hoạt động</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">Tất cả tồn kho</option>
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="low_stock">Sắp hết hàng (&lt; 10)</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={filterPriceRange}
                onChange={(e) => setFilterPriceRange(e.target.value)}
              >
                <option value="all">Tất cả khoảng giá</option>
                <option value="0-100000">0 - 100,000 VND</option>
                <option value="100000-500000">100,000 - 500,000 VND</option>
                <option value="500000-1000000">500,000 - 1,000,000 VND</option>
                <option value="1000000-max">Trên 1,000,000 VND</option>
              </select>
            </div>
          </div>

          {/* Search and Add Button Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả sản phẩm..."
                className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl w-full text-gray-700 bg-white hover:border-[#edb54e] transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleClickAddProduct}
              className="flex items-center space-x-2 px-6 py-3 bg-[#edb54e] text-white rounded-xl hover:bg-[#d4a043] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm sản phẩm</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              <span className="font-medium text-[#edb54e]">{totalProducts}</span> sản phẩm được tìm thấy
            </div>
            <div className="text-xs text-gray-500">
              Sắp xếp mới nhất trước
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {['SẢN PHẨM', 'THÔNG TIN', 'GIÁ', 'TỒN KHO', 'TRẠNG THÁI', 'NGÀY TẠO', 'THAO TÁC'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => {
                const totalStock = getTotalStock(product.variants);
                const minPrice = getMinPrice(product.variants);
                const mainImage = product.variants[0]?.hinh_chinh || '';

                return (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={product.ten_sp}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs font-medium">IMG</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1">{product.ten_sp}</div>
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">
                            ID: {product._id.slice(-6)} • {product.variants.length} biến thể
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-900">
                          <span className="font-medium">Loại:</span> {product.ten_loai || `ID: ${product.id_loai}`}
                        </div>
                        <div className="text-gray-900">
                          <span className="font-medium">Thương hiệu:</span> {product.ten_thuong_hieu || `ID: ${product.id_thuong_hieu}`}
                        </div>
                        <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md inline-block">
                          {product.luot_xem} lượt xem
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#edb54e]">
                        {formatPrice(minPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${getStockWarning(totalStock)}`}>
                          {totalStock}
                        </span>
                        {totalStock === 0 && <span className="text-red-500">🚫</span>}
                        {totalStock > 0 && totalStock < 10 && <span className="text-amber-500">⚠️</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.an_hien)}`}>
                          {getStatusText(product.an_hien)}
                        </span>
                        {product.hot && (
                          <span className="block inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                            HOT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 font-medium">
                        {formatDate(product.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(product._id)}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                          title={product.an_hien ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                        >
                          {product.an_hien ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        <button onClick={() => router.push(`/products/edit-product/${product.slug}`)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                          <Edit className="w-4 h-4" />
                        </button>

                        <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              Hiển thị <span className="font-semibold text-[#edb54e]">{(currentPage - 1) * limit + 1}</span> đến{' '}
              <span className="font-semibold text-[#edb54e]">{Math.min(currentPage * limit, totalProducts)}</span> trong{' '}
              <span className="font-semibold text-[#edb54e]">{totalProducts}</span> kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-3 text-gray-400 hover:text-[#edb54e] hover:bg-[#edb54e] hover:bg-opacity-10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-1">
                {renderPaginationButtons()}
              </div>

              <button
                className="p-3 text-gray-400 hover:text-[#edb54e] hover:bg-[#edb54e] hover:bg-opacity-10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </BoCucAdmin>
  );
}