'use client';

import { currency, thousandSeparator } from '@/lib/utils';
import { assets } from '@/public/assets';
import { ProductType } from '@/types/types';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: ProductType }) {
    // calculate the average rating of the product
    const rating =
        product.ratings &&
        Math.round(product.ratings.reduce((acc, curr) => acc + curr.rating, 0) / product.ratings.length);

    return (
        <Link href={`/product/${product.id}`} className="group max-xl:mx-auto">
            <div className="bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center">
                <Image
                    src={product.images.length > 0 ? product.images[0].url : assets.product_img1}
                    width={500}
                    height={500}
                    className="max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300"
                    alt=""
                />
            </div>
            <div className="flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60">
                <div>
                    <p>{product.name}</p>
                    <div className="flex">
                        {Array(5)
                            .fill('')
                            .map((_, index) => (
                                <StarIcon
                                    key={index}
                                    size={14}
                                    className="text-transparent mt-0.5"
                                    fill={rating >= index + 1 ? '#00C950' : '#D1D5DB'}
                                />
                            ))}
                    </div>
                </div>
                <p>
                    {product.offerPrice
                        ? thousandSeparator(product.offerPrice)
                        : thousandSeparator(product.actualPrice)}{' '}
                    {currency}
                </p>
            </div>
        </Link>
    );
}
