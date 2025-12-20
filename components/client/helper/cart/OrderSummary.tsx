'use client';

import { useEffect, useState } from 'react';
import { CartType, CouponType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getUserIdFromCookie } from '@/lib/auth';
import toast from 'react-hot-toast';
import { createOrder } from '@/lib/actions/order.action';
import { currency, thousandSeparator } from '@/lib/utils';
import { useAddressStore } from '@/store/address';
import Link from 'next/link';
import { useCouponStore } from '@/store/coupon';
import { XIcon } from 'lucide-react';
import { useOrderStore } from '@/store/order';

interface OrderSummaryProps {
    items: CartType[];
    updateCart: () => Promise<void>;
    totalPrice: number;
}

export default function OrderSummary({ updateCart, totalPrice }: OrderSummaryProps) {
    const { address, fetchAddress } = useAddressStore();
    const { coupons, fetchCoupons } = useCouponStore();
    const { userOrders, fetchUserOrders } = useOrderStore();

    useEffect(() => {
        fetchAddress();
        fetchCoupons();
        fetchUserOrders();
    }, [fetchAddress, fetchCoupons, fetchUserOrders]);

    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE'>('COD');
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState<CouponType | null>(null);

    const handleApplyCoupon = () => {
        if (!couponCodeInput.trim()) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }

        const foundCoupon = coupons?.find((cp) => cp.code === couponCodeInput.trim());

        if (!foundCoupon) {
            toast.error('Mã giảm giá không hợp lệ');
            return;
        }

        const isAlreadyUsed = userOrders?.some((order) => order.coupon === couponCodeInput.trim());

        if (isAlreadyUsed) {
            toast.error('Mã giảm giá đã được sử dụng');
            return;
        }

        setCoupon(foundCoupon);
        toast.success('Sử dụng mã giảm giá thành công!!');
        setCouponCodeInput('');
    };

    const handleOrder = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const userId = await getUserIdFromCookie();
        if (!userId) {
            toast.error('Vui lòng đăng nhập để đặt hàng');
            setIsProcessing(false);
            return;
        }

        if (!address) {
            toast.error('Vui lòng thêm địa chỉ giao hàng trước');
            setIsProcessing(false);
            return;
        }

        try {
            const response = await createOrder(userId, paymentMethod, coupon);
            if (response.success) {
                toast.success('Đặt hàng thành công!!');
                await updateCart();
                router.push('/orders');
            } else {
                toast.error(response.message || 'Đặt hàng thất bại');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('Đã xảy ra lỗi khi xử lý đơn hàng');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
            <h2 className="text-xl font-medium text-slate-600">Tóm tắt thanh toán</h2>
            <p className="text-slate-400 text-xs my-4">Phương thức thanh toán</p>
            <div className="flex gap-2 items-center">
                <input
                    type="radio"
                    id="COD"
                    onChange={() => setPaymentMethod('COD')}
                    checked={paymentMethod === 'COD'}
                    className="accent-gray-500"
                />
                <label htmlFor="COD" className="cursor-pointer">
                    COD
                </label>
            </div>
            <div className="flex gap-2 items-center mt-1">
                <input
                    type="radio"
                    id="STRIPE"
                    name="payment"
                    onChange={() => setPaymentMethod('STRIPE')}
                    checked={paymentMethod === 'STRIPE'}
                    className="accent-gray-500"
                />
                <label htmlFor="STRIPE" className="cursor-pointer">
                    Phương thức Stripe
                </label>
            </div>
            <div className="mt-2">
                <p className="text-slate-400 text-xs my-4">Địa chỉ giao hàng</p>
                <div className="relative flex justify-between items-start mt-2">
                    {address ? (
                        <>
                            <p className="text-gray-500">
                                {address.city}, {address.street}, {address.country}
                            </p>
                            <Link
                                href={`/change-address/${address.id}`}
                                className="text-green-500 hover:underline cursor-pointer"
                            >
                                Thay đổi
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500">Không tìm thấy địa chỉ</p>
                            <Link href={'/add-address'} className="text-green-500 hover:underline cursor-pointer">
                                Thêm
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <hr className="border-gray-300 my-2" />
            <div className="pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1 text-slate-400">
                        <p>Tổng phụ:</p>
                        <p>Vận chuyển:</p>
                        {coupon && <p>Mã giảm giá:</p>}
                    </div>
                    <div className="flex flex-col gap-1 font-medium text-right">
                        <p>
                            {totalPrice.toLocaleString()} {currency}
                        </p>
                        <p>Miễn phí</p>
                        {coupon && (
                            <p>{`- ${thousandSeparator(
                                Number(((coupon.discount / 100) * totalPrice).toFixed(0)),
                            )} ${currency}`}</p>
                        )}
                    </div>
                </div>
                {!coupon ? (
                    <form className="flex justify-center gap-3 mt-3">
                        <input
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                            value={couponCodeInput}
                            type="text"
                            placeholder="Mã giảm giá"
                            className="border border-slate-400 p-1.5 rounded w-full outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="bg-slate-600 text-white px-4 text-nowrap rounded hover:bg-slate-800 active:scale-95 transition-all"
                        >
                            Áp dụng
                        </button>
                    </form>
                ) : (
                    <div className="w-full flex items-center justify-between gap-2 text-sm mt-2">
                        <p>
                            Mã: <span className="font-semibold ml-1">{coupon.code.toUpperCase()}</span>
                        </p>
                        {/* <p>{coupon.description}</p> */}
                        <XIcon
                            size={18}
                            onClick={() => setCoupon(null)}
                            className="hover:text-red-700 transition cursor-pointer"
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-between py-4">
                <p>Tổng:</p>
                <p className="font-medium text-right">
                    {coupon
                        ? thousandSeparator(Number((totalPrice - (coupon.discount / 100) * totalPrice).toFixed(0)))
                        : totalPrice.toLocaleString()}{' '}
                    {currency}
                </p>
            </div>
            <button
                onClick={handleOrder}
                disabled={isProcessing}
                className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-80"
            >
                Đặt hàng
            </button>
        </div>
    );
}
