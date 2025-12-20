import { getCartItems, getItemAmountByProductId } from '@/lib/actions/cart.action';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type CartItemAmount = {
    quantity: number;
};

type Cart = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        actualPrice: number;
        offerPrice: number | null;
        images: { url: string }[];
    };
};

type CartStore = {
    cartItemAmount: CartItemAmount | null;
    cartItems: Cart[] | null;
    fetchCartItemAmount: (userId: string, productId: string) => Promise<void>;
    fetchCartItems: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
    cartItemAmount: null,
    fetchCartItemAmount: async (userId: string, productId: string) => {
        try {
            const data = await getItemAmountByProductId(userId, productId);
            set({ cartItemAmount: data });
        } catch (error) {
            console.error('Error fetching cartItemAmount:', error);
        }
    },
    cartItems: [],
    fetchCartItems: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getCartItems(userId);
            set({ cartItems: data });
        } catch (error) {
            console.error('Error fetching cartItems:', error);
        }
    },
}));
