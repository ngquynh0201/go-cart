import { getStoreByUserId, getStores } from '@/lib/actions/store.action';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type StoreUser = {
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
    createdAt: Date;
};

type StoreUserStore = {
    stores: StoreUser[] | null;
    storeByUser: StoreUser | null;
    fetchStores: () => Promise<void>;
    fetchStoreByUser: () => Promise<void>;
};

export const useStoreUserStore = create<StoreUserStore>((set) => ({
    stores: [],
    fetchStores: async () => {
        try {
            const data = await getStores();
            set({ stores: data });
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    },
    storeByUser: null,
    fetchStoreByUser: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getStoreByUserId(userId);
            set({ storeByUser: data });
        } catch (error) {
            console.error('Error fetching storeByUser:', error);
        }
    },
}));
