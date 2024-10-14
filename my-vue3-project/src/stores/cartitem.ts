import { defineStore } from 'pinia';
import { api } from '@/services/api';
import { Product, CartItem, FavoriteItem} from '@/types/shop';

export const useCartStore = defineStore('cartitem', {
  state: () => ({
    items: [] as CartItem[],
    favoritesItems: [] as FavoriteItem[],
    showCart: false,
  }),

  getters: {
    cartTotal: (state): number => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    cartItemCount: (state): number => {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    },
    getProductQuantity: (state) => (productId: string): number => {
      const product = state.items.find(item => item.id === productId);
      return product ? product.quantity : 0;
    },
    productInCart: (state) => (productId: string): boolean => {
      return state.items.some(item => item.id === productId);
    },
    isFavorite: (state) => (productId: string): boolean => {
      return state.favoritesItems.some(item => item.productId === productId);
    }
  },

  actions: {
    addToCart(product: Product) {
      const existingItem = this.items.find(item => item.id === product.id);
      this.showCart= false;
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(product: Product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          this.items = this.items.filter(item => item.id !== product.id);
          this.updateShowCart();
        }
      }
    },
    updateShowCart() {  
      // 如果购物车为空，则隐藏购物车  
      this.showCart = this.items.length > 0;  
    },
    async fetchFavorites(userId: string) {
      try {
        const response = await api.getUserFavorites(userId);
        this.favoritesItems = response.map(product => ({ id: product.id, userId: userId, productId: product.id }));
      } catch (error) {
        console.error('获取收藏失败:', error);
      }
    },

    async toggleFavorite(userId: string, productId: string) {
      try {
        if (this.isFavorite(productId)) {
          await api.removeFromFavorites(userId, productId);
          this.favoritesItems = this.favoritesItems.filter(item => item.productId !== productId);
        } else {
          await api.addToFavorites(userId, productId);
          this.favoritesItems.push({ id: productId, userId: userId, productId: productId });
        }
      } catch (error) {
        console.error('切换收藏状态失败:', error);
      }
    },
    toggleCart(){
      this.showCart = !this.showCart;
    }
  }
});