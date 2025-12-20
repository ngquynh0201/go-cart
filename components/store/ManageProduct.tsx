'use client';

import Image from 'next/image';
import { currency, thousandSeparator } from '@/lib/utils';
import { useProductStore } from '@/store/product';
import { useEffect } from 'react';
import { assets } from '@/public/assets';
import { deleteProductById } from '@/lib/actions/product.action';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManageProducts() {
    const userId = Cookies.get('userId') || '';

    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const storeId = (users && users.find((user) => user.id === userId)?.store[0].id) || '';
    const router = useRouter();

    const { productsByStore, fetchProductsByStore } = useProductStore();

    useEffect(() => {
        fetchProductsByStore(storeId);
    }, [fetchProductsByStore, storeId]);

    const handleDelete = async (productId: string) => {
        const result = await deleteProductById(productId);
        if (result?.success) {
            toast.success('Xóa sản phẩm thành công!');
            fetchProductsByStore(storeId);
        } else {
            toast.error('Xóa thất bại');
        }
    };

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">
                Quản lý <span className="text-slate-800 font-medium">sản phẩm</span>
            </h1>
            <table className="w-full max-w-5xl text-left ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Tên & Hình ảnh</th>
                        <th className="px-4 py-3 hidden md:table-cell">Mô tả</th>
                        <th className="px-4 py-3 hidden md:table-cell">Giá thực tế</th>
                        <th className="px-4 py-3">Giá ưu đãi</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3">Nút</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {productsByStore &&
                        productsByStore.map((product) => (
                            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            width={40}
                                            height={40}
                                            className="p-1 shadow rounded cursor-pointer"
                                            src={
                                                product.images.length > 0 ? product.images[0].url : assets.product_img1
                                            }
                                            alt=""
                                        />
                                        {product.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                                    {product.description}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {thousandSeparator(product.actualPrice)} {currency}
                                </td>
                                <td className="px-4 py-3">
                                    {product.offerPrice
                                        ? `${thousandSeparator(product.offerPrice)} ${currency}`
                                        : 'None'}
                                </td>
                                <td className="px-4 py-3">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center gap-4">
                                        <EditIcon
                                            onClick={() => router.push(`/store/update-product/${product.id}`)}
                                            size={20}
                                            className="text-yellow-400 cursor-pointer"
                                        />
                                        <Trash2Icon
                                            onClick={() => handleDelete(product.id)}
                                            size={20}
                                            className="text-red-600 cursor-pointer"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
}
