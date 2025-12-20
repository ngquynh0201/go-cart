import { getStatuses } from '@/lib/actions/order.action';
import { create } from 'zustand';

type Status = {
    id: string;
    name: string;
    createdAt: Date;
};

type StatusStore = {
    statuses: Status[] | null;
    fetchStatuses: () => Promise<void>;
};

export const useStatusStore = create<StatusStore>((set) => ({
    statuses: null,
    fetchStatuses: async () => {
        try {
            const data = await getStatuses();
            set({ statuses: data });
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    },
}));
