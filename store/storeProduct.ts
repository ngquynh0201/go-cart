import { getStoreByUsername } from '@/lib/actions/store.action';
import { create } from 'zustand';

type StoreProduct = {
    id: string;
    name: string;
    description: string;
    username: string;
    address: string;
    status: string;
    isActive: boolean;
    logo: { url: string }[];
    user: {
        id: string;
        name: string;
        email: string;
    };
    email: string;
    contact: string;
    products: {
        id: string;
        name: string;
        description: string;
        actualPrice: number;
        offerPrice: number | null;
        images: {
            url: string;
        }[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        inStock: boolean;
        store: {
            name: string;
            logo: {
                url: string;
            }[];
            username: string;
        };
        ratings: {
            rating: number;
            review: string;
            user: {
                name: string;
            };
            createdAt: Date;
        }[];
        createdAt: Date;
    }[];
    createdAt: Date;
};

type StoreProductStore = {
    stores: StoreProduct[] | null;
    fetchStores: (username: string) => Promise<void>;
};

export const useStoreProductStore = create<StoreProductStore>((set) => ({
    stores: [],
    fetchStores: async (username: string) => {
        try {
            const data = await getStoreByUsername(username);
            set({ stores: data });
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    },
}));
