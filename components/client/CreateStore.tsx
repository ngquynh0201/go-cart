'use client';

import Image from 'next/image';
import { assets } from '@/public/assets';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { storeSchema, StoreSchema } from '@/lib/validation/store.form';
import { createStore, deleteStoreById } from '@/lib/actions/store.action';
import { uploadImagesToCloudinary } from '@/lib/upload';
import Cookies from 'js-cookie';
import { useStoreUserStore } from '@/store/storeUser';
import Loading from './helper/Loading';

export default function CreateStore() {
    const userId = Cookies.get('userId') || '';

    const { storeByUser, fetchStoreByUser } = useStoreUserStore();

    useEffect(() => {
        fetchStoreByUser();
    }, [fetchStoreByUser]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StoreSchema>({
        resolver: zodResolver(storeSchema()),
        defaultValues: {
            userId,
        },
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const [state, formAction] = useFormState(createStore, {
        success: false,
        error: false,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImages([e.target.files[0]]);
            setPreviewUrl(URL.createObjectURL(file)); // tạo link preview
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        let logoUrls: string[] = [];

        // Upload new images to Cloudinary if there are new files
        if (images.length > 0) {
            try {
                logoUrls = await uploadImagesToCloudinary(images);
            } catch (error) {
                console.log(error);
                toast.error('Failed to upload images');
                return;
            }
        }

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageAndFileUrls = { ...formData, logoUrls, userId };
        formAction(dataWithImageAndFileUrls);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        if (state.success) {
            toast.success('Tạo cửa hàng thành công!!');
            router.refresh();

            reset();
            setImages([]);
            setPreviewUrl(null);
            setHasSubmitted(false);
            setLoading(false);
            setAlreadySubmitted(true);
        } else if (state.error) {
            toast.error(state.message || 'Tạo thất bại');
        }
    }, [state, router, hasSubmitted, reset]);

    useEffect(() => {
        if (storeByUser?.status === 'approved' || storeByUser?.status === 'rejected') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCountdown(5);

            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [storeByUser?.status, router, storeByUser?.id, fetchStoreByUser]);

    useEffect(() => {
        const handleCountdownZero = async () => {
            if (countdown === 0 && storeByUser) {
                if (storeByUser.status === 'approved') {
                    router.push('/store');
                } else if (storeByUser.status === 'rejected') {
                    if (storeByUser.id) {
                        try {
                            await deleteStoreById(storeByUser.id);

                            router.refresh();
                            fetchStoreByUser();
                            setAlreadySubmitted(false);
                        } catch (error) {
                            console.error('Error deleting store:', error);
                            toast.error('Xóa cửa hàng thất bại');
                        }
                    }
                }
            }
        };

        handleCountdownZero();
    }, [countdown, storeByUser?.status, storeByUser?.id, router, fetchStoreByUser, storeByUser]);

    const message = () => {
        switch (storeByUser?.status) {
            case 'pending':
                return 'Cửa hàng của bạn đã được tạo nhưng để sử dụng được bạn cần đợi GoCart phê duyệt';
            case 'approved':
                return 'Cửa hàng của bạn đã được phê duyệt, bây giờ bạn có thể thêm sản phẩm vào cửa hàng của mình từ trang tổng quan';
            case 'rejected':
                return 'Cửa hàng của bạn đã bị từ chối, bây giờ bạn sẽ tạo lại một cửa hàng mới và đợi GoCart phê duyệt';
            default:
                return 'Cửa hàng của bạn đã được tạo nhưng để sử dụng được bạn cần đợi GoCart phê duyệt';
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            {!alreadySubmitted && !storeByUser ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form
                        method="POST"
                        onSubmit={onSubmit}
                        className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
                    >
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl">
                                Thêm <span className="text-slate-800 font-medium">cửa hàng</span> của bạn
                            </h1>
                            <p className="max-w-lg mt-2">
                                Để trở thành người bán trên GoCart, hãy gửi chi tiết cửa hàng của bạn để được xem xét.
                                Cửa hàng của bạn sẽ được kích hoạt sau khi xác minh của quản trị viên.
                            </p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Logo cửa hàng
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    width={100}
                                    height={100}
                                    alt="image"
                                    className="mt-2 h-16 rounded cursor-pointer object-cover"
                                />
                            ) : (
                                <Image
                                    src={assets.upload_area}
                                    alt="upload"
                                    width={150}
                                    height={100}
                                    className="mt-2 h-16 rounded cursor-pointer"
                                />
                            )}
                            <input type="file" id="image" hidden accept="image/*" onChange={handleImageChange} />
                        </label>

                        <p>Biệt danh</p>
                        <input
                            type="text"
                            {...register('username')}
                            placeholder="Nhập vào biệt danh cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                        />
                        {errors.username?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">{errors.username?.message.toString()}</p>
                        )}

                        <p>Tên</p>
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="Nhập vào tên cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                        />
                        {errors.name?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">{errors.name?.message.toString()}</p>
                        )}

                        <p>Mô tả</p>
                        <textarea
                            rows={5}
                            {...register('description')}
                            placeholder="Nhập vào mô tả cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
                        />
                        {errors.description?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">
                                {errors.description?.message.toString()}
                            </p>
                        )}

                        <p>Địa chỉ email</p>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="Nhập vào địa chỉ email cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                        />
                        {errors.email?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">{errors.email?.message.toString()}</p>
                        )}

                        <p>Số điện thoại liên hệ</p>
                        <input
                            type="text"
                            {...register('contact')}
                            placeholder="Nhập vào số điện thoại cho cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                        />
                        {errors.contact?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">{errors.contact?.message.toString()}</p>
                        )}

                        <p>Địa chỉ</p>
                        <textarea
                            rows={5}
                            {...register('address')}
                            placeholder="Nhập vào địa chỉ cửa hàng"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
                        />
                        {errors.address?.message && (
                            <p className="text-xs text-red-400 max-w-[300px]">{errors.address?.message.toString()}</p>
                        )}

                        <button
                            type="submit"
                            className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
                        {message()}
                    </p>
                    {storeByUser?.status === 'approved' && (
                        <p className="mt-5 text-slate-400">
                            chuyển hướng đến trang tổng quan trong{' '}
                            <span className="font-semibold">{countdown} giây</span> nữa.
                        </p>
                    )}
                    {storeByUser?.status === 'rejected' && (
                        <p className="mt-5 text-slate-400">
                            đang khởi tạo lại cửa hàng trong <span className="font-semibold">{countdown} giây</span>{' '}
                            nữa.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
