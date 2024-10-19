import { defineStore } from 'pinia';
import { api } from '@/services/api';
import { Product, CartItem, FavoriteItem} from '@/types/shop';

export const useCartStore = defineStore('cartitem', {
  state: () => ({
    items: JSON.parse(uni.getStorageSync('cartItems') || '[]') as CartItem[],
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
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
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
      this.saveCart();
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
    },
    saveCart() {
      uni.setStorageSync('cartItems', JSON.stringify(this.items));  // 保存购物车到 localStorage
    },
    async checkout(userId:string) {
      try {
        const orderData = {
          userid: userId,  
          items: this.items,
          total: this.cartTotal,
          count: this.cartItemCount,
        };
        console.log('结算订单:', orderData);
        // 假设这是你的 API 调用，保存订单
        await api.saveCartToBackend(orderData);  
        
        // 清空本地存储的购物车信息
        uni.removeStorageSync('cartItems');
  
        // 清空 Pinia 状态中的购物车
        this.items = [];
        this.updateShowCart();
      } catch (error) {
        console.error('结算失败:', error);
        throw error;  // 抛出错误供外部捕获
      }
    }
  }
});