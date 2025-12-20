'use client';

import { getProductById, updateProduct } from '@/lib/actions/product.action';
import { productSchema, ProductSchema } from '@/lib/validation/product.form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Loading from '../client/helper/Loading';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/public/assets';
import { currency } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import { useStoreUserStore } from '@/store/storeUser';

export default function UpdateProduct({ id }: { id: string }) {
    const { categories, fetchCategories } = useCategoryStore();
    const { storeByUser, fetchStoreByUser } = useStoreUserStore();

    useEffect(() => {
        fetchCategories();
        fetchStoreByUser();
    }, [fetchCategories, fetchStoreByUser]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema()),
        defaultValues: {
            id,
            storeId: storeByUser?.id,
        },
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [state, formAction] = useFormState(updateProduct, {
        success: false,
        error: false,
    });

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;

            try {
                const product = await getProductById(id);
                if (!product) {
                    toast.error('Product not found');
                    return;
                }

                // Set form values
                setValue('name', product.name);
                setValue('description', product.description);
                setValue('actualPrice', product.actualPrice);
                setValue('offerPrice', product.offerPrice!);
                setValue('categoryId', product.categoryId);
                setValue('quantity', product.quantity);

                // Set images
                if (product.images && product.images.length > 0) {
                    setPreviews(product.images.map((img) => img.url));
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                toast.error('Failed to load course data');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, setValue]);

    // handle chọn file ảnh + preview
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

        try {
            // 1. Tạo một mảng để chứa kết quả cuối cùng (giữ đúng thứ tự)
            const finalImageUrls: string[] = [...previews];

            // 2. Lọc ra những file thực sự mới cần upload
            // Chúng ta dựa vào mảng `images` mà bạn đã set trong handleImageChange
            const filesToUpload: File[] = [];
            const fileIndices: number[] = [];

            images.forEach((file, index) => {
                if (file instanceof File) {
                    filesToUpload.push(file);
                    fileIndices.push(index); // Lưu lại vị trí để chèn trả lại sau khi upload
                }
            });

            // 3. Nếu có file mới, tiến hành upload
            if (filesToUpload.length > 0) {
                const uploadedUrls = await uploadImagesToCloudinary(filesToUpload);

                // 4. Ghi đè các URL mới upload vào đúng vị trí của nó trong mảng kết quả
                uploadedUrls.forEach((url, i) => {
                    const originalIndex = fileIndices[i];
                    finalImageUrls[originalIndex] = url;
                });
            }

            // 5. Lọc bỏ các phần tử trống (nếu người dùng không chọn đủ 4 ảnh)
            // và chỉ lấy những gì là URL hợp lệ
            const validImageUrls = finalImageUrls.filter((url) => url && !url.startsWith('blob:'));

            const dataWithImage = {
                ...formData,
                id,
                storeId: storeByUser.id,
                imageUrls: validImageUrls,
            };

            console.log('Dữ liệu gửi đi:', dataWithImage);
            formAction(dataWithImage);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải ảnh lên Cloudinary');
            setHasSubmitted(false);
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Cập nhật sản phẩm thành công!!');
            router.push('/store/manage-product');
        } else if (state.error) {
            toast.error(state.message || 'Update failed');
            setHasSubmitted(false);
        }
    }, [state, router, hasSubmitted]);

    if (loading) {
        return <Loading />;
    }

    return (
        <form method="POST" onSubmit={onSubmit} className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                Cập nhật <span className="text-slate-800 font-medium">sản phẩm</span>
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

            <label className="flex flex-col gap-2">
                Danh mục
                <select
                    {...register('categoryId')}
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
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
            </label>

            <br />

            <button
                type="submit"
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition"
            >
                Cập nhật
            </button>
        </form>
    );
}
