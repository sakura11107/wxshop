<template>
  <view>
    <button v-if="!isLoggedIn" hover-class="button-hover" @click="handleUserTap">微信登录</button>
    <view v-else>
      <image :src="userInfo.avatarUrl" mode="aspectFit" style="width: 100px; height: 100px;"></image>
      <view>昵称: {{ userInfo.nickName }}</view>
      <view>地址: {{ userInfo.address || '未设置' }}</view>
      <view>电话: {{ userInfo.phone || '未设置' }}</view>
      <button @click="showUpdateDialog = true">更新信息</button>
      <button @click="handleLogout">退出登录</button> <!-- 新增的退出按钮 -->

      <!-- 自定义的弹窗 -->
      <view v-if="showUpdateDialog" class="modal">
        <view class="modal-content">
          <view class="modal-header">更新信息</view>
          <view class="modal-body">
            <input v-model="newAddress" placeholder="请输入新地址" />
            <input v-model="newPhone" placeholder="请输入新手机号" />
          </view>
          <view class="modal-footer">
            <button @click="updateUserInfo">保存</button>
            <button @click="showUpdateDialog = false">取消</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import { useCategoryStore } from '@/stores/category';
import { useCartStore } from '@/stores/cartitem';
const cartStore = useCartStore();
const categoryStore = useCategoryStore();

interface WechatUserInfo {
  nickName: string;
  avatarUrl: string;
  address?: string;
  phone?: string;
}

interface LoginResponse {
  message: string;
  token: string;
  openid: string;
  userId: string;
}

const isLoggedIn = ref(false);
const userInfo = reactive<WechatUserInfo>({ nickName: '', avatarUrl: '' });
const showUpdateDialog = ref(false);
const newAddress = ref('');
const newPhone = ref('');


// 页面挂载时检查是否有token
onMounted(() => {
  const token = uni.getStorageSync('token');
  if (token) {
    isLoggedIn.value = true;
    fetchUserInfo(token);  // 有token时直接加载用户信息
  }
});

const handleUserTap = () => {
  uni.getUserProfile({
    desc: '用于完善用户资料',
    success: (res: UniApp.GetUserProfileRes) => {
      Object.assign(userInfo, res.userInfo);
      login(res.userInfo);
    },
    fail: (err) => {
      console.log("获取用户信息失败", err);
    }
  });
};

const login = (wechatUserInfo: WechatUserInfo) => {
  uni.login({
    provider: 'weixin',
    success: (res) => {
      if (res.code) {
        uni.request({
          url: 'http://localhost:3000/api/login',
          method: 'POST',
          data: {
            code: res.code,
            userInfo: {
              nickname: wechatUserInfo.nickName,
              avatar: wechatUserInfo.avatarUrl
            }
          },
          success: async (response: UniApp.RequestSuccessCallbackResult) => {
            const loginResponse = response.data as LoginResponse;
            isLoggedIn.value = true;
            if (loginResponse.token) {
              uni.setStorageSync('token', loginResponse.token);
              console.log("登录成功", loginResponse);
              fetchUserInfo(loginResponse.token);
              await categoryStore.fetchProducts();
              await cartStore.fetchFavorites(loginResponse.userId);
            }
          },
          fail: (err) => {
            console.log("请求失败", err);
          }
        });
      }
    },
    fail: (err) => {
      console.log("微信登录失败", err);
    }
  });
};

const fetchUserInfo = (token: string) => {
  uni.request({
    url: 'http://localhost:3000/api/getUserInfo',
    method: 'GET',
    header: {
      'Authorization': `Bearer ${token}`
    },
    success: (res: UniApp.RequestSuccessCallbackResult) => {
      const userData = res.data as WechatUserInfo;
      Object.assign(userInfo, userData);
    },
    fail: (err) => {
      console.log("获取用户信息失败", err);
    }
  });
};

const updateUserInfo = () => {
  const token = uni.getStorageSync('token');
  if (!token) {
    console.log("未找到token,请先登录");
    return;
  }

  uni.request({
    url: 'http://localhost:3000/api/updateUserInfo',
    method: 'POST',
    data: {
      address: newAddress.value,
      phone: newPhone.value
    },
    header: {
      'Authorization': `Bearer ${token}`
    },
    success: (res) => {
      console.log("用户信息更新成功", res.data);
      showUpdateDialog.value = false;
      fetchUserInfo(token);
    },
    fail: (err) => {
      console.log("用户信息更新失败", err);
    }
  });
};

// 新增的退出登录逻辑
const handleLogout = () => {
  uni.removeStorageSync('token');
  isLoggedIn.value = false;
  Object.assign(userInfo, { nickName: '', avatarUrl: '' });
  console.log("已退出登录,storage 已清空");
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

.modal-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
