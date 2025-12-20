'use client';

import { OrderStatus, updateOrderStatusByName } from '@/lib/actions/order.action';
import { currency, thousandSeparator } from '@/lib/utils';
import { assets } from '@/public/assets';
import { useCouponStore } from '@/store/coupon';
import { useOrderStore } from '@/store/order';
import { useStatusStore } from '@/store/status';
import { OrderType } from '@/types/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user';

export default function Orders() {
    const userId = Cookies.get('userId') || '';

    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const storeId = (users && users.find((user) => user.id === userId)?.store[0].id) || '';

    const { ordersByStore, fetchOrdersByStore } = useOrderStore();
    const { coupons, fetchCoupons } = useCouponStore();
    const { statuses, fetchStatuses } = useStatusStore();

    useEffect(() => {
        fetchOrdersByStore(storeId);
        fetchCoupons();
        fetchStatuses();
    }, [fetchOrdersByStore, fetchCoupons, fetchStatuses, storeId]);

    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (order: OrderType) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const handleStatusChange = async (orderId: string, statusName: string) => {
        try {
            const response = await updateOrderStatusByName(orderId, statusName as OrderStatus);
            if (response.success) {
                toast.success('Cập nhật trạng thái đơn hàng thành công');
                fetchOrdersByStore(storeId); // Làm mới danh sách đơn hàng
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'order placed':
                return 'Đã đặt hàng';
            case 'processing':
                return 'Đang xử lý';
            case 'shipped':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            default:
                return status;
        }
    };

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">
                <span className="text-slate-800 font-medium">Đơn hàng</span> của cửa hàng
            </h1>
            {ordersByStore && ordersByStore.length > 0 ? (
                <div className="overflow-x-auto max-w-5xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {[
                                    'Số thứ tự',
                                    'Khách hàng',
                                    'Tổng',
                                    'Thanh toán',
                                    'Mã giảm giá',
                                    'Trạng thái',
                                    'Ngày đặt',
                                ].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ordersByStore.map((order, index) => {
                                const price = order.product.offerPrice
                                    ? order.product.offerPrice
                                    : order.product.actualPrice;
                                const totalPrice = price * order.quantity;
                                const couponDiscount = coupons?.find((cp) => cp.code === order.coupon)?.discount || 0;
                                const total = (totalPrice - (couponDiscount / 100) * totalPrice).toFixed(0);

                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => openModal(order)}
                                    >
                                        <td className="pl-6 text-green-600">{index + 1}</td>
                                        <td className="px-4 py-3">{order.user.name}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {thousandSeparator(Number(total))} {currency}
                                        </td>
                                        <td className="px-4 py-3">{order.paymentMethod}</td>
                                        <td className="px-4 py-3">
                                            {order.isCouponUsed ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                    {order.coupon}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td
                                            className="px-4 py-3"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <select
                                                value={order.status.name}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 uppercase px-2 py-1 border outline-none"
                                            >
                                                {statuses &&
                                                    statuses.map((item) => (
                                                        <option key={item.id} value={item.name}>
                                                            {getStatusLabel(item.name)}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Không tìm thấy đơn hàng</p>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative"
                    >
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">Chi tiết đơn hàng</h2>

                        {/* Customer Details */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Chi tiết khách hàng</h3>
                            <p>
                                <span className="text-green-700">Tên:</span> {selectedOrder.user.name}
                            </p>
                            <p>
                                <span className="text-green-700">Địa chỉ email:</span> {selectedOrder.user.email}
                            </p>
                            <p>
                                <span className="text-green-700">Số điện thoại:</span>{' '}
                                {selectedOrder.user.addresses[0].phone}
                            </p>
                            <p>
                                <span className="text-green-700">Địa chỉ:</span>{' '}
                                {`${selectedOrder.user.addresses[0].street}, ${selectedOrder.user.addresses[0].city}, ${selectedOrder.user.addresses[0].state}, ${selectedOrder.user.addresses[0].zip}, ${selectedOrder.user.addresses[0].country}`}
                            </p>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Các sản phẩm</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 border border-slate-100 shadow rounded p-2">
                                    <Image
                                        src={
                                            selectedOrder.product.images.length > 0
                                                ? selectedOrder.product.images[0].url
                                                : assets.product_img1
                                        }
                                        alt={selectedOrder.product.name}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="text-slate-800">{selectedOrder.product.name}</p>
                                        <p>Số lượng: {selectedOrder.quantity}</p>
                                        <p>
                                            Giá:
                                            {selectedOrder.product.offerPrice
                                                ? selectedOrder.product.offerPrice
                                                : selectedOrder.product.actualPrice}{' '}
                                            {currency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-4">
                            <p>
                                <span className="text-green-700">Phương thức thanh toán:</span>{' '}
                                {selectedOrder.paymentMethod}
                            </p>
                            <p>
                                <span className="text-green-700">Đã thanh toán:</span>{' '}
                                {selectedOrder.isPaid ? 'Rồi' : 'Chưa'}
                            </p>
                            {selectedOrder.isCouponUsed && (
                                <p>
                                    <span className="text-green-700">Mã giảm giá:</span> {selectedOrder.coupon} (
                                    {coupons?.find((cp) => cp.code === selectedOrder.coupon)?.discount}% giảm giá)
                                </p>
                            )}
                            <p>
                                <span className="text-green-700">Trạng thái:</span>{' '}
                                {getStatusLabel(selectedOrder.status.name)}
                            </p>
                            <p>
                                <span className="text-green-700">Ngày đặt hàng:</span>{' '}
                                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
