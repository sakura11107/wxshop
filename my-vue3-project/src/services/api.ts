import { Product, FavoriteItem } from '@/types/shop';

const API_BASE_URL = 'http://localhost:3000';

export const api = {
  async request<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
    const token = uni.getStorageSync('token');
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${API_BASE_URL}${url}`,
        method,
        data,
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data as T);
          } else {
            reject(new Error(`Request failed with status ${res.statusCode}`));
          }
        },
        fail: reject
      });
    });
  },

  // 获取所有商品
  getAllProducts: () => api.request<Product[]>('/', 'GET'),

  // 添加商品到收藏
  addToFavorites: (userId:string,productId: string) => 
    api.request<void>('/favorites', 'POST', { user_id: userId, product_id: productId }),

  // 从收藏中移除商品
  removeFromFavorites: (userId:string,productId: string) => 
    api.request<void>('/favorites', 'DELETE', { user_id: userId, product_id: productId }),

  // 获取用户的收藏
  getUserFavorites: (userId: string) => api.request<Product[]>(`/favoritesproduct`, 'POST',{ user_id: userId }),

};