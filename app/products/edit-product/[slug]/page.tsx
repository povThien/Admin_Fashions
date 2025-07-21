"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BoCucAdmin from "@/components/layout/bo-cuc-admin";
import { use } from "react";

// Interface cho dữ liệu sản phẩm mới
interface ProductData {
  ten_sp: string;
  id_loai: number;
  id_thuong_hieu: number;
  mo_ta: string;
  chat_lieu: string;
  xuat_xu: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  an_hien: boolean; // Add an_hien
  hot: boolean; // Add hot
}

// Interface cho dữ liệu variant
interface VariantData {
  id?: number; // Optional for new variants
  sku: string;
  kich_thuoc: string;
  mau_sac: string;
  gia: number;
  gia_km: number | null; // Đã đổi tên từ gia_giam thành gia_km
  so_luong: number;
  hinh_chinh: string;
  hinh_thumbnail: string[];
  // Temporary file objects for new uploads
  mainImageFile?: File | null;
  thumbnailFiles?: File[];
}

// Interface để lưu trữ File tạm thời trước khi upload
interface ImageFiles {
  mainImageFile: File | null;
  thumbnailFiles: File[];
}

// Interface cho Loại sản phẩm và Thương hiệu
interface Category {
  id: number;
  ten_loai: string;
}

