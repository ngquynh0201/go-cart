'use client';

import { useStoreUserStore } from '@/store/storeUser';
import StoreInfo from './helper/StoreInfo';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteStoreById } from '@/lib/actions/store.action';
import { Trash2 } from 'lucide-react';

export default function Stores() {
    const { stores, fetchStores } = useStoreUserStore();
    const [isModalOpen, setIsModalOpen] = useState(''); // Lưu storeId cần xóa

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const closeModal = () => setIsModalOpen('');

    const confirmDelete = async () => {
        if (!isModalOpen) return;

        const result = await deleteStoreById(isModalOpen);
        if (result?.success) {
            toast.success('Xóa cửa hàng thành công!');
            fetchStores();
        } else {
            toast.error('Xóa cửa hàng thất bại');
        }
        closeModal();
    };

    // Lọc danh sách stores đã được duyệt
    const approvedStores = stores?.filter((str) => str.status === 'approved') || [];

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                <span className="text-slate-800 font-medium">Các cửa hàng</span> đang hoạt động
            </h1>

            {approvedStores.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                    {approvedStores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl relative"
                        >
                            <StoreInfo store={store} />

                            <button
                                onClick={() => setIsModalOpen(store.id)}
                                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Không tìm thấy cửa hàng</h1>
                </div>
            )}

            {/* MODAL ĐƯA RA NGOÀI VÒNG LẶP */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-999">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full mx-4">
                        <p className="font-heading text-lg text-center font-medium">
                            Bạn có chắc chắn muốn xóa cửa hàng này không?
                        </p>
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={closeModal}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                                onClick={confirmDelete}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
