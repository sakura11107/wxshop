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

      <!-- 根据订单状态显示不同操作按钮 -->
      <view class="order-actions">
        <view v-if="order.status === 'pending'" class="action-buttons">
          <button @click="payOrder(order.id)" class="pay-button">去支付</button>
          <button @click="cancelOrder(order.id)" class="cancel-button">取消订单</button>
        </view>
        <view v-else-if="order.status === 'shipped'" class="action-buttons">
          <button @click="viewLogistics(order.id)" class="logistics-button">查看物流</button>
          <button @click="confirmReceipt(order.id)" class="confirm-button">确认收货</button>
        </view>
        <view v-else-if="order.status === 'completed'" class="action-buttons">
          <button @click="viewLogistics(order.id)" class="logistics-button">查看物流</button>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { jwtDecode } from 'jwt-decode';
import { Order } from '@/types/shop';

// 定义订单列表
const orders = ref<Order[]>([]);

// 获取当前用户 ID
const token = uni.getStorageSync('token');
const decodedToken = jwtDecode<{ userId: string }>(token);
const userId = decodedToken.userId;

// 获取用户订单数据
const fetchOrders = async () => {
  try {
    const response = await api.getUserOrders(`${userId}`);
    orders.value = response;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  }
};

// 支付订单
const payOrder = (orderId: string) => {
  console.log(`去支付订单: ${orderId}`);
  // 这里可以添加支付逻辑
};

// 取消订单
const cancelOrder = (orderId: string) => {
  console.log(`取消订单: ${orderId}`);
  // 这里可以添加取消订单逻辑
};

// 查看物流
const viewLogistics = (orderId: string) => {
  console.log(`查看物流: ${orderId}`);
  // 这里可以添加查看物流逻辑
};

// 确认收货
const confirmReceipt = (orderId: string) => {
  console.log(`确认收货: ${orderId}`);
  // 这里可以添加确认收货逻辑
};

// 在组件挂载时获取订单列表
onMounted(() => {
  fetchOrders();
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

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.pay-button, .cancel-button, .logistics-button, .confirm-button {
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
}

.pay-button {
  background-color: #4CAF50;
}

.cancel-button {
  background-color: #f44336;
}

.logistics-button {
  background-color: #2196F3;
}

.confirm-button {
  background-color: #FFC107;
}
</style>
