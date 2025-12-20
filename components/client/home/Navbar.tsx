'use client';

import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { LayoutDashboardIcon, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import Cookies from 'js-cookie';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import Image from 'next/image';
import { assets } from '@/public/assets';
import { useUserStore } from '@/store/user';
import { useStoreUserStore } from '@/store/storeUser';

export default function Navbar() {
    const role = Cookies.get('role');

    const { currentUser, fetchCurrentUser } = useUserStore();
    const { storeByUser, fetchStoreByUser } = useStoreUserStore();

    useEffect(() => {
        fetchCurrentUser();
        fetchStoreByUser();
    }, [fetchCurrentUser, fetchStoreByUser]);

    const { isLoggedIn, logout } = useAuth();
    const { itemAmount, updateCart } = useStore();

    // auth state
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const handleSignInClick = () => {
        setShowSignIn(true);
        setShowSignUp(false);
    };
    const handleSignUpClick = () => {
        setShowSignIn(false);
        setShowSignUp(true);
    };
    const handleClose = () => {
        setShowSignIn(false);
        setShowSignUp(false);
    };

    const router = useRouter();

    const [search, setSearch] = useState('');
    const [openSetting, setOpenSetting] = useState(false);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/shop?search=${search}`);
        setSearch('');
    };

    const handleLogout = () => {
        router.push('/');
        logout();
        updateCart();
    };

    return (
        <>
            <nav className="relative bg-white">
                <div className="mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                        <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                            <span className="text-green-600">go</span>cart
                            <span className="text-green-600 text-5xl leading-0">.</span>
                            {currentUser && currentUser.isSwitchedPlus && (
                                <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                                    plus
                                </p>
                            )}
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                            <Link href="/">Trang chủ</Link>
                            <Link href="/shop">Sản phẩm</Link>
                            <Link href="/">Về chúng tôi</Link>
                            <Link href="/">Liên hệ</Link>

                            <form
                                onSubmit={handleSearch}
                                className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
                            >
                                <Search size={18} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    required
                                />
                            </form>

                            {role === 'admin' && isLoggedIn ? (
                                <Link href="/admin" className="relative flex items-center gap-2 text-slate-600">
                                    <LayoutDashboardIcon size={18} />
                                    Trang tổng quan
                                </Link>
                            ) : (
                                <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                                    <ShoppingCart size={18} />
                                    Giỏ hàng
                                    <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                                        {itemAmount}
                                    </button>
                                </Link>
                            )}

                            {isLoggedIn ? (
                                <div className="relative">
                                    <Image
                                        src={assets.profile_pic1}
                                        alt="profile"
                                        className="size-8 rounded-full object-cover cursor-pointer"
                                        onClick={() => setOpenSetting(!openSetting)}
                                    />
                                    {openSetting && (
                                        <div className="absolute bg-white min-w-42 right-0 flex flex-col shadow-lg p-2 rounded-lg">
                                            <Link
                                                href={'/orders'}
                                                onClick={() => setOpenSetting(false)}
                                                className="py-1 px-2"
                                            >
                                                Đơn hàng của tôi
                                            </Link>
                                            <Link
                                                href={storeByUser?.status === 'approved' ? '/store' : '/create-store'}
                                                onClick={() => setOpenSetting(false)}
                                                className="py-1 px-2"
                                            >
                                                Cửa hàng của tôi
                                            </Link>
                                            <hr className="mx-2 my-1 border-gray-600" />
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpenSetting(false);
                                                }}
                                                className="py-1 px-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg mt-2"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleSignInClick}
                                    className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
                                >
                                    Đăng nhập
                                </button>
                            )}
                        </div>

                        {/* Mobile User Button  */}
                        <div className="sm:hidden">
                            <button
                                onClick={handleSignInClick}
                                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-300" />
            </nav>
            {showSignIn && <SignInForm onSwitchToSignUp={handleSignUpClick} onClose={handleClose} />}
            {showSignUp && <SignUpForm onSwitchToSignIn={handleSignInClick} onClose={handleClose} />}
        </>
    );
}