interface Brand {
  id: number;
  ten_thuong_hieu: string;
}

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  // States for product data, initialised with default values to avoid null checks everywhere
  const [productData, setProductData] = useState<ProductData>({
    ten_sp: '',
    id_loai: 0,
    id_thuong_hieu: 0,
    mo_ta: '',
    chat_lieu: '',
    xuat_xu: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    an_hien: true, // Default to true
    hot: false, // Default to false
  });

  // State for variants. edit.tsx will manage multiple variants.
  const [variants, setVariants] = useState<VariantData[]>([]);

  // States for categories and brands
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Loading, error, success messages
  const [loading, setLoading] = useState<boolean>(true); // Initial loading for fetching product
  const [saving, setSaving] = useState<boolean>(false); // For form submission
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch product data, categories, and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch product details
        const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/slug/${slug}`);
        if (!productRes.ok) {
          throw new Error('Failed to fetch product data');
        }
        const productDetails = await productRes.json();
        const sp = productDetails.data;

        // Set product data
        setProductData({
          ten_sp: sp.ten_sp,
          id_loai: sp.id_loai,
          id_thuong_hieu: sp.id_thuong_hieu,
          mo_ta: sp.mo_ta,
          chat_lieu: sp.chat_lieu,
          xuat_xu: sp.xuat_xu,
          meta_title: sp.meta_title,
          meta_description: sp.meta_description,
          meta_keywords: sp.meta_keywords,
          an_hien: sp.an_hien,
          hot: sp.hot,
        });

        // Initialize variants with existing data and clear file states
        const initialVariants = sp.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          kich_thuoc: v.kich_thuoc,
          mau_sac: v.mau_sac,
          gia: v.gia,
          gia_km: v.gia_km || null, // Khởi tạo gia_km từ dữ liệu đã fetch, mặc định là null
          so_luong: v.so_luong,
          hinh_chinh: v.hinh_chinh,
          hinh_thumbnail: v.hinh_thumbnail || [],
          mainImageFile: null, // No file selected initially
          thumbnailFiles: [], // No files selected initially
        }));
        setVariants(initialVariants);

        // Fetch categories and brands
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/categories/all`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/brands/all`)
        ]);

        if (!categoriesRes.ok) {
          const errorText = await categoriesRes.text();
          console.log('Categories Error Response:', errorText);
          throw new Error('Failed to fetch categories');
        }
        if (!brandsRes.ok) {
          const errorText = await brandsRes.text();
          console.log('Brands Error Response:', errorText);
          throw new Error('Failed to fetch brands');
        }

        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();

        setCategories(categoriesData.data || []);
        setBrands(brandsData.data || []);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu sản phẩm, danh mục hoặc thương hiệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : ((name === 'id_loai' || name === 'id_thuong_hieu') ? parseInt(value) : value),
    }));
  };

  const handleVariantChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: string | number | null = value;

    if (name === 'gia' || name === 'gia_km' || name === 'so_luong') { // Đã đổi tên gia_giam thành gia_km
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        newValue = name === 'gia_km' ? null : ''; // Set gia_km to null if invalid, others to empty string
      } else {
        newValue = numValue;
      }
    }

    setVariants(prevVariants =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, [name]: newValue } : variant
      )
    );
  }, []);

  const handleMainImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVariants(prevVariants =>
        prevVariants.map((variant, i) =>
          i === index ? { ...variant, mainImageFile: file } : variant
        )
      );
    } else {
      setVariants(prevVariants =>
        prevVariants.map((variant, i) =>
          i === index ? { ...variant, mainImageFile: null } : variant
        )
      );
    }
  };

  const handleThumbnailImagesChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVariants(prevVariants =>
        prevVariants.map((variant, i) =>
          i === index ? { ...variant, thumbnailFiles: files } : variant
        )
      );
    } else {
      setVariants(prevVariants =>
        prevVariants.map((variant, i) =>
          i === index ? { ...variant, thumbnailFiles: [] } : variant
        )
      );
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: "",
        kich_thuoc: "",
        mau_sac: "",
        gia: 0,
        gia_km: null, // Mặc định gia_km của biến thể mới là null
        so_luong: 0,
        hinh_chinh: "",
        hinh_thumbnail: [],
        mainImageFile: null,
        thumbnailFiles: [],
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("Sản phẩm phải có ít nhất một biến thể.");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };


  const formatCurrency = (value: number | null) => {
    if (value === null || isNaN(value)) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const uploadImageToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
    formData.append('folder', folder);

    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      throw new Error(`Failed to upload image to Cloudinary: ${errorText}`);
    }
    const cloudinaryData = await cloudinaryResponse.json();
    return cloudinaryData.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Process each variant for image uploads
      const variantsToSubmit = await Promise.all(
        variants.map(async (v) => {
          let currentMainImageUrl = v.hinh_chinh;
          let currentThumbnailUrls = [...v.hinh_thumbnail];

          // Upload new main image if selected
          if (v.mainImageFile) {
            currentMainImageUrl = await uploadImageToCloudinary(v.mainImageFile, 'product_main_images');
          } else if (!v.hinh_chinh) {
            // If no new main image selected and no existing main image
            throw new Error('Vui lòng chọn ảnh chính cho tất cả biến thể.');
          }

          // Upload new thumbnail images and replace existing ones
          if (v.thumbnailFiles && v.thumbnailFiles.length > 0) {
            const newThumbnailUrls = await Promise.all(
              v.thumbnailFiles.map((file) => uploadImageToCloudinary(file, 'product_thumbnails'))
            );
            currentThumbnailUrls = newThumbnailUrls; // Replace all thumbnails
          }

          return {
            id: v.id, // Include ID for existing variants
            sku: v.sku,
            kich_thuoc: v.kich_thuoc,
            mau_sac: v.mau_sac,
            gia: v.gia,
            gia_km: v.gia_km, // Đã đổi tên từ gia_giam thành gia_km
            so_luong: v.so_luong,
            hinh_chinh: currentMainImageUrl,
            hinh_thumbnail: currentThumbnailUrls,
          };
        })
      );

      const productToSend = {
        ...productData,
        variants: variantsToSubmit,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/phucdev/slug/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi cập nhật sản phẩm');
      }

      setSuccess('Sản phẩm đã được cập nhật thành công!');
      router.push('/products');
    } catch (err: any) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <BoCucAdmin title="Đang tải sản phẩm...">
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải dữ liệu sản phẩm, danh mục và thương hiệu...</p>
      </div>
    </BoCucAdmin>
  );

  return (
    <BoCucAdmin title={`Chỉnh sửa: ${productData.ten_sp}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chỉnh Sửa Sản Phẩm</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#edb54e] to-[#f4c866] mx-auto rounded-full"></div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Thông tin sản phẩm cơ bản */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#edb54e] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Thông Tin Sản Phẩm</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tên sản phẩm */}
                <div className="lg:col-span-2">
                  <label htmlFor="ten_sp" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ten_sp"
                    name="ten_sp"
                    value={productData.ten_sp}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên sản phẩm..."
                    required
                  />
                </div>

                {/* Loại sản phẩm */}
                <div>
                  <label htmlFor="id_loai" className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="id_loai"
                    name="id_loai"
                    value={productData.id_loai}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value={0} disabled>Chọn loại sản phẩm</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.ten_loai}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">Không có loại sản phẩm nào. Vui lòng thêm trong quản lý danh mục.</p>
                  )}
                </div>

                {/* Thương hiệu */}
                <div>
                  <label htmlFor="id_thuong_hieu" className="block text-sm font-semibold text-gray-700 mb-2">
                    Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="id_thuong_hieu"
                    name="id_thuong_hieu"
                    value={productData.id_thuong_hieu}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value={0} disabled>Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.ten_thuong_hieu}
                      </option>
                    ))}
                  </select>
                  {brands.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">Không có thương hiệu nào. Vui lòng thêm trong quản lý thương hiệu.</p>
                  )}
                </div>

                {/* Chất liệu */}
                <div>
                  <label htmlFor="chat_lieu" className="block text-sm font-semibold text-gray-700 mb-2">
                    Chất liệu
                  </label>
                  <input
                    type="text"
                    id="chat_lieu"
                    name="chat_lieu"
                    value={productData.chat_lieu}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: Cotton, Polyester..."
                  />
                </div>

                {/* Xuất xứ */}
                <div>
                  <label htmlFor="xuat_xu" className="block text-sm font-semibold text-gray-700 mb-2">
                    Xuất xứ
                  </label>
                  <input
                    type="text"
                    id="xuat_xu"
                    name="xuat_xu"
                    value={productData.xuat_xu}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: Việt Nam, Trung Quốc..."
                  />
                </div>

                {/* Mô tả */}
                <div className="lg:col-span-2">
                  <label htmlFor="mo_ta" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    id="mo_ta"
                    name="mo_ta"
                    value={productData.mo_ta}
                    onChange={handleProductChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  ></textarea>
                </div>

                {/* an_hien and hot checkboxes */}
                <div className="lg:col-span-2 flex items-center space-x-6 mt-4">
                  <label htmlFor="an_hien" className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="an_hien"
                      name="an_hien"
                      checked={productData.an_hien}
                      onChange={handleProductChange}
                      className="form-checkbox h-5 w-5 text-[#edb54e] rounded border-gray-300 focus:ring-[#edb54e]"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-700">Hiển thị sản phẩm</span>
                  </label>
                  <label htmlFor="hot" className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="hot"
                      name="hot"
                      checked={productData.hot}
                      onChange={handleProductChange}
                      className="form-checkbox h-5 w-5 text-[#edb54e] rounded border-gray-300 focus:ring-[#edb54e]"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-700">Sản phẩm HOT</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#edb54e] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Thông Tin SEO</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label htmlFor="meta_title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="meta_title"
                    name="meta_title"
                    value={productData.meta_title}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Tiêu đề tối ưu cho SEO..."
                  />
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    value={productData.meta_description}
                    onChange={handleProductChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Mô tả ngắn gọn cho SEO..."
                  ></textarea>
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="meta_keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="meta_keywords"
                    name="meta_keywords"
                    value={productData.meta_keywords}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                  />
                </div>
              </div>
            </div>

            {/* Variant Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#edb54e] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">3</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Biến Thể Sản Phẩm</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm biến thể
                </button>
              </div>

              {variants.map((variant, index) => (
                <div key={variant.id || `new-${index}`} className="border border-gray-300 rounded-xl p-6 mb-8 relative bg-gray-50">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Xóa biến thể này"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Biến thể {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* SKU */}
                    <div>
                      <label htmlFor={`sku-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        id={`sku-${index}`}
                        name="sku"
                        value={variant.sku}
                        readOnly
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="SKU của biến thể..."
                      />
                    </div>

                    {/* Kích thước */}
                    <div>
                      <label htmlFor={`kich_thuoc-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        Kích thước <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`kich_thuoc-${index}`}
                        name="kich_thuoc"
                        value={variant.kich_thuoc}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="S, M, L..."
                        required
                      />
                    </div>

                    {/* Màu sắc */}
                    <div>
                      <label htmlFor={`mau_sac-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        Màu sắc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`mau_sac-${index}`}
                        name="mau_sac"
                        value={variant.mau_sac}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Đỏ, Xanh..."
                        required
                      />
                    </div>

                    {/* Giá */}
                    <div>
                      <label htmlFor={`gia-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id={`gia-${index}`}
                        name="gia"
                        value={variant.gia === 0 ? '' : variant.gia}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="100000"
                        min="0"
                        step="any"
                        required
                      />
                      {variant.gia > 0 && (
                        <p className="text-sm text-[#edb54e] mt-2 font-medium">
                          {formatCurrency(variant.gia)}
                        </p>
                      )}
                    </div>

                    {/* Giá khuyến mãi (gia_km) */}
                    <div>
                      <label htmlFor={`gia_km-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        Giá khuyến mãi (VNĐ)
                      </label>
                      <input
                        type="number"
                        id={`gia_km-${index}`}
                        name="gia_km"
                        value={variant.gia_km === null ? '' : variant.gia_km}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="90000 (tùy chọn)"
                        min="0"
                        step="any"
                      />
                      {variant.gia_km !== null && variant.gia_km > 0 && (
                        <p className="text-sm text-[#edb54e] mt-2 font-medium">
                          {formatCurrency(variant.gia_km)}
                        </p>
                      )}
                      {variant.gia_km !== null && variant.gia_km >= variant.gia && (
                        <p className="text-sm text-red-500 mt-2">
                          Giá khuyến mãi không được lớn hơn hoặc bằng giá gốc.
                        </p>
                      )}
                    </div>

                    {/* Số lượng */}
                    <div>
                      <label htmlFor={`so_luong-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id={`so_luong-${index}`}
                        name="so_luong"
                        value={variant.so_luong === 0 ? '' : variant.so_luong}
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#edb54e] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="10"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Images Section for Variant */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ảnh chính */}
                    <div>
                      <label htmlFor={`mainImageFile-${index}`} className="block text-sm font-semibold text-gray-700 mb-3">
                        Ảnh chính <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id={`mainImageFile-${index}`}
                          name="mainImageFile"
                          accept="image/*"
                          onChange={(e) => handleMainImageChange(index, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`mainImageFile-${index}`}
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#edb54e] transition-colors duration-200 bg-white hover:bg-[#edb54e]/5"
                        >
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-gray-500 text-center px-4">
                            Click để chọn ảnh chính<br />
                            <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
                          </span>
                        </label>
                      </div>
                      {(variant.mainImageFile || variant.hinh_chinh) && (
                        <div className="mt-4">
                          <img
                            src={variant.mainImageFile ? URL.createObjectURL(variant.mainImageFile) : variant.hinh_chinh}
                            alt="Main Image Preview"
                            className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-[#edb54e]/20"
                          />
                          <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                            {variant.mainImageFile ? variant.mainImageFile.name : "Ảnh hiện tại"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ảnh thumbnail */}
                    <div>
                      <label htmlFor={`thumbnailFiles-${index}`} className="block text-sm font-semibold text-gray-700 mb-3">
                        Ảnh Thumbnail (tùy chọn)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id={`thumbnailFiles-${index}`}
                          name="thumbnailFiles"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleThumbnailImagesChange(index, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`thumbnailFiles-${index}`}
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#edb54e] transition-colors duration-200 bg-white hover:bg-[#edb54e]/5"
                        >
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500 text-center px-4">
                            Click để chọn nhiều ảnh<br />
                            <span className="text-xs">Có thể chọn nhiều file cùng lúc</span>
                          </span>
                        </label>
                      </div>
                      {(variant.thumbnailFiles?.length! > 0 || variant.hinh_thumbnail?.length > 0) && (
                        <div className="mt-4">
                          <div className="grid grid-cols-3 gap-3">
                            {(variant.thumbnailFiles?.length
                              ? variant.thumbnailFiles.map((file) => URL.createObjectURL(file))
                              : variant.hinh_thumbnail
                            ).map((src, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={src}
                                  alt={`Thumbnail Preview ${idx + 1}`}
                                  className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100">
                                    {idx + 1}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-3 text-center">
                            Đã chọn {(variant.thumbnailFiles?.length || variant.hinh_thumbnail?.length)} ảnh thumbnail
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                  disabled={saving}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#edb54e] to-[#f4c866] text-white font-semibold rounded-xl hover:from-[#e6a73d] hover:to-[#f0c055] transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Lưu Thay Đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(237, 181, 78, 0.2) !important;
        }

        input[type="file"] {
          outline: none !important;
        }

        input[type="file"]:focus + label {
          border-color: #edb54e !important;
          background-color: rgba(237, 181, 78, 0.05) !important;
        }

        /* Custom scrollbar for textareas */
        textarea::-webkit-scrollbar {
          width: 6px;
        }

        textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #edb54e;
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: #e6a73d;
        }

        /* Remove default input number arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
    </BoCucAdmin>
  );
}