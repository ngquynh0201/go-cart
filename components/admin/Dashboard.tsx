'use client';

import { currency, thousandSeparator } from '@/lib/utils';
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from 'lucide-react';
import OrdersAreaChart from './helper/OrdersAreaChart';
import { useDashboardStore } from '@/store/dashboardAdmin';
import { useEffect } from 'react';
import { useOrderStore } from '@/store/order';

export default function Dashboard() {
    const {
        productCount,
        revenue,
        orderCount,
        storeCount,
        fetchProductCount,
        fetchRevenue,
        fetchOrderCount,
        fetchStoreCount,
    } = useDashboardStore();
    const { orders, fetchOrders } = useOrderStore();

    useEffect(() => {
        fetchProductCount();
        fetchRevenue();
        fetchOrderCount();
        fetchStoreCount();
        fetchOrders();
    }, [fetchProductCount, fetchRevenue, fetchOrderCount, fetchStoreCount, fetchOrders]);

    const dashboardCardsData = [
        { title: 'Total Products', value: productCount, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: `${thousandSeparator(revenue)} ${currency}`, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: orderCount, icon: TagsIcon },
        { title: 'Total Stores', value: storeCount, icon: StoreIcon },
    ];

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">
                <span className="text-slate-800 font-medium">Trang tổng quan</span> quản trị viên
            </h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                        <div className="flex flex-col gap-3 text-xs">
                            <p>{card.title}</p>
                            <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                        </div>
                        <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Area Chart */}
            <OrdersAreaChart allOrders={orders} />
        </div>
    );
}
