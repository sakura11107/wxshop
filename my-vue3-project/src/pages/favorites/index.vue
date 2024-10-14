<template>
  <view class="favorites-container">
    <view v-if="favoriteProducts.length === 0" class="empty-message">
      <image src="/static/tabbar/favorites.png" class="empty-icon" />
      <text>暂无收藏商品</text>
      <button class="go-shopping-btn" @click="goToShop">去逛逛</button>
    </view>
    <scroll-view scroll-y class="favorite-list" v-else>
      <view v-for="product in favoriteProducts" :key="product.id" class="favorite-item">
        <image :src="getImageUrl(product.image_url)" class="favorite-image" mode="aspectFill" />
        <view class="favorite-info">
          <text class="favorite-name">{{ product.name }}</text>
          <text class="favorite-price">¥{{ product.price }}</text>
          <view class="favorite-actions">
            <button class="add-to-cart-btn" @click="addToCart(product)">加入购物车</button>
            <image src="/static/tabbar/favorites-active.png" class="action-icon" @click="toggleFavorite(product.id)" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartitem';
import { useCategoryStore } from '@/stores/category';
import { Product } from '@/types/shop';
import { computed,watch } from 'vue';
import { jwtDecode } from 'jwt-decode';

const cartStore = useCartStore();
const categoryStore = useCategoryStore();

const favoriteProducts = computed(() => {
  return cartStore.favoritesItems.map(fav => {
    return categoryStore.allProducts.find(item => item.id === fav.productId);
  }).filter(product => product !== undefined);
});


const toggleFavorite = (productId: string) => {
  const token = uni.getStorageSync('token'); // 获取存储中的 token
  if (!token) {
    console.log("请先登录");
    return;
  }
  // 使用 jwt-decode 解析 token，获取 openid
  const decodedToken = jwtDecode<{userId: string }>(token);
  const userId = decodedToken.userId; // 假设 openid 存在于解码后的 token 中

  // 使用 userId 进行收藏操作
  cartStore.toggleFavorite(userId, productId);
};

const getImageUrl = (imagePath: string) => {
  const fileName = imagePath.split('\\').pop();

  return `/static/${fileName}`;
};

const addToCart = (product:Product) => {
  cartStore.addToCart(product);
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  });
};

const goToShop = () => {
  uni.switchTab({
    url: '/pages/shop/index'
  });
};
</script>

<style scoped>
.favorites-container {
  padding: 10px;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.go-shopping-btn {
  margin-top: 20px;
  background-color: #3cc51f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
}

.favorite-list {
  display: flex;
  flex-direction: column;
}

.favorite-item {
  display: flex;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 15px;
}

.favorite-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.favorite-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.favorite-price {
  font-size: 18px;
  color: #ff0000;
  font-weight: bold;
}

.favorite-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.add-to-cart-btn {
  background-color: #3cc51f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
}

.action-icon {
  width: 30px;
  height: 30px;
}
</style>