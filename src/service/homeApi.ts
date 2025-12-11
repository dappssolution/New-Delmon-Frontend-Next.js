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
};
