'use client';

import { updateNotifyAdminNew } from '@/lib/actions/notification.action';
import { Boxes, LayoutList, Store } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface NotificationItemProps {
    id: string;
    orderId: string | undefined;
    type: 'STORE' | 'PRODUCT' | 'ORDER';
    username: string | undefined;
    userStorename: string | undefined;
    storeName: string | undefined;
    productName: string | undefined;
    coupon: string | null | undefined;
    isActive: boolean | undefined;
    status: string | undefined;
    time: string;
    productImage?: string;
    isNew: boolean;
    fetchNotifications: () => Promise<void>;
    setShowNotifications: Dispatch<SetStateAction<boolean>>;
}

const iconMap = {
    STORE: { Icon: Store, className: 'text-blue-500 bg-blue-100' },
    PRODUCT: { Icon: LayoutList, className: 'text-green-500 bg-green-100' },
    ORDER: { Icon: Boxes, className: 'text-orange-500 bg-orange-100' },
};

export default function NotificationItem({
    id,
    orderId,
    type,
    username,
    userStorename,
    storeName,
    productName,
    coupon,
    status,
    productImage,
    time,
    isNew,
    fetchNotifications,
    setShowNotifications,
}: NotificationItemProps) {
    const router = useRouter();

    const { Icon, className } = iconMap[type];

    const messageMap = {
        STORE: `Người dùng ${userStorename} đã tạo cửa hàng: "${storeName}"`,
        PRODUCT: `Cửa hàng ${storeName} đã thêm một sản phẩm mới: "${productName}"`,
        ORDER: `Người dùng ${username} đã sử dụng mã giảm giá ${coupon} cho đơn hàng: "${orderId}"`,
    };

    const handleNotifyNew = async (notifyId: string) => {
        const result = await updateNotifyAdminNew(notifyId);
        if (result.success) {
            fetchNotifications();
        } else {
            console.error(result.message || 'Cập nhật thất bại');
        }
    };

    const handleClick = () => {
        handleNotifyNew(id);
        // Navigate with hash for admin
        if (type === 'STORE') {
            if (status === 'approved') {
                router.push('/admin/stores');
            } else {
                router.push('/admin/approve');
            }
        } else if (type === 'ORDER') {
            router.push('/admin/coupons');
        } else {
            router.push('/admin/stores');
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
                <p className="text-sm text-gray-800">{messageMap[type]}</p>
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
