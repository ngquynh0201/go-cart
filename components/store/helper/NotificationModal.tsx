'use client';

import { Loader, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import moment from 'moment';
import { useNotificationStore } from '@/store/notificationStore';
import { markAllNotificationsStoreAsRead } from '@/lib/actions/notification.action';

export default function NotificationModal({
    setShowNotifications,
    storeId,
}: {
    setShowNotifications: Dispatch<SetStateAction<boolean>>;
    storeId: string;
}) {
    const { notifications, fetchNotifications, fetchNotifyUnreadCount } = useNotificationStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        try {
            fetchNotifications(storeId);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchNotifications, storeId]);

    useEffect(() => {
        // Ensure userId exists before calling
        const markAsRead = async () => {
            const result = await markAllNotificationsStoreAsRead(storeId);
            if (result.success) {
                // Refetch after marking to update UI
                fetchNotifications(storeId);
                fetchNotifyUnreadCount(storeId);
            }
        };

        markAsRead();
    }, [fetchNotifications, fetchNotifyUnreadCount, storeId]);

    if (isLoading) return <Loader />;

    return (
        <>
            <div className="fixed bg-black/50 top-0 left-0 right-0 bottom-0 flex items-center justify-center z-99999">
                <div className="bg-white w-full max-w-md rounded-lg relative shadow-2xl">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
                        <XIcon
                            onClick={() => setShowNotifications(false)}
                            size={20}
                            className="text-gray-500 hover:text-gray-800 cursor-pointer"
                        />
                    </div>
                    {/* List of Notifications */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    id={notification.id}
                                    orderId={notification.order?.id}
                                    type={notification.type}
                                    username={notification.order?.user.name}
                                    nameRating={notification.rating?.user.name}
                                    productName={notification.rating?.product.name}
                                    productImage={notification.rating?.product.images[0].url}
                                    time={moment(notification.createdAt).fromNow()}
                                    isNew={notification.isNew}
                                    setShowNotifications={setShowNotifications}
                                    storeId={storeId}
                                />
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">Bạn không có thông báo nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
