'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signUpSchema, SignUpSchema } from '@/lib/validation/user.form';
import { useEffect, useTransition } from 'react';
import { signUpUser } from '@/lib/actions/user.action';
import { LoaderCircle } from 'lucide-react';

interface SignUpFormProps {
    onSwitchToSignIn: () => void;
    onClose: () => void;
}

export default function SignUpForm({ onSwitchToSignIn, onClose }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema()),
    });

    const router = useRouter();

    const [state, formAction] = useFormState(signUpUser, {
        success: false,
        error: false,
    });
    const [isPending, startTransition] = useTransition();

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        startTransition(() => {
            formAction({ ...data });
        });
    });

    useEffect(() => {
        console.log('State updated:', state);
        if (state.success) {
            toast.success('Đăng ký thành công!!');
            onSwitchToSignIn();
        }
        if (state.error) {
            toast.error(state.message || 'Đăng ký thất bại');
        }
    }, [state, router, onSwitchToSignIn]);

    return (
        <div
            className="fixed top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center text-sm text-gray-600 bg-black/50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <form
                onSubmit={onSubmit}
                className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
            >
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Đăng ký</h1>
                <p className="text-gray-500 text-sm mt-2">Vui lòng đăng ký để tiếp tục</p>
                <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user-round-icon lucide-user-round"
                    >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Tên"
                        className="border-none outline-none ring-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmit();
                            }
                        }}
                    />
                </div>
                {errors.name?.message && (
                    <p className="text-red-500 text-sm text-left" style={{ maxWidth: '320px' }}>
                        {errors.name.message}
                    </p>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail-icon lucide-mail"
                    >
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="Địa chỉ email"
                        className="border-none outline-none ring-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmit();
                            }
                        }}
                    />
                </div>
                {errors.email?.message && (
                    <p className="text-red-500 text-sm text-left" style={{ maxWidth: '320px' }}>
                        {errors.email.message}
                    </p>
                )}
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-lock-icon lucide-lock"
                    >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Mật khẩu"
                        className="border-none outline-none ring-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmit();
                            }
                        }}
                    />
                </div>
                {errors.password?.message && (
                    <p className="text-red-500 text-sm text-left" style={{ maxWidth: '320px' }}>
                        {errors.password.message}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full flex items-center justify-center h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Đăng ký {isPending && <LoaderCircle className="ml-1 animate-spin" />}
                </button>
                <p className="text-gray-500 text-sm mt-3 mb-11">
                    Đã có tài khoản?{' '}
                    <span onClick={onSwitchToSignIn} className="text-indigo-500 cursor-pointer">
                        Nhấn tại đây
                    </span>
                </p>
            </form>
        </div>
    );
}
