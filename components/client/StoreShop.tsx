'use client';

import { MailIcon, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import ProductCard from './helper/product/ProductCard';
import { useStoreProductStore } from '@/store/storeProduct';
import { useEffect } from 'react';
import { assets } from '@/public/assets';

export default function StoreShop({ username }: { username: string }) {
    const { stores, fetchStores } = useStoreProductStore();

    useEffect(() => {
        fetchStores(username);
    }, [fetchStores, username]);

    return (
        <div className="min-h-[70vh] mx-6">
            {/* Store Info Banner */}
            {stores && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <Image
                        src={stores[0]?.logo.length > 0 ? stores[0].logo[0].url : assets.gs_logo}
                        alt={stores[0]?.name}
                        className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
                        width={200}
                        height={200}
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-slate-800">{stores[0]?.name}</h1>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">{stores[0]?.description}</p>
                        <div className="text-xs text-slate-500 mt-4 space-y-1"></div>
                        <div className="space-y-2 text-sm text-slate-500">
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{stores[0]?.address}</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{stores[0]?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className=" max-w-7xl mx-auto mb-40">
                <h1 className="text-2xl mt-12">
                    Cứa hàng <span className="text-slate-800 font-medium">sản phẩm</span>
                </h1>
                <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                    {stores && stores[0]?.products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    );
}
