import { create } from 'zustand';
import {
    cleanupExpiredNotificationsStore,
    getNotificationsStore,
    getUnreadNotificationStoreCount,
} from '@/lib/actions/notification.action';

type Notification = {
    id: string;
    type: 'ORDER' | 'RATING';
    rating: {
        id: string;
        rating: number;
        review: string;
        product: {
            id: string;
            name: string;
            images: { url: string }[];
        };
        user: {
            name: string;
        };
    } | null;
    order: {
        id: string;
        createdAt: Date;
        coupon: string | null;
        user: { name: string };
        product: {
            id: string;
            name: string;
            images: { url: string }[];
        };
    } | null;
    isRead: boolean;
    isNew: boolean;
    createdAt: Date;
};

type NotificationStore = {
    notifyUnreadCount: number;
    notifications: Notification[] | null;
    fetchNotifyUnreadCount: (storeId: string) => Promise<void>;
    fetchNotifications: (storeId: string) => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set) => {
    return {
        notifyUnreadCount: 0,
        fetchNotifyUnreadCount: async (storeId: string) => {
            try {
                const data = await getUnreadNotificationStoreCount(storeId);
                set({ notifyUnreadCount: data });
            } catch (error) {
                console.error('Error fetching notifyUnreadCount:', error);
            }
        },
        notifications: [],
        fetchNotifications: async (storeId: string) => {
            try {
                const data = await getNotificationsStore(storeId);
                await cleanupExpiredNotificationsStore(storeId);
                set({ notifications: data });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        },
    };
});
