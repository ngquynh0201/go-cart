'use server';

import prisma from '../prisma';

export const getUnreadNotificationAdminCount = async () => {
    try {
        const count = await prisma.notificationAdmin.count({
            where: {
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return 0;
    }
};

export const getUnreadNotificationStoreCount = async (storeId: string) => {
    try {
        const count = await prisma.notificationStore.count({
            where: {
                storeId,
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return 0;
    }
};

export const getNotificationsAdmin = async () => {
    try {
        const notifications = await prisma.notificationAdmin.findMany({
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: { select: { url: true } },
                        user: { select: { name: true } },
                        isActive: true,
                        status: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: { select: { url: true } },
                        store: { select: { id: true, name: true, logo: { select: { url: true } } } },
                    },
                },
                order: {
                    select: {
                        id: true,
                        createdAt: true,
                        coupon: true,
                        user: { select: { name: true } },
                        product: { select: { id: true, name: true, images: { select: { url: true } } } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const getNotificationsStore = async (storeId: string) => {
    try {
        const notifications = await prisma.notificationStore.findMany({
            where: { storeId },
            include: {
                rating: {
                    select: {
                        id: true,
                        rating: true,
                        review: true,
                        product: { select: { id: true, name: true, images: { select: { url: true } } } },
                        user: { select: { name: true } },
                    },
                },
                order: {
                    select: {
                        id: true,
                        createdAt: true,
                        coupon: true,
                        user: { select: { name: true } },
                        product: { select: { id: true, name: true, images: { select: { url: true } } } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markAllNotificationsAdminAsRead = async () => {
    try {
        await prisma.notificationAdmin.updateMany({
            where: {
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return { success: false };
    }
};

export const markAllNotificationsStoreAsRead = async (storeId: string) => {
    try {
        await prisma.notificationStore.updateMany({
            where: {
                storeId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return { success: false };
    }
};

export const cleanupExpiredNotificationsAdmin = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deletedCount = await prisma.notificationAdmin.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });

        console.log(`Deleted ${deletedCount.count} expired notifications`);
        return { success: true, deleted: deletedCount.count };
    } catch (error) {
        console.error('Error cleaning up expired notifications:', error);
        return { success: false };
    }
};

export const cleanupExpiredNotificationsStore = async (storeId: string) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deletedCount = await prisma.notificationStore.deleteMany({
            where: {
                storeId,
                createdAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });

        console.log(`Deleted ${deletedCount.count} expired notifications`);
        return { success: true, deleted: deletedCount.count };
    } catch (error) {
        console.error('Error cleaning up expired notifications:', error);
        return { success: false };
    }
};

// export const createNotification = async (
//     type: 'PRODUCT' | 'ORDER',
//     postId: string,
//     actorId: string,
//     recipientId: string,
//     commentId?: string,
//     replyCommentId?: string,
// ) => {
//     if (actorId === recipientId) return; // Don't notify self

//     try {
//         const data: any = {
//             type,
//             postId,
//             actorId,
//             recipientId,
//         };

//         if (type === 'COMMENT' && commentId) {
//             data.commentId = commentId;
//         }
//         if (type === 'COMMENT' && replyCommentId) {
//             data.replyCommentId = replyCommentId;
//         }

//         await prisma.notification.create({
//             data,
//         });
//     } catch (error) {
//         console.error('Error creating notification:', error);
//     }
// };

export const updateNotifyAdminNew = async (notifyId: string) => {
    try {
        const updatedNotify = await prisma.notificationAdmin.update({
            where: { id: notifyId },
            data: { isNew: false },
        });
        return { success: true, error: false, doctor: updatedNotify };
    } catch (error) {
        console.error('Error updating job visibility:', error);
        return { success: false, error: true, message: 'Failed to update job visibility' };
    }
};

export const updateNotifyStoreNew = async (notifyId: string, storeId: string) => {
    try {
        const updatedNotify = await prisma.notificationStore.update({
            where: { id: notifyId, storeId },
            data: { isNew: false },
        });
        return { success: true, error: false, doctor: updatedNotify };
    } catch (error) {
        console.error('Error updating job visibility:', error);
        return { success: false, error: true, message: 'Failed to update job visibility' };
    }
};
