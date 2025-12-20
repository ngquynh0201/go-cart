'use client';

import { updateNotifyStoreNew } from '@/lib/actions/notification.action';
import { useNotificationStore } from '@/store/notificationStore';
import { Boxes, Stars } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface NotificationItemProps {
    id: string;
    orderId: string | undefined;
    type: 'ORDER' | 'RATING';
    username: string | undefined;
    nameRating: string | undefined;
    productName: string | undefined;
    time: string;
    productImage?: string;
    isNew: boolean;
    setShowNotifications: Dispatch<SetStateAction<boolean>>;
    storeId: string;
}

const iconMap = {
    ORDER: { Icon: Boxes, className: 'text-orange-500 bg-orange-100' },
    RATING: { Icon: Stars, className: 'text-yellow-500 bg-yellow-100' },
};

export default function NotificationItem({
    id,
    orderId,
    type,
    username,
    nameRating,
    productName,
    productImage,
    time,
    isNew,
    setShowNotifications,
    storeId,
}: NotificationItemProps) {
    const { fetchNotifications } = useNotificationStore();

    const router = useRouter();

    const { Icon, className } = iconMap[type];

    const messageMap = {
        ORDER: `Đơn hàng mới: "${orderId}"`,
        RATING: `Người dùng ${nameRating} đã đánh giá vào sản phẩm: "${productName}"`,
    };

    const handleNotifyNew = async (notifyId: string) => {
        const result = await updateNotifyStoreNew(notifyId, storeId);
        if (result.success) {
            fetchNotifications(storeId);
        } else {
            console.error(result.message || 'Cập nhật thông báo thất bại');
        }
    };

    const handleClick = () => {
        handleNotifyNew(id);
        // Navigate with hash for Store
        if (type === 'ORDER') {
            router.push('/store/orders');
        } else if (type === 'RATING') {
            router.push('/store');
        }
        setShowNotifications(false);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 p-3 hover:bg-gray-50 border-b last:border-b-0 last:rounded-b-lg ${
                isNew ? 'bg-indigo-50 hover:bg-indigo-50' : ''
            } cursor-pointer`}
        >
            {/* Icon */}
            <div className={`p-2 rounded-full ${className}`}>
                <Icon className="size-5" fill="currentColor" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                    <span className="font-semibold">{username}</span> {messageMap[type]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{time}</p>
            </div>

            {productImage && (
                <div className="ml-auto w-12 h-12 bg-gray-200 rounded-md shrink-0">
                    <Image src={productImage} alt="cover" width={48} height={48} className="object-cover size-12" />
                </div>
            )}
        </div>
    );
}
