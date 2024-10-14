// 商品类型
export interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
    description?: string;
    stock?: number;
}

// 收藏项类型
export interface FavoriteItem {
    id: string;
    userId: string;
    productId: string;
}

// 购物车项类型
export interface CartItem extends Product {
    quantity: number;
}

// 用户类型
export interface User {
    id: string; 
    avatar: string;
    name: string;
    phone: string;
    address: string;
    openid: string;
}

// 订单类型
export interface Order {
    id: number;
    userId: string;
    items: CartItem[];
    total_price: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    created_at: Date;

}