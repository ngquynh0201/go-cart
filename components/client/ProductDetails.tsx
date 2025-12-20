import ProductInfo from './helper/product/ProductInfo';
import ProductDescription from './helper/product/ProductDescription';
import { ProductType } from '@/types/types';
import Link from 'next/link';

export default function ProductDetails({ product }: { id: string; product: ProductType | null }) {
    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    <Link href={'/'} className="underline">
                        Trang chủ
                    </Link>{' '}
                    /{' '}
                    <Link href={'/shop'} className="underline">
                        Sản phẩm
                    </Link>{' '}
                    / {product?.category.name}
                </div>

                {/* Product info */}
                {product && <ProductInfo product={product} />}

                {/* Description & Reviews */}
                {product && <ProductDescription product={product} />}
            </div>
        </div>
    );
}
