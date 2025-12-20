'use client';

import { createProduct } from '@/lib/actions/product.action';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { currency } from '@/lib/utils';
import { productSchema, ProductSchema } from '@/lib/validation/product.form';
import { assets } from '@/public/assets';
import { useStoreUserStore } from '@/store/storeUser';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Loading from '../client/helper/Loading';
import { useCategoryStore } from '@/store/category';

export default function AddProduct() {
    const { storeByUser, fetchStoreByUser } = useStoreUserStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchStoreByUser();
        fetchCategories();
    }, [fetchStoreByUser, fetchCategories]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema()),
        defaultValues: {
            storeId: storeByUser?.id,
        },
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [state, formAction] = useFormState(createProduct, {
        success: false,
        error: false,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => {
                const newPreviews = [...prev];
                newPreviews[index] = url;
                return newPreviews;
            });
            setImages((prev) => {
                const newImages = [...prev];
                newImages[index] = file;
                return newImages;
            });
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        if (!storeByUser?.id) {
            toast.error('ID của cửa hàng là bắt buộc');
            return;
        }

        let imageUrls: string[] = [];

        // Upload new images to Cloudinary if there are new files
        if (images.length > 0) {
            try {
                imageUrls = await uploadImagesToCloudinary(images);
            } catch (error) {
                console.log(error);
                toast.error('Tải lên hình ảnh thất bại');
                return;
            }
        }

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageAndFileUrls = { ...formData, imageUrls, storeId: storeByUser.id };
        formAction(dataWithImageAndFileUrls);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        if (state.success) {
            toast.success('Tạo sản phẩm thành công!!');
            router.refresh();

            reset();
            setImages([]);
            setPreviews([]);
            setHasSubmitted(false);
            setLoading(false);
        } else if (state.error) {
            toast.error(state.message || 'Tạo thất bại');
        }
    }, [state, router, hasSubmitted, reset]);

    if (loading) return <Loading />;

    return (
        <form method="POST" onSubmit={onSubmit} className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                Thêm <span className="text-slate-800 font-medium">sản phẩm</span> mới
            </h1>
            <p className="mt-7">Các hình ảnh sản phẩm</p>

            <div className="flex gap-3 mt-4">
                {[...Array(4)].map((_, index) => (
                    <label key={index} htmlFor={`image${index + 1}`}>
                        <Image
                            src={previews[index] || assets.upload_area}
                            alt="upload area"
                            className="h-15 w-auto border border-slate-200 rounded cursor-pointer"
                            width={300}
                            height={300}
                        />
                        <input
                            type="file"
                            id={`image${index + 1}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                        />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Tên
                <input
                    type="text"
                    {...register('name')}
                    placeholder="Nhập vào tên sản phẩm"
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
                />
                {errors.name?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.name?.message.toString()}</p>
                )}
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Mô tả
                <textarea
                    placeholder="Nhập vào mô tả sản phẩm"
                    {...register('description')}
                    rows={5}
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
                />
                {errors.description?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.description?.message.toString()}</p>
                )}
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Giá thực tế ({currency})
                    <input
                        type="number"
                        {...register('actualPrice')}
                        placeholder="0"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
                    />
                    {errors.actualPrice?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.actualPrice?.message.toString()}</p>
                    )}
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Giá ưu đải ({currency})
                    <input
                        type="number"
                        {...register('offerPrice')}
                        placeholder="0"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
                    />
                    {errors.offerPrice?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.offerPrice?.message.toString()}</p>
                    )}
                </label>
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6">
                Số lượng
                <input
                    type="number"
                    {...register('quantity')}
                    placeholder="0"
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
                />
                {errors.quantity?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.quantity?.message.toString()}</p>
                )}
            </label>

            <select
                {...register('categoryId')}
                className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded"
            >
                <option value="">Chọn một danh mục</option>
                {categories &&
                    categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
            </select>
            {errors.categoryId?.message && (
                <p className="text-xs text-red-400 max-w-[300px]">{errors.categoryId?.message.toString()}</p>
            )}

            <br />

            <button
                type="submit"
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition"
            >
                Thêm sản phẩm
            </button>
        </form>
    );
}
