import { getCurrentUser, getPlanUser, getUsers } from '@/lib/actions/user.action';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type PlanUser = {
    expiredAt: Date;
};

type User = {
    id: string;
    name: string;
    email: string;
    isPlus: boolean;
    isSwitchedFree: boolean;
    isSwitchedPlus: boolean;
    store: { id: string }[];
    createdAt: Date;
};

type UserStore = {
    users: User[] | null;
    currentUser: User | null;
    planUser: PlanUser | null;
    fetchUsers: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    fetchPlanUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    users: null,
    fetchUsers: async () => {
        try {
            const data = await getUsers();
            set({ users: data });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    },
    currentUser: null,
    fetchCurrentUser: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getCurrentUser(userId);
            set({ currentUser: data });
        } catch (error) {
            console.error('Error fetching currentUser:', error);
        }
    },
    planUser: null,
    fetchPlanUser: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getPlanUser(userId);
            set({ planUser: data });
        } catch (error) {
            console.error('Error fetching planUser:', error);
        }
    },
}));
