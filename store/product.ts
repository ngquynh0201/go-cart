import { getProducts, getProductsByStore } from '@/lib/actions/product.action';
import { create } from 'zustand';

type Product = {
    id: string;
    name: string;
    description: string;
    actualPrice: number;
    offerPrice: number | null;
    images: { url: string }[];
    category: {
        id: string;
        name: string;
        createdAt: Date;
    };
    inStock: boolean;
    store: { name: string; logo: { url: string }[]; username: string };
    ratings: { rating: number; review: string; user: { name: string }; createdAt: Date }[];
    createdAt: Date;
};

type ProductStore = {
    products: Product[] | null;
    productsByStore: Product[] | null;
    fetchProducts: () => Promise<void>;
    fetchProductsByStore: (storeId: string) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    fetchProducts: async () => {
        try {
            const data = await getProducts();
            set({ products: data });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    },
    productsByStore: [],
    fetchProductsByStore: async (storeId: string) => {
        try {
            const data = await getProductsByStore(storeId);
            set({ productsByStore: data });
        } catch (error) {
            console.error('Error fetching productsByStore:', error);
        }
    },
}));
