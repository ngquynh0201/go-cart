'use client';

import { currency, formatFullDateVn, thousandSeparator } from '@/lib/utils';
import { assets } from '@/public/assets';
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useRatingStore } from '@/store/rating';

export default function Dashboard() {
    const userId = Cookies.get('userId') || '';

    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const storeId = (users && users.find((user) => user.id === userId)?.store[0].id) || '';

    const {
        productCount,
        revenue,
        orderCount,
        ratingCount,
        fetchProductCount,
        fetchRevenue,
        fetchOrderCount,
        fetchRatingCount,
    } = useDashboardStore();
    const { ratingsByStore, fetchRatingsByStore } = useRatingStore();

    useEffect(() => {
        fetchProductCount(storeId);
        fetchRevenue(storeId);
        fetchOrderCount(storeId);
        fetchRatingCount(storeId);
        fetchRatingsByStore(storeId);
    }, [fetchProductCount, fetchRevenue, fetchOrderCount, fetchRatingCount, fetchRatingsByStore, storeId]);

    const router = useRouter();

    const dashboardCardsData = [
        { title: 'Tổng sản phẩm', value: productCount, icon: ShoppingBasketIcon },
        {
            title: 'Tổng thu nhập',
            value: `${thousandSeparator(revenue)} ${currency}`,
            icon: CircleDollarSignIcon,
        },
        { title: 'Tổng đơn hàng', value: orderCount, icon: TagsIcon },
        { title: 'Tổng đánh giá', value: ratingCount, icon: StarIcon },
    ];

    return (
        <div className=" text-slate-500 mb-28">
            <h1 className="text-2xl">
                Trang tổng quan <span className="text-slate-800 font-medium">người bán</span>
            </h1>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg">
                        <div className="flex flex-col gap-3 text-xs">
                            <p>{card.title}</p>
                            <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                        </div>
                        <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>
                ))}
            </div>

            <h2>Các đánh giá</h2>

            <div className="mt-5">
                {ratingsByStore && ratingsByStore.length > 0 ? (
                    ratingsByStore.map((review) => (
                        <div
                            key={review.id}
                            className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl"
                        >
                            <div>
                                <div className="flex gap-3">
                                    <Image
                                        src={assets.profile_pic1}
                                        alt=""
                                        className="w-10 aspect-square rounded-full"
                                        width={100}
                                        height={100}
                                    />
                                    <div>
                                        <p className="font-medium">{review.user.name}</p>
                                        <p className="font-light text-slate-500">
                                            {formatFullDateVn(String(review.createdAt))}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3 text-slate-500 max-w-xs leading-6">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-slate-400">{review.product.category.name}</p>
                                    <p className="font-medium">{review.product?.name}</p>
                                    <div className="flex items-center">
                                        {Array(5)
                                            .fill('')
                                            .map((_, index) => (
                                                <StarIcon
                                                    key={index}
                                                    size={17}
                                                    className="text-transparent mt-0.5"
                                                    fill={review.rating >= index + 1 ? '#00C950' : '#D1D5DB'}
                                                />
                                            ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/product/${review.product.id}`)}
                                    className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all"
                                >
                                    Xem sản phẩm
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Không tìm thấy đánh giá</div>
                )}
            </div>
        </div>
    );
}
