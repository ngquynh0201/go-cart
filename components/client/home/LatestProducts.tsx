'use client';

import { useProductStore } from '@/store/product';
import Title from '../helper/Title';
import ProductCard from '../helper/product/ProductCard';
import { useEffect } from 'react';

export default function LatestProducts() {
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const displayQuantity = 4;
    return (
        <div className="px-6 my-30 max-w-6xl mx-auto">
            <Title
                title="Sản phẩm mới nhất"
                description={`Hiển thị ${
                    products && products.length < displayQuantity ? products.length : displayQuantity
                } trong ${products && products.length} sản phẩm`}
                href="/shop"
            />
            <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
                {products &&
                    products
                        .slice()
                        .slice(0, displayQuantity)
                        .map((product, index) => <ProductCard key={index} product={product} />)}
            </div>
        </div>
    );
}
