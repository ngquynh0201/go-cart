'use client';

import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationModal from '../helper/NotificationModal';
import { useNotificationStore } from '@/store/notificationAdmin';

export default function AdminNavbar() {
    const { notifyUnreadCount, fetchNotifyUnreadCount } = useNotificationStore();

    useEffect(() => {
        fetchNotifyUnreadCount();
    }, [fetchNotifyUnreadCount]);

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
                <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                    <span className="text-green-600">go</span>cart
                    <span className="text-green-600 text-5xl leading-0">.</span>
                    <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                        Admin
                    </p>
                </Link>
                <div className="flex items-center gap-3">
                    <p>Hi, Quản trị viên</p>
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
            {showNotifications && (
                <NotificationModal
                    setShowNotifications={setShowNotifications}
                    fetchNotifyUnreadCount={fetchNotifyUnreadCount}
                />
            )}
        </>
    );
}
