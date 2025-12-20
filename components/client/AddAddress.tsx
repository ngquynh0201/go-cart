'use client';

import { assets } from '@/public/assets';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { addressSchema, AddressSchema } from '@/lib/validation/address.form';
import { addAddress } from '@/lib/actions/user.action';

export default function AddAddress() {
    const userId = Cookies.get('userId') || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema()),
        defaultValues: { userId },
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(addAddress, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        const dataWithUserId = { ...formData, userId };
        formAction(dataWithUserId);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Thêm địa chỉ thành công!!');
            router.push('/cart');

            reset();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasSubmitted(false);
        } else if (state.error) {
            toast.error(state.message || 'Thêm thất bại');
        }
    }, [state, router, hasSubmitted, reset]);

    return (
        <div className="mt-16 pb-16 max-w-7xl mx-auto">
            <p className="text-2xl md:text-3xl text-gray-500">
                Thêm địa chỉ <span className="font-semibold text-primary">giao hàng</span>
            </p>
            <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
                <div className="flex-1 max-w-md">
                    <form method="POST" onSubmit={onSubmit} className="space-y-3 mt-6 text-sm">
                        {/* first & last name */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* first name */}
                            <div>
                                <input
                                    type="text"
                                    {...register('firstName')}
                                    placeholder="Tên"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.firstName?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.firstName?.message.toString()}
                                    </p>
                                )}
                            </div>
                            {/* last name */}
                            <div>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    placeholder="Họ"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.lastName?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.lastName?.message.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* email */}
                        <div>
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="Địa chỉ email"
                                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                            />
                            {errors.email?.message && (
                                <p className="text-xs text-red-400 max-w-[300px]">{errors.email?.message.toString()}</p>
                            )}
                        </div>
                        {/* Street */}
                        <div>
                            <input
                                type="text"
                                {...register('street')}
                                placeholder="Đường"
                                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                            />
                            {errors.street?.message && (
                                <p className="text-xs text-red-400 max-w-[300px]">
                                    {errors.street?.message.toString()}
                                </p>
                            )}
                        </div>
                        {/* city & state */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* city */}
                            <div>
                                <input
                                    type="text"
                                    {...register('city')}
                                    placeholder="Thành phố"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.city?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.city?.message.toString()}
                                    </p>
                                )}
                            </div>
                            {/* state */}
                            <div>
                                <input
                                    type="text"
                                    {...register('state')}
                                    placeholder="Quận/Huyện"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.state?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.state?.message.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* zip code & country */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* zip code */}
                            <div>
                                <input
                                    type="text"
                                    {...register('zip')}
                                    placeholder="Mã Zip"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.zip?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.zip?.message.toString()}
                                    </p>
                                )}
                            </div>
                            {/* country */}
                            <div>
                                <input
                                    type="text"
                                    {...register('country')}
                                    placeholder="Quốc gia"
                                    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                                />
                                {errors.country?.message && (
                                    <p className="text-xs text-red-400 max-w-[300px]">
                                        {errors.country?.message.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* phone */}
                        <div>
                            <input
                                type="text"
                                {...register('phone')}
                                placeholder="Số điện thoại"
                                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
                            />
                            {errors.phone?.message && (
                                <p className="text-xs text-red-400 max-w-[300px]">{errors.phone?.message.toString()}</p>
                            )}
                        </div>
                        {/* button */}
                        <button
                            type="submit"
                            className="w-full mt-6 bg-green-600 text-white py-3 hover:bg-green-700 transition cursor-pointer uppercase"
                        >
                            Lưu địa chỉ
                        </button>
                    </form>
                </div>
                <Image src={assets.add_address_image} alt="add address img" className="md:mr-16 mb-16 md:mt-0" />
            </div>
        </div>
    );
}
