"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacSanPham from "@/components/san-pham/thao-tac-san-pham"
import BangSanPham from "@/components/san-pham/bang-san-pham"
import LocNangCao from "@/components/san-pham/loc-nang-cao"
import { fetcher, formatCurrency } from "@/lib/api" // Import fetcher và formatCurrency
import { toast } from "react-hot-toast" // Có thể cần cài đặt: npm install react-hot-toast

// Định nghĩa interface Product chính xác hơn theo backend
interface Product {
  _id: string; // ObjectId của MongoDB
  id: number; // ID tự tăng
  ten_sp: string;
  slug: string;
  id_loai: { id: number; ten_loai: string }; // Populated category
  id_thuong_hieu: { id: number; ten_thuong_hieu: string } | null; // Populated brand
  mo_ta: string;
  chat_lieu: string;
  xuat_xu: string;
  variants: Variant[];
  hinh_anh?: string[]; // Mảng URL hình ảnh chung cho sản phẩm
  hot: boolean;
  an_hien: boolean;
  luot_xem: number;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

interface Variant {
  _id: string;
  sku: string;
  kich_thuoc: string;
  mau_sac: string;
  gia: number;
  gia_km: number | null;
  phan_tram_km: number;
  so_luong: number;
  so_luong_da_ban: number;
  hinh_chinh: string;
  hinh_thumbnail: string[];
}

// Interface cho bộ lọc nâng cao
interface AdvancedFilter {
  category: string; // id_loai
  brand: string; // id_thuong_hieu
  priceRange: {
    min: number;
    max: number;
  };
  stockStatus: string; // "in-stock", "out-of-stock", "low-stock"
  status: string; // an_hien: "active", "inactive"
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


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Lấy từ API, hoặc giữ nguyên
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>({
    category: "",
    brand: "",
    priceRange: {
      min: 0,
      max: 2000000000, // Max price, adjust as needed
    },
    stockStatus: "",
    status: "",
  });

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);//

  // Fetch categories and brands for filter dropdowns
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const categoriesData = await fetcher<Category[]>('/categories/all'); // API lấy tất cả danh mục
        setCategoriesList(categoriesData.data); // Adjust based on your API response structure

