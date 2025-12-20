'use client';

import { useNotificationStore } from '@/store/notificationStore';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationModal from '../helper/NotificationModal';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user';

export default function StoreNavbar() {
    const userId = Cookies.get('userId') || '';

    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const storeId = (users && users.find((user) => user.id === userId)?.store[0].id) || '';

    const { notifyUnreadCount, fetchNotifyUnreadCount } = useNotificationStore();

    useEffect(() => {
        fetchNotifyUnreadCount(storeId);
    }, [fetchNotifyUnreadCount, storeId]);

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
                <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                    <span className="text-green-600">go</span>cart
                    <span className="text-green-600 text-5xl leading-0">.</span>
                    <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                        Store
                    </p>
                </Link>
                <div className="flex items-center gap-3">
                    <p>Hi, Người bán</p>
                    <div
                        onClick={() => setShowNotifications(true)}
                        className="relative size-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        <BellIcon className="size-5" />
                        {notifyUnreadCount > 0 && (
                            <span className="absolute -top-1 -right-1.5 bg-indigo-500 text-white size-4 flex items-center justify-center rounded-full text-[9px]">
                                {notifyUnreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {/* notification modal */}
            {showNotifications && <NotificationModal setShowNotifications={setShowNotifications} storeId={storeId} />}
        </>
    );
}
