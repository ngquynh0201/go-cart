'use client';

import Image from 'next/image';
import { DotIcon } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import RatingModal from './RatingModal';
import { currency, thousandSeparator } from '@/lib/utils';
import { OrderType } from '@/types/types';
import { assets } from '@/public/assets';
import Rating from './Rating';
import { useCouponStore } from '@/store/coupon';
import { getRatingProduct } from '@/lib/actions/rating.action';

const OrderItem = ({ order }: { order: OrderType }) => {
    const { coupons, fetchCoupons } = useCouponStore();

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const [ratingModal, setRatingModal] = useState(false);
    const [currentRating, setCurrentRating] = useState(0);

    const price = order.product.offerPrice ? order.product.offerPrice : order.product.actualPrice;
    const totalPrice = price * order.quantity;
    const couponDiscount = coupons?.find((cp) => cp.code === order.coupon)?.discount || 0;

    const fetchRating = useCallback(async () => {
        try {
            const rating = await getRatingProduct(order.user.id, order.product.id);
            setCurrentRating(rating || 0);
        } catch (error) {
            console.log(error);
        }
    }, [order.user.id, order.product.id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRating();
    }, [order.user.id, order.product.id, fetchRating]);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                <Image
                                    className="h-14 w-auto"
                                    src={
                                        order.product.images.length > 0
                                            ? order.product.images[0].url
                                            : assets.product_img1
                                    }
                                    alt="product_img"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="flex flex-col justify-center text-sm">
                                <p className="font-medium text-slate-600 text-base">{order.product.name}</p>
                                <p>
                                    {order.product.offerPrice
                                        ? thousandSeparator(order.product.offerPrice)
                                        : thousandSeparator(order.product.actualPrice)}{' '}
                                    {currency} - Số lượng : {order.quantity}{' '}
                                </p>
                                <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                <div>
                                    {currentRating ? (
                                        <Rating value={currentRating} />
                                    ) : (
                                        <button
                                            onClick={() => setRatingModal(true)}
                                            className={`text-green-500 hover:bg-green-50 transition ${
                                                order.status.name !== 'delivered' && 'hidden'
                                            }`}
                                        >
                                            Đánh giá
                                        </button>
                                    )}
                                    {ratingModal && (
                                        <RatingModal
                                            userId={order.user.id}
                                            productId={order.product.id}
                                            ratingModal={ratingModal}
                                            setRatingModal={setRatingModal}
                                            fetchRating={fetchRating}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </td>

                <td className="text-center max-md:hidden">
                    {thousandSeparator(Number((totalPrice - (couponDiscount / 100) * totalPrice).toFixed(0)))}{' '}
                    {currency}
                </td>

                <td className="text-left max-md:hidden">
                    <p>
                        {order.user.addresses[0].firstName}, {order.user.addresses[0].street},
                    </p>
                    <p>
                        {order.user.addresses[0].city}, {order.user.addresses[0].state}, {order.user.addresses[0].zip},{' '}
                        {order.user.addresses[0].country},
                    </p>
                    <p>{order.user.addresses[0].phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 ${
                            order.status.name === 'processing'
                                ? 'text-yellow-500 bg-yellow-100'
                                : order.status.name === 'delivered'
                                ? 'text-green-500 bg-green-100'
                                : 'text-slate-500 bg-slate-100'
                        }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {/* {order.status.name.split('_').join(' ').toLowerCase()} */}
                        {order.status.name}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>
                        {order.user.addresses[0].firstName}, {order.user.addresses[0].street}
                    </p>
                    <p>
                        {order.user.addresses[0].city}, {order.user.addresses[0].state}, {order.user.addresses[0].zip},{' '}
                        {order.user.addresses[0].country}
                    </p>
                    <p>{order.user.addresses[0].phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className="text-center mx-auto px-6 py-1.5 rounded bg-green-100 text-green-700">
                            {/* {order.status.replace(/_/g, ' ').toLowerCase()} */}
                            {order.status.name}
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    );
};

export default OrderItem;
