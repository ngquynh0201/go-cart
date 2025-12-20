'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/lib/validation/user.form';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInUser } from '@/lib/actions/user.action';
import { useStore } from '@/context/StoreContext';
import { LoaderCircle } from 'lucide-react';

interface SignInFormProps {
    onSwitchToSignUp: () => void;
    onClose: () => void;
}

export default function SignInForm({ onSwitchToSignUp, onClose }: SignInFormProps) {
    const { updateCart } = useStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema()),
    });

    const [state] = useState({
        success: false,
        error: false,
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { setIsLoggedIn } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const response = await signInUser(state, data);

        if (response.success) {
            if (response.token) {
                Cookies.set('token', response.token, { expires: 1 });
            }
            if (response.userId) {
                Cookies.set('userId', response.userId);
            }
            if (response.name) {
                Cookies.set('name', response.name);
            }
            if (response.email) {
                Cookies.set('email', response.email);
            }
            if (response.isPlus) {
                Cookies.set('isPlus', String(response.isPlus));
            }
            if (response.role) {
                Cookies.set('role', response.role);
            }
            setIsLoggedIn(true);
            onClose();
            if (response.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
            setLoading(false);
            toast.success('Đăng nhập thành công !!');
            updateCart();
        } else {
            setLoading(false);
            toast.error(response.message || 'Đăng nhập thất bại');
        }
    });

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
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Đăng nhập</h1>
                <p className="text-gray-500 text-sm mt-2">Vui lòng đăng nhập để tiếp tục</p>
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
                {/* <div className="mt-4 text-left text-primary">
                    <button className="text-sm" type="reset">
                        Quên mật khẩu?
                    </button>
                </div> */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full flex items-center justify-center h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Đăng nhập {loading && <LoaderCircle className="ml-1 animate-spin" />}
                </button>
                <p className="text-gray-500 text-sm mt-3 mb-11">
                    Chưa có tài khoản?{' '}
                    <span onClick={onSwitchToSignUp} className="text-indigo-500 cursor-pointer">
                        Nhấn tại đây
                    </span>
                </p>
            </form>
        </div>
    );
}
