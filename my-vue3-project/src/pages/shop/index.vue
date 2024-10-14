<template>
  <view class="shop-container">
    <!-- 分类导航 -->
    <scroll-view scroll-y class="category-tab">
      <view v-for="category in categories" :key="category"
        :class="['category-item', { active: categoryStore.activeCategory === category }]"
        @tap="setActiveCategory(category)">
        {{ category }}
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <scroll-view scroll-y class="product-list"
      :style="{ height: cartStore.items.length > 0 ? 'calc(100vh - 200rpx)' : 'calc(100vh - 100rpx)' }">
      <view v-for="product in categoryStore.filteredProducts" :key="product.id" class="product-item">
        <image :src="getImageUrl(product.image_url)" class="product-image" mode="aspectFill"></image>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">¥{{ product.price }}</text>
          <view class="action-buttons">
            <view class="cart-actions">
              <image
                :src="cartStore.isFavorite(product.id) ? '/static/tabbar/favorites-active.png' : '/static/tabbar/favorites.png'"
                class="action-icon" @tap="toggleFavorite(product.id)" />
              <image src="/static/tabbar/minus.png" v-if="cartStore.productInCart(product.id)" class="action-icon"
                @tap="removeFromCart(product)" />
              <text v-if="cartStore.productInCart(product.id)">{{ cartStore.getProductQuantity(product.id) }}</text>
              <image src="/static/tabbar/add.png" class="action-icon" @tap="addToCart(product)" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 购物车详情面板 -->
    <view :class="['cart-details', { active: cartStore.showCart && cartStore.items.length > 0 }]">
      <scroll-view scroll-y class="cart-item-list">
        <view v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <image :src="getImageUrl(item.image_url)" class="cart-item-image" mode="aspectFill"></image>
          <view class="cart-item-info">
            <text class="cart-item-name">{{ item.name }}</text>
            <text class="cart-item-price">¥{{ item.price }}</text>
            <view class="cart-item-quantity">
              <image src="/static/tabbar/minus.png" class="action-icon" @tap="removeFromCart(item)" />
              <text>{{ item.quantity }}</text>
              <image src="/static/tabbar/add.png" class="action-icon" @tap="addToCart(item)" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 购物车栏 -->
    <view class="cart-bar" v-if="cartStore.items.length > 0">
      <view class="cart-info">
        <image src="/static/tabbar/shop.png" class="cart-item-image2" mode="aspectFill"></image>
        <text class="cart-total">总价: ¥{{ cartStore.cartTotal.toFixed(2) }}</text>
        <text class="cart-count">共 {{ cartStore.cartItemCount }} 件</text>
      </view>
      <view class="cart-buttons">
        <button class="cart-button" @tap="cartStore.toggleCart">
          {{ cartStore.showCart ? '关闭' : '查看' }}购物车
        </button>
        <button class="checkout-button" @tap="checkout">
          去结算
        </button>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cartitem';
import { useCategoryStore } from '@/stores/category';
import { Product } from '@/types/shop';
import { jwtDecode } from 'jwt-decode';

const cartStore = useCartStore();
const categoryStore = useCategoryStore();

const getImageUrl = (imagePath: string) => {
  const fileName = imagePath.split('\\').pop();
  return `/static/${fileName}`;
};

const categories = computed(() => {
  const uniqueCategories = [...new Set(categoryStore.products.map(product => product.category))];
  return ['全部', ...uniqueCategories];
});

onMounted(async () => {
  try {
    const token = uni.getStorageSync('token');
    if (token) {
      const decodedToken = jwtDecode<{ userId: string }>(token);
      const userId = decodedToken.userId;
      await categoryStore.fetchProducts();
      await cartStore.fetchFavorites(userId);
    } else {
      console.error('未找到 token');
      uni.showModal({
        title: '提示',
        content: '您还未登录，是否现在登录？',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index'
            });
          }
        }
      });
    }
  } catch (error) {
    console.error('初始化商店失败:', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  }
});

const setActiveCategory = (category: string) => {
  if (category === '全部') {
    categoryStore.setActiveCategory('');
  } else {
    categoryStore.setActiveCategory(category);
  }
};

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
};

const removeFromCart = (product: Product) => {
  cartStore.removeFromCart(product);
};

const toggleFavorite = (productId: string) => {
  const token = uni.getStorageSync('token');
  if (!token) {
    console.log("请先登录");
    return;
  }
  const decodedToken = jwtDecode<{ userId: string }>(token);
  const userId = decodedToken.userId;
  cartStore.toggleFavorite(userId, productId);
};

const checkout = () => {
  console.log('结算');
};
</script>

<style>
.shop-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.category-tab {
  width: 200rpx;
  background-color: #f8f8f8;
  padding: 20rpx 0;
}

.category-item {
  padding: 20rpx;
  font-size: 32rpx;
  text-align: center;
  color: #333;
}

.category-item.active {
  color: #ff0000;
  border-left: 8rpx solid #ff0000;
  background-color: #f0f0f0;
}

.product-list {
  flex: 1;
  padding: 20rpx;
  background-color: #fff;
  transition: height 0.3s ease;
  padding-bottom: 0;
  /* 移除底部内边距 */
}

.product-item {
  display: flex;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 20rpx;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  object-fit: cover;
  border-radius: 16rpx;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20rpx;
  flex: 1;
}

.product-name {
  font-size: 36rpx;
  color: #333;
}

.product-price {
  font-size: 32rpx;
  color: #ff0000;
  margin-top: 10rpx;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.cart-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  margin: 0 10rpx;
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  
  height: 100rpx;
  z-index: 999;
}

.cart-info {
  display: flex;
  flex-direction: column;
}

.cart-total {
  font-size: 32rpx;
  color: #ff0000;
  font-weight: bold;
}

.cart-count {
  font-size: 28rpx;
  color: #666;
}

.cart-buttons {
  display: flex;
}

.cart-button,
.checkout-button {
  margin-left: 20rpx;
  padding: 16rpx 30rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.cart-button {
  background-color: #f0f0f0;
  color: #333;
}

.checkout-button {
  background-color: #ff0000;
  color: white;
}

.checkout-button:disabled {
  background-color: #ccc;
  color: #666;
}

.cart-details {
  display: none;
  position: fixed;
  bottom: 100rpx;
  /* 与购物车栏的高度保持一致 */
  left: 0;
  right: 0;
  height: 0;
  background-color: white;
  border-top: none;
  overflow: hidden;
  transition: height 0.3s ease;
  z-index: 998;
  /* 确保在商品列表之上，购物车栏之下 */
}

.cart-details.active {
  display: block;
  height: 300rpx;
  border-top: 1rpx solid #ddd;
}

.cart-item-list {
  height: 100%;
}

.cart-item {
  display: flex;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.cart-item-image {
  width: 120rpx;
  height: 120rpx;
  object-fit: cover;
  border-radius: 8rpx;
}

.cart-item-image2 {
  width: 60rpx;
  height: 60rpx;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-name {
  font-size: 32rpx;
  color: #333;
}

.cart-item-price {
  font-size: 28rpx;
  color: #ff0000;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
}

.loading {
  text-align: center;
  padding: 20rpx;
  color: #999;
}
</style>