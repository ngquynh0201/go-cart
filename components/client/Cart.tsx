'use client';

import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import PageTitle from './helper/PageTitle';
import { assets } from '@/public/assets';
import { currency, thousandSeparator } from '@/lib/utils';
import Counter from './helper/cart/Counter';
import OrderSummary from './helper/cart/OrderSummary';
import { useCartStore } from '@/store/cart';
import { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

export default function Cart() {
    const { cartItems, fetchCartItems } = useCartStore();

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const { handleRemoveFromCart, cartTotal, updateCart } = useStore();

    return cartItems && cartItems.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="Giỏ hàng của tôi" text="các mặt hàng trong giỏ hàng của bạn" linkText="Thêm nữa" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">
                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Tổng giá</th>
                                <th className="max-md:hidden">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index} className="space-x-2">
                                    <td className="flex gap-3 my-4">
                                        <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                            <Image
                                                src={
                                                    item.product.images.length > 0
                                                        ? item.product.images[0].url
                                                        : assets.product_img1
                                                }
                                                className="h-14 w-auto"
                                                alt=""
                                                width={45}
                                                height={45}
                                            />
                                        </div>
                                        <div>
                                            <p className="max-sm:text-sm">{item.product.name}</p>
                                            <p className="text-xs text-slate-500">{item.product.category.name}</p>
                                            <p>
                                                {item.product.offerPrice
                                                    ? thousandSeparator(item.product.offerPrice)
                                                    : thousandSeparator(item.product.actualPrice)}{' '}
                                                {currency}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <Counter productId={item.product.id} quantity={item.quantity} />
                                    </td>
                                    <td className="text-center">
                                        {item.product.offerPrice
                                            ? (item.product.offerPrice * item.quantity).toLocaleString()
                                            : (item.product.actualPrice * item.quantity).toLocaleString()}{' '}
                                        {currency}
                                    </td>
                                    <td className="text-center max-md:hidden">
                                        <button
                                            onClick={() => handleRemoveFromCart(item.product.id)}
                                            className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                                        >
                                            <Trash2Icon size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <OrderSummary items={cartItems} updateCart={updateCart} totalPrice={cartTotal} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Giỏ hàng của bạn đang trống</h1>
        </div>
    );
}
