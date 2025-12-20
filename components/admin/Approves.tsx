'use client';

import { useStoreUserStore } from '@/store/storeUser';
import StoreInfo from './helper/StoreInfo';
import { useEffect } from 'react';
import { updateStoreApproved, updateStoreRejected } from '@/lib/actions/store.action';
import toast from 'react-hot-toast';

export default function Approves() {
    const { stores, fetchStores } = useStoreUserStore();

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const handleApproved = async (storeId: string) => {
        const result = await updateStoreApproved(storeId);
        if (result.success) {
            toast.success('Duyệt cửa hàng thành công!');
            fetchStores();
        } else {
            toast.error(result.message || 'Duyệt thất bại');
        }
    };

    const handleRejected = async (storeId: string) => {
        const result = await updateStoreRejected(storeId);
        if (result.success) {
            toast.success('Từ chối cửa hàng thành công!');
            fetchStores();
        } else {
            toast.error(result.message || 'Từ chối thất bại');
        }
    };

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                Duyệt <span className="text-slate-800 font-medium">cửa hàng</span>
            </h1>

            {stores ? (
                stores.filter((str) => str.status === 'pending').length > 0 ? (
                    <div className="flex flex-col gap-4 mt-4">
                        {stores
                            .filter((str) => str.status === 'pending')
                            .map((store) => (
                                <div
                                    key={store.id}
                                    className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
                                >
                                    {/* Store Info */}
                                    <StoreInfo store={store} />

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2 flex-wrap">
                                        <button
                                            onClick={() => handleApproved(store.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Duyệt
                                        </button>
                                        <button
                                            onClick={() => handleRejected(store.id)}
                                            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80">
                        <h1 className="text-3xl text-slate-400 font-medium">Không có cửa hàng nào đang chờ xử lý</h1>
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Không có cửa hàng</h1>
                </div>
            )}
        </div>
    );
}
