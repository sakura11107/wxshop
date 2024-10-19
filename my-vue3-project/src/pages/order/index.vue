<template>
  <view class="order-list">
    <view v-for="order in orders" :key="order.id" class="order-card">
      <!-- 订单头部显示订单号和状态 -->
      <view class="order-header">
        <text>订单号: {{ order.id }}</text>
        <text>状态: {{ order.status }}</text>
      </view>

      <!-- 订单项列表 -->
      <view class="order-items">
        <view v-for="item in order.items" :key="item.id" class="order-item">
          <text>{{ item.name }}</text>
          <text>数量: {{ item.quantity }}</text>
          <text>单价: ¥{{ item.price }}</text>
        </view>
      </view>

      <!-- 订单尾部显示总价和下单时间 -->
      <view class="order-footer">
        <text>总价: ¥{{ order.total_price }}</text>
        <text>下单时间: {{ new Date(order.created_at).toLocaleString() }}</text>
      </view>
    </view>
  </view>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {api} from '@/services/api';
import { jwtDecode } from 'jwt-decode';

import { Order } from '@/types/shop';

export default defineComponent({
  name: 'OrderList',
  setup() {
    const orders = ref<Order[]>([]);
    const token = uni.getStorageSync('token');
    const decodedToken = jwtDecode<{ userId: string }>(token);
    const userId = decodedToken.userId;

    const fetchOrders = async () => {
      try {
        const response = await api.getUserOrders(`${userId}`);
        //console.log('获取订单列表成功:', response);
        orders.value = response;
      } catch (error) {
        console.error('获取订单列表失败:', error);
      }
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders
    };
  }
});
</script>

<style scoped>
.order-list {
  padding: 10px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 10px;
}

.order-header, .order-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-items {
  margin-bottom: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>