"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { fetcher, formatCurrency } from "@/lib/api"
import { toast } from "react-hot-toast"
import Link from "next/link"

// Định nghĩa interface Product chính xác hơn theo backend
interface Product {
  _id: string; // ObjectId của MongoDB
  id: number; // ID tự tăng
  ten_sp: string;
  slug: string;
  id_loai: number; // Chỉ cần ID ở đây, không cần populate object
  id_thuong_hieu: number | null;
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
  _id: string; // Cần có _id để update/delete riêng lẻ
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

// Interface cho Category/Brand data from API
interface Category {
  id: number;
  ten_loai: string;
}

interface Brand {
  id: number;
  ten_thuong_hieu: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string; // Lấy productId từ URL

  const [formData, setFormData] = useState<Omit<Product, '_id' | 'id' | 'slug' | 'created_at' | 'updated_at' | 'luot_xem'>>({
    ten_sp: "",
    id_loai: 0,
    id_thuong_hieu: null,
    mo_ta: "",
    chat_lieu: "",
    xuat_xu: "",
    variants: [],
    hinh_anh: [],
    hot: false,
    an_hien: true,
    tags: [],
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data, categories, and brands
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetcher<Product>(`/products/${productId}`);
        const categoriesData = await fetcher<Category[]>('/categories/all');
        const brandsData = await fetcher<Brand[]>('/brands/all');

        setCategoriesList(categoriesData.data);
        setBrandsList(brandsData.data);

        const fetchedProduct = productData.data;

        setFormData({
          ten_sp: fetchedProduct.ten_sp,
          id_loai: fetchedProduct.id_loai,
          id_thuong_hieu: fetchedProduct.id_thuong_hieu,
          mo_ta: fetchedProduct.mo_ta,
          chat_lieu: fetchedProduct.chat_lieu,
          xuat_xu: fetchedProduct.xuat_xu,
          variants: fetchedProduct.variants, // Keep variants as is
          hinh_anh: fetchedProduct.hinh_anh || [],
          hot: fetchedProduct.hot,
          an_hien: fetchedProduct.an_hien,
          tags: fetchedProduct.tags || [],
          meta_title: fetchedProduct.meta_title || "",
          meta_description: fetchedProduct.meta_description || "",
          meta_keywords: fetchedProduct.meta_keywords || "",
        });
      } catch (err: any) {
        setError(err.info?.message || err.message || 'Lỗi khi tải dữ liệu sản phẩm.');
        toast.error("Lỗi khi tải dữ liệu sản phẩm: " + (err.info?.message || err.message));
        console.error("Error fetching product data for edit:", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const newVariants = [...formData.variants];

    let parsedValue: string | number | boolean = value;
    if (name === 'gia' || name === 'gia_km' || name === 'so_luong') {
      parsedValue = parseFloat(value) || 0;
      if (name === 'gia_km' && value === '') parsedValue = null;
    } else if (type === 'checkbox') {
      parsedValue = checked;
    }

    // @ts-ignore
    newVariants[index][name] = parsedValue;
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        _id: new mongoose.Types.ObjectId().toString(), // Tạo một _id mới cho variant mới (client-side only)
        sku: "",
        kich_thuoc: "M",
        mau_sac: "Đen",
        gia: 0,
        gia_km: null,
        so_luong: 0,
        hinh_chinh: "",
        hinh_thumbnail: [],
      }],
    }));
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (formData.variants.length === 1) {
      toast.error("Không thể xóa biến thể cuối cùng của sản phẩm.");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) {
      try {
        await fetcher(`/products/${productId}/variants/${variantId}`, 'DELETE');
        toast.success("Biến thể đã được xóa thành công!");
        setFormData(prev => ({
          ...prev,
          variants: prev.variants.filter(v => v._id !== variantId)
        }));
      } catch (err: any) {
        toast.error("Lỗi khi xóa biến thể: " + (err.info?.message || err.message));
        console.error("Error deleting variant:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        id_loai: Number(formData.id_loai),
        id_thuong_hieu: formData.id_thuong_hieu ? Number(formData.id_thuong_hieu) : null,
      };

      // Tách variants ra để gọi API riêng nếu cần
      const { variants, ...productPayload } = payload;

      // Update main product info
      await fetcher(`/products/${productId}`, 'PUT', productPayload);
      toast.success("Sản phẩm đã được cập nhật thành công!");

      // Update/add/delete variants separately
      // This is a simplified approach. A more robust solution would track changes
      // (added, modified, deleted variants) and send specific requests.
      // For now, we assume all variants in formData.variants should be "synced".
      // This means if a variant is missing from the original product but present in formData.variants, it's new.
      // If a variant is present in original product but missing from formData.variants, it's deleted.
      // If a variant is present in both, it's updated.

      // For simplicity in this example, we just pass the whole variants array in the product update.
      // The backend should handle the logic of updating nested arrays,
      // or you would need separate API calls per variant as structured in adminRouteVariants.js
      // Let's assume the PUT /products/:id endpoint can handle the entire variants array.
      // If not, you'd iterate through `variants` and call specific variant APIs:

      // Example of handling variants more granularly after product update:
      // const originalProduct = await fetcher<Product>(`/products/${productId}`); // Re-fetch or pass original
      // for (const variant of variants) {
      //     if (!variant._id) { // New variant
      //         await fetcher(`/products/${productId}/variants`, 'POST', variant);
      //     } else { // Existing variant
      //         await fetcher(`/products/${productId}/variants/${variant._id}`, 'PUT', variant);
      //     }
      // }
      // // Logic to find and delete removed variants (more complex, requires comparing original and new variants)

      router.push("/products");
    } catch (err: any) {
      toast.error("Lỗi khi cập nhật sản phẩm: " + (err.info?.message || err.message));
      console.error("Error updating product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-5xl bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Chỉnh sửa sản phẩm</h1>
            <Link href="/products" className="text-sm text-gray-500 hover:text-gray-700">
              <i className="fas fa-arrow-left mr-1"></i> Quay lại danh sách
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ten_sp" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      id="ten_sp"
                      name="ten_sp"
                      value={formData.ten_sp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="id_loai" className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      id="id_loai"
                      name="id_loai"
                      value={formData.id_loai || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.ten_loai}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="id_thuong_hieu" className="block text-sm font-medium text-gray-700 mb-1">
                      Thương hiệu
                    </label>
                    <select
                      id="id_thuong_hieu"
                      name="id_thuong_hieu"
                      value={formData.id_thuong_hieu || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brandsList.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.ten_thuong_hieu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="xuat_xu" className="block text-sm font-medium text-gray-700 mb-1">
                      Xuất xứ
                    </label>
                    <input
                      type="text"
                      id="xuat_xu"
                      name="xuat_xu"
                      value={formData.xuat_xu}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập xuất xứ"
                    />
                  </div>
                  <div>
                    <label htmlFor="chat_lieu" className="block text-sm font-medium text-gray-700 mb-1">
                      Chất liệu
                    </label>
                    <input
                      type="text"
                      id="chat_lieu"
                      name="chat_lieu"
                      value={formData.chat_lieu}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập chất liệu"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="mo_ta" className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      id="mo_ta"
                      name="mo_ta"
                      rows={3}
                      value={formData.mo_ta}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập mô tả sản phẩm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (Phân cách bởi dấu phẩy)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ví dụ: thời trang, nam, áo thun"
                    />
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Biến thể sản phẩm (SKU, Kích thước, Màu sắc, Giá, Tồn kho)</h3>
                {formData.variants.length === 0 && <p className="text-gray-500 mb-4">Chưa có biến thể nào. Vui lòng thêm biến thể.</p>}
                {formData.variants.map((variant, index) => (
                  <div key={variant._id || index} className="border p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <h4 className="md:col-span-3 text-md font-semibold text-gray-800 flex justify-between items-center">
                      Biến thể {index + 1}
                      <button type="button" onClick={() => handleDeleteVariant(variant._id)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={formData.variants.length === 1}>
                        <i className="fas fa-trash"></i> Xóa
                      </button>
                    </h4>
                    <div>
                      <label htmlFor={`sku-${index}`} className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input type="text" id={`sku-${index}`} name="sku" value={variant.sku} onChange={(e) => handleVariantChange(index, e)} required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label htmlFor={`kich_thuoc-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                      <input type="text" id={`kich_thuoc-${index}`} name="kich_thuoc" value={variant.kich_thuoc} onChange={(e) => handleVariantChange(index, e)} required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label htmlFor={`mau_sac-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                      <input type="text" id={`mau_sac-${index}`} name="mau_sac" value={variant.mau_sac} onChange={(e) => handleVariantChange(index, e)} required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label htmlFor={`gia-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
                      <input type="number" id={`gia-${index}`} name="gia" value={variant.gia} onChange={(e) => handleVariantChange(index, e)} min="0" required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label htmlFor={`gia_km-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Giá KM (Tùy chọn)</label>
                      <input type="number" id={`gia_km-${index}`} name="gia_km" value={variant.gia_km !== null ? variant.gia_km : ''} onChange={(e) => handleVariantChange(index, e)} min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                      <label htmlFor={`so_luong-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn</label>
                      <input type="number" id={`so_luong-${index}`} name="so_luong" value={variant.so_luong} onChange={(e) => handleVariantChange(index, e)} min="0" required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor={`hinh_chinh-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh chính (URL)</label>
                      <input type="text" id={`hinh_chinh-${index}`} name="hinh_chinh" value={variant.hinh_chinh} onChange={(e) => handleVariantChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Dán URL hình ảnh chính của biến thể" />
                      {variant.hinh_chinh && <img src={variant.hinh_chinh} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-md" />}
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor={`hinh_thumbnail-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh phụ (URLs, cách nhau bởi dấu phẩy)</label>
                      <input type="text" id={`hinh_thumbnail-${index}`} name="hinh_thumbnail"
                        value={variant.hinh_thumbnail.join(', ')}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].hinh_thumbnail = e.target.value.split(',').map(url => url.trim()).filter(Boolean);
                          setFormData(prev => ({ ...prev, variants: newVariants }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Dán URL hình ảnh phụ, cách nhau bởi dấu phẩy" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {variant.hinh_thumbnail.map((imgUrl, i) => (
                          <img key={i} src={imgUrl} alt="Thumbnail Preview" className="w-16 h-16 object-cover rounded-md" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
                >
                  Thêm biến thể mới
                </button>
              </div>

              {/* Product General Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh chung sản phẩm (URLs)</h3>
                <input
                  type="text"
                  name="hinh_anh"
                  value={formData.hinh_anh.join(', ')}
                  onChange={(e) => {
                    const urls = e.target.value.split(',').map(url => url.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, hinh_anh: urls }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Dán URL hình ảnh chung, cách nhau bởi dấu phẩy"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.hinh_anh.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} alt="Product General Preview" className="w-20 h-20 object-cover rounded-md" />
                  ))}
                </div>
              </div>

              {/* SEO Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO (Tối ưu hóa công cụ tìm kiếm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input type="text" id="meta_title" name="meta_title" value={formData.meta_title} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <input type="text" id="meta_description" name="meta_description" value={formData.meta_description} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                    <input type="text" id="meta_keywords" name="meta_keywords" value={formData.meta_keywords} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Status & Hot Product */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="an_hien-true"
                      name="an_hien"
                      type="radio"
                      value="true"
                      checked={formData.an_hien === true}
                      onChange={() => setFormData(prev => ({ ...prev, an_hien: true }))}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                    />
                    <label htmlFor="an_hien-true" className="ml-2 block text-sm text-gray-900">
                      Đang bán
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="an_hien-false"
                      name="an_hien"
                      type="radio"
                      value="false"
                      checked={formData.an_hien === false}
                      onChange={() => setFormData(prev => ({ ...prev, an_hien: false }))}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                    />
                    <label htmlFor="an_hien-false" className="ml-2 block text-sm text-gray-900">
                      Ngừng bán
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="hot-product"
                      name="hot"
                      type="checkbox"
                      checked={formData.hot}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hot-product" className="ml-2 block text-sm text-gray-900">
                      Sản phẩm nổi bật
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" disabled={submitting}>
                {submitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}