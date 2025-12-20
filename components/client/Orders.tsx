'use client';

import { useEffect } from 'react';
import PageTitle from './helper/PageTitle';
import OrderItem from './helper/order/OrderItem';
import { useOrderStore } from '@/store/order';

export default function Orders() {
    const { userOrders, fetchUserOrders } = useOrderStore();

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    return (
        <div className="min-h-[70vh] mx-6">
            {userOrders && userOrders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle
                        heading="Đơn hàng của tôi"
                        text={`Hiển thị tổng ${userOrders.length} đơn hàng`}
                        linkText={'Trở về trang chủ'}
                    />

                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Sản phẩm</th>
                                <th className="text-center">Tổng giá</th>
                                <th className="text-left">Địa chỉ</th>
                                <th className="text-left">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map((order) => (
                                <OrderItem order={order} key={order.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Bạn không có đơn hàng nào</h1>
                </div>
            )}
        </div>
    );
}
