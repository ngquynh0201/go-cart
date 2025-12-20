'use client';

import { useStoreUserStore } from '@/store/storeUser';
import StoreInfo from './helper/StoreInfo';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateStoreActive } from '@/lib/actions/store.action';

export default function Stores() {
    const { stores, fetchStores } = useStoreUserStore();

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const handleActiveChange = async (storeId: string, active: boolean) => {
        const result = await updateStoreActive(storeId, active);
        if (result.success) {
            toast.success('Cập nhật hoạt động thành công!');
            fetchStores();
        } else {
            toast.error(result.message || 'Cập nhật thất bại');
        }
    };

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                <span className="text-slate-800 font-medium">Các cửa hàng</span> đang hoạt động
            </h1>

            {stores ? (
                stores.filter((str) => str.status === 'approved') ? (
                    <div className="flex flex-col gap-4 mt-4">
                        {stores
                            .filter((str) => str.status === 'approved')
                            .map((store) => (
                                <div
                                    key={store.id}
                                    className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
                                >
                                    {/* Store Info */}
                                    <StoreInfo store={store} />

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                                        <p>Hoạt động</p>
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={store.isActive}
                                                onChange={(e) => handleActiveChange(store.id, e.target.checked)}
                                            />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80">
                        <h1 className="text-3xl text-slate-400 font-medium">Không có sẵn các cửa hàng</h1>
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Không tìm thấy cửa hàng</h1>
                </div>
            )}
        </div>
    );
}
