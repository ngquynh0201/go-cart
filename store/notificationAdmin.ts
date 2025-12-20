import { create } from 'zustand';
import {
    cleanupExpiredNotificationsAdmin,
    getNotificationsAdmin,
    getUnreadNotificationAdminCount,
} from '@/lib/actions/notification.action';

type Notification = {
    id: string;
    type: 'STORE' | 'PRODUCT' | 'ORDER';
    store: {
        id: string;
        name: string;
        logo: { url: string }[];
        user: { name: string };
        isActive: boolean;
        status: string;
    } | null;
    product: {
        id: string;
        name: string;
        images: { url: string }[];
        store: { name: string; logo: { url: string }[] };
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
    fetchNotifyUnreadCount: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set) => {
    return {
        notifyUnreadCount: 0,
        fetchNotifyUnreadCount: async () => {
            try {
                const data = await getUnreadNotificationAdminCount();
                set({ notifyUnreadCount: data });
            } catch (error) {
                console.error('Error fetching notifyUnreadCount:', error);
            }
        },
        notifications: [],
        fetchNotifications: async () => {
            try {
                const data = await getNotificationsAdmin();
                await cleanupExpiredNotificationsAdmin();
                set({ notifications: data });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        },
    };
});
