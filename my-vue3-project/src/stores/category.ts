import { defineStore } from 'pinia';
import { api } from '@/services/api';
import { Product } from '@/types/shop';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    activeCategory: '',
    products: [] as Product[],
  }),

  getters: {
    allProducts: (state): Product[] => {
      return state.products;
    },
    filteredProducts: (state): Product[] => {
      if (!state.activeCategory) return state.products;
      return state.products.filter(product => product.category === state.activeCategory);
    },
  },

  actions: {
    async fetchProducts() {
      try {
        this.products = await api.getAllProducts();
        //console.log('获取到的商品数据:', this.products);
      } catch (error) {
        console.error('获取商品失败:', error);
      }
    },
    setActiveCategory(category: string) {
      this.activeCategory = category;
    },
  },
});