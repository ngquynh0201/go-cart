import { create } from 'zustand';
import { getProductByStoreCount } from '@/lib/actions/product.action';
import { getOrderRevenueStore, getOrderStoreCount } from '@/lib/actions/order.action';
import { getRatingStoreCount } from '@/lib/actions/rating.action';

type DashboardStore = {
    productCount: number;
    revenue: number;
    orderCount: number;
    ratingCount: number;
    fetchProductCount: (storeId: string) => Promise<void>;
    fetchRevenue: (storeId: string) => Promise<void>;
    fetchOrderCount: (storeId: string) => Promise<void>;
    fetchRatingCount: (storeId: string) => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
    productCount: 0,
    fetchProductCount: async (storeId: string) => {
        try {
            const data = await getProductByStoreCount(storeId);
            set({ productCount: data });
        } catch (error) {
            console.error('Error fetching product count:', error);
        }
    },
    revenue: 0,
    fetchRevenue: async (storeId: string) => {
        try {
            const data = await getOrderRevenueStore(storeId);
            set({ revenue: data });
        } catch (error) {
            console.error('Error fetching revenue:', error);
        }
    },
    orderCount: 0,
    fetchOrderCount: async (storeId: string) => {
        try {
            const data = await getOrderStoreCount(storeId);
            set({ orderCount: data });
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    },
    ratingCount: 0,
    fetchRatingCount: async (storeId: string) => {
        try {
            const data = await getRatingStoreCount(storeId);
            set({ ratingCount: data });
        } catch (error) {
            console.error('Error fetching rating count:', error);
        }
    },
}));
