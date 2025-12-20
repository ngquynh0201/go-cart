'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './helper/product/ProductCard';
import { MoveLeftIcon } from 'lucide-react';
import { useProductStore } from '@/store/product';
import { useEffect } from 'react';
import { useCategoryStore } from '@/store/category';

export default function Shop() {
    // get query params ?search=abc&category=Electronics
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const categoryParam = searchParams.get('category');

    const { products, fetchProducts } = useProductStore();
    const { category, fetchCategory } = useCategoryStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (categoryParam) {
            fetchCategory(categoryParam);
        }
    }, [fetchCategory, categoryParam]);

    const router = useRouter();

    const filteredProducts =
        products?.filter((product) => {
            const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !categoryParam || product.category.id === categoryParam;
            return matchesSearch && matchesCategory;
        }) || [];

    const hasFilters = search || categoryParam;
    const title = hasFilters
        ? `${search ? `Tìm kiếm: ${search}` : ''}${search && categoryParam ? ' trong ' : ''}${
              categoryParam ? `Danh mục: ${category?.name}` : ''
          }`
        : 'Tất cả';

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                >
                    {hasFilters && <MoveLeftIcon size={20} />} {title}{' '}
                    {!hasFilters && <span className="text-slate-700 font-medium">sản phẩm</span>}
                </h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts &&
                        filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    );
}
