import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getAllOrders, getAllOrdersByStore, getUserOrders } from '@/lib/actions/order.action';

type Order = {
    id: string;
    product: {
        id: string;
        name: string;
        actualPrice: number;
        offerPrice: number | null;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        images: { url: string }[];
    };
    status: { name: string };
    user: {
        id: string;
        name: string;
        email: string;
        addresses: {
            firstName: string;
            lastName: string;
            email: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            phone: string;
        }[];
    };
    quantity: number;
    createdAt: Date;
    coupon: string | null;
    isCouponUsed: boolean;
    isPaid: boolean;
    paymentMethod: 'COD' | 'STRIPE';
};

type OrderStore = {
    userOrders: Order[] | null;
    orders: Order[] | null;
    ordersByStore: Order[] | null;
    fetchUserOrders: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    fetchOrdersByStore: (storeId: string) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
    userOrders: null,
    fetchUserOrders: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getUserOrders(userId);
            set({ userOrders: data });
        } catch (error) {
            console.error('Error fetching userOrders:', error);
        }
    },
    orders: null,
    fetchOrders: async () => {
        try {
            const data = await getAllOrders();
            set({ orders: data });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    },
    ordersByStore: null,
    fetchOrdersByStore: async (storeId: string) => {
        try {
            const data = await getAllOrdersByStore(storeId);
            set({ ordersByStore: data });
        } catch (error) {
            console.error('Error fetching ordersByStore:', error);
        }
    },
}));
