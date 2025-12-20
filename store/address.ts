import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getAddressByUserId } from '@/lib/actions/user.action';

type Address = {
    userId: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    createdAt: Date;
};

type AddressStore = {
    address: Address | null;
    fetchAddress: () => Promise<void>;
};

export const useAddressStore = create<AddressStore>((set) => ({
    address: null,
    fetchAddress: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getAddressByUserId(userId);
            set({ address: data });
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    },
}));