        const brandsData = await fetcher<Brand[]>('/brands/all'); // Assuming you have a /brands/all endpoint
        setBrandsList(brandsData.data); // Adjust based on your API response structure
      } catch (err: any) {
        toast.error("Không thể tải danh mục hoặc thương hiệu: " + (err.info?.message || err.message));
        console.error("Error fetching filter options:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch products based on filters and pagination
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/products?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (advancedFilter.category) {
        // Cần chuyển category name thành id để gửi lên backend
        const selectedCategory = categoriesList.find(cat => cat.ten_loai === advancedFilter.category);
        if (selectedCategory) {
          url += `&id_loai=${selectedCategory.id}`;
        }
      }
      if (advancedFilter.brand) {
        // Cần chuyển brand name thành id để gửi lên backend
        const selectedBrand = brandsList.find(brand => brand.ten_thuong_hieu === advancedFilter.brand);
        if (selectedBrand) {
          url += `&id_thuong_hieu=${selectedBrand.id}`;
        }
      }
      if (advancedFilter.status) {
        url += `&an_hien=${advancedFilter.status === 'active' ? 'true' : 'false'}`;
      }
      if (advancedFilter.stockStatus) {
        // Backend không có lọc trực tiếp 'in-stock', 'out-of-stock', 'low-stock'.
        // Bạn sẽ cần điều chỉnh backend để hỗ trợ hoặc lọc ở frontend.
        // Tạm thời bỏ qua lọc này hoặc giả định backend sẽ hiểu.
        // Hoặc bạn có thể tự lọc lại dữ liệu ở frontend sau khi fetch.
      }
      // Khoảng giá cũng cần được xử lý ở backend nếu muốn hiệu quả
      // url += `&min_price=${advancedFilter.priceRange.min}&max_price=${advancedFilter.priceRange.max}`;
      // Nếu backend chưa hỗ trợ lọc theo giá, bạn sẽ cần lọc lại ở frontend.

      const data = await fetcher<{ data: Product[]; pagination: any }>(url);

      let fetchedProducts = data.data;

      // Filter by price range and stock status in frontend if backend doesn't support
      fetchedProducts = fetchedProducts.filter(product => {
        // Calculate total stock and min/max price from variants
        const totalStock = product.variants.reduce((sum, variant) => sum + variant.so_luong, 0);
        const minPrice = product.variants.length > 0
          ? Math.min(...product.variants.map(v => v.gia_km !== null && v.gia_km > 0 ? v.gia_km : v.gia))
          : 0;

        const matchesPrice = minPrice >= advancedFilter.priceRange.min && minPrice <= advancedFilter.priceRange.max;

        let matchesStockStatus = true;
        if (advancedFilter.stockStatus === "in-stock") {
          matchesStockStatus = totalStock > 0;
        } else if (advancedFilter.stockStatus === "out-of-stock") {
          matchesStockStatus = totalStock === 0;
        } else if (advancedFilter.stockStatus === "low-stock") {
          matchesStockStatus = totalStock > 0 && totalStock <= 10;
        }

        return matchesPrice && matchesStockStatus;
      });


      setProducts(fetchedProducts);
      setTotalItems(data.pagination.totalItems);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.info?.message || err.message || 'Lỗi khi tải sản phẩm.');
      toast.error("Lỗi khi tải sản phẩm: " + (err.info?.message || err.message));
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, advancedFilter, categoriesList, brandsList]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdvancedFilterChange = (newFilter: Partial<AdvancedFilter>) => {
    setAdvancedFilter((prev) => ({
      ...prev,
      ...newFilter,
    }));
    setCurrentPage(1); // Reset về trang đầu khi lọc
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setAdvancedFilter({
      category: "",
      brand: "",
      priceRange: {
        min: 0,
        max: 2000000000,
      },
      stockStatus: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Tính toán dữ liệu cho phân trang (đã được backend xử lý phần lớn)
  // useMemo này giờ chỉ còn tác dụng nếu có lọc frontend bổ sung
  const paginationData = useMemo(() => {
    // Nếu có lọc frontend cho stockStatus hoặc priceRange, thì filteredProducts sẽ khác products
    // Nếu không, chỉ cần dùng trực tiếp products từ state
    return {
      currentItems: products, // products đã là dữ liệu của trang hiện tại từ backend
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
    };
  }, [products, totalItems, totalPages, currentPage, itemsPerPage]);


  if (loading && products.length === 0) {
    return (
      <BoCucAdmin title="Quản lý sản phẩm">
        <div className="text-center py-12">Đang tải sản phẩm...</div>
      </BoCucAdmin>
    );
  }

  if (error) {
    return (
      <BoCucAdmin title="Quản lý sản phẩm">
        <div className="text-center py-12 text-red-500">Lỗi: {error}</div>
      </BoCucAdmin>
    );
  }

  return (
    <BoCucAdmin title="Quản lý sản phẩm">
      <ThaoTacSanPham
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onToggleAdvancedFilter={() => setShowAdvancedFilter(!showAdvancedFilter)}
        showAdvancedFilter={showAdvancedFilter}
        onResetFilters={handleResetFilters}
        totalResults={totalItems}
      />

      {showAdvancedFilter && (
        <LocNangCao
          filter={advancedFilter}
          onFilterChange={handleAdvancedFilterChange}
          categories={categoriesList} // Pass fetched categories
          brands={brandsList}     // Pass fetched brands
        />
      )}
      
      <BangSanPham
        products={paginationData.currentItems}
        currentPage={paginationData.currentPage}
        totalPages={paginationData.totalPages}
        totalItems={paginationData.totalItems}
        itemsPerPage={paginationData.itemsPerPage}
        onPageChange={handlePageChange}
        onDeleteSuccess={fetchProducts} // Thêm prop này để refetch dữ liệu sau khi xóa
      />
    </BoCucAdmin>
  );
}