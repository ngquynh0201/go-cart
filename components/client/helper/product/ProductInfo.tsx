'use client';

import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { currency, thousandSeparator } from '@/lib/utils';
import { ProductType } from '@/types/types';
import Counter from '../cart/Counter';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useCartStore } from '@/store/cart';

export default function ProductInfo({ product }: { product: ProductType }) {
    const [mainImage, setMainImage] = useState(product.images[0].url);

    const averageRating =
        product.ratings && product.ratings.reduce((acc, item) => acc + item.rating, 0) / product.ratings.length;

    const router = useRouter();
    const { handleAddToCart } = useStore();

    const userId = Cookies.get('userId') || '';

    const { cartItemAmount, fetchCartItemAmount } = useCartStore();

    useEffect(() => {
        fetchCartItemAmount(userId, product.id);
    }, [fetchCartItemAmount, userId, product.id]);

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setMainImage(product.images[index].url)}
                            className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
                        >
                            <Image
                                src={image.url}
                                className="group-hover:scale-103 group-active:scale-95 transition"
                                alt=""
                                width={45}
                                height={45}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className="flex items-center mt-2">
                    {Array(5)
                        .fill('')
                        .map((_, index) => (
                            <StarIcon
                                key={index}
                                size={14}
                                className="text-transparent mt-0.5"
                                fill={averageRating >= index + 1 ? '#00C950' : '#D1D5DB'}
                            />
                        ))}
                    <p className="text-sm ml-3 text-slate-500">{product.ratings.length} Đánh giá</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    {product.offerPrice && (
                        <p>
                            {thousandSeparator(product.offerPrice)} {currency}
                        </p>
                    )}
                    {product.offerPrice && (
                        <p className="text-xl text-slate-500 line-through">
                            {thousandSeparator(product.actualPrice)} {currency}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    {product.offerPrice && (
                        <p>
                            Tiết kiệm{' '}
                            {(((product.actualPrice - product.offerPrice) / product.offerPrice) * 100).toFixed(0)}% ngay
                            bây giờ
                        </p>
                    )}
                </div>
                <div className="flex items-end gap-5 mt-10">
                    {cartItemAmount && cartItemAmount.quantity > 0 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-lg text-slate-800 font-semibold">Số lượng</p>
                            <Counter productId={product.id} />
                        </div>
                    )}
                    <button
                        onClick={() => {
                            if (cartItemAmount && cartItemAmount.quantity > 0) {
                                router.push('/cart');
                            } else {
                                handleAddToCart(product.id);
                            }
                        }}
                        className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
                    >
                        {cartItemAmount && cartItemAmount.quantity > 0 ? 'Xem giỏ hàng' : 'Thêm vào giỏ hàng'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3">
                        {' '}
                        <EarthIcon className="text-slate-400" /> Miễn phí vận chuyển trên toàn thế giới{' '}
                    </p>
                    <p className="flex gap-3">
                        {' '}
                        <CreditCardIcon className="text-slate-400" /> Thanh toán bảo đảm 100%{' '}
                    </p>
                    <p className="flex gap-3">
                        {' '}
                        <UserIcon className="text-slate-400" /> Được tin cậy bởi các thương hiệu hàng đầu{' '}
                    </p>
                </div>
            </div>
        </div>
    );
}
