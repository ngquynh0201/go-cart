'use client';

import { createCoupon, deleteCouponById, updateCouponPublic } from '@/lib/actions/coupon.action';
import { today } from '@/lib/utils';
import { couponSchema, CouponSchema } from '@/lib/validation/coupon.form';
import { useCouponStore } from '@/store/coupon';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { DeleteIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Coupons() {
    const { coupons, fetchCoupons } = useCouponStore();

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CouponSchema>({
        resolver: zodResolver(couponSchema()),
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(createCoupon, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const data = { ...formData };
        formAction(data);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Tạo mã giảm giá thành công!!');
            router.refresh();

            reset();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasSubmitted(false);
            fetchCoupons();
        } else if (state.error) {
            toast.error(state.message || 'Tạo thất bại');
        }
    }, [state, router, hasSubmitted, reset, fetchCoupons]);

    const handlePublicChange = async (couponId: string, isPublic: boolean) => {
        const result = await updateCouponPublic(couponId, isPublic);
        if (result.success) {
            toast.success('Cập nhật thành công khai thành công!');
            fetchCoupons();
        } else {
            toast.error(result.message || 'Cập nhật thất bại');
        }
    };

    const handleDelete = async (couponId: string) => {
        const result = await deleteCouponById(couponId);
        if (result?.success) {
            toast.success('Xóa mã giảm giá thành công!');
            fetchCoupons();
        } else {
            toast.error('Xóa thất bại');
        }
    };

    return (
        <div className="text-slate-500 mb-40">
            {/* Add Coupon */}
            <form method="POST" onSubmit={onSubmit} className="max-w-sm text-sm">
                <h2 className="text-2xl">
                    Thêm <span className="text-slate-800 font-medium">mã giảm giá</span>
                </h2>
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input
                        type="text"
                        {...register('code')}
                        placeholder="Mã giảm giá"
                        className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    />
                    {errors.code?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.code?.message.toString()}</p>
                    )}
                    <input
                        type="number"
                        {...register('discount')}
                        placeholder="Số phần trăm giảm (%)"
                        min={1}
                        max={100}
                        className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    />
                    {errors.discount?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.discount?.message.toString()}</p>
                    )}
                </div>
                <input
                    type="text"
                    {...register('description')}
                    placeholder="Mô tả"
                    className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                />
                {errors.description?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.description?.message.toString()}</p>
                )}

                <label>
                    <p className="mt-3">Ngày hết hạn mã giảm giá</p>
                    <input
                        type="date"
                        {...register('expiredAt')}
                        placeholder="Coupon Expires At"
                        min={today}
                        className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    />
                    {errors.expiredAt?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.expiredAt?.message.toString()}</p>
                    )}
                </label>

                <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" {...register('forNewUser')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Cho người dùng mới</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" {...register('forMember')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Cho thành viên (Plus)</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" {...register('isPublic')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Công khai</p>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition"
                >
                    Thêm mã giảm giá
                </button>
            </form>

            {/* List Coupons */}
            <div className="mt-14">
                <h2 className="text-2xl">
                    Danh sách <span className="text-slate-800 font-medium">mã giảm giá</span>
                </h2>
                <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-4xl">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Mã</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Mô tả</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Số % giảm</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Ngày hết hạn</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Cho người dùng mới</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                                    Cho thành viên (Plus)
                                </th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Nút</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {coupons?.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-medium text-slate-800">{coupon.code}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.description}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.discount}%</td>
                                    <td className="py-3 px-4 text-slate-800">
                                        {format(coupon.expiredAt, 'yyyy-MM-dd')}
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.forNewUser ? 'Có' : 'Không'}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.forMember ? 'Có' : 'Không'}</td>
                                    <td className="py-3 px-4 text-slate-800 flex gap-4">
                                        {coupon.isPublic ? (
                                            <EyeOffIcon
                                                onClick={() => handlePublicChange(coupon.id, false)}
                                                className="w-5 h-5 text-orange-500 hover:text-orange-800 cursor-pointer"
                                            />
                                        ) : (
                                            <EyeIcon
                                                onClick={() => handlePublicChange(coupon.id, true)}
                                                className="w-5 h-5 text-green-500 hover:text-green-800 cursor-pointer"
                                            />
                                        )}
                                        <DeleteIcon
                                            onClick={() => handleDelete(coupon.id)}
                                            className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
