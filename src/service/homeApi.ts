import api from "../lib/axios";

export const homeApi = {
  async getBanners() {
    const res = await api.get(`/get-banners`);
    return res.data;
  },

  async getProducts() {
    const res = await api.get(`/products?simple=true`);
    return res.data;
  },

  async getPaginatedProducts(page: number = 1, limit: number = 12) {
    const res = await api.get(`/products?page=${page}&per_page=${limit}`);
    return res.data;
  },

  async getProductById(id: number) {
    const res = await api.get(`/product/${id}`);
    return res.data;
  },

  async getCategories(type: string = 'category', limit: number = 8) {
    const res = await api.get(`/categories?type=${type}&limit=${limit}`);
    return res.data;
  },
  async getProductsByCategory(
  categoryType: "main-category" | "category" | "sub-category",
  id: number,
  params?: {
    per_page?: number;
    simple?: boolean;
  }
) {
  const res = await api.get(`/${categoryType}/${id}/products`, {
    params,
  });
  return res.data;
}

};
