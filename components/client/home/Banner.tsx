// Banner.tsx
'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast'; // Vẫn giữ toast cho thông báo chung

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [showCouponCode, setShowCouponCode] = useState(false);
    const COUPON_CODE = 'NEW20';

    const handleClaim = useCallback(async () => {
        if (isClaiming) return;

        setIsClaiming(true);
        setShowCouponCode(true); // Bắt đầu hiển thị mã coupon

        // Bước 1: Sao chép mã
        try {
            await navigator.clipboard.writeText(COUPON_CODE);
            toast.success(`Mã giảm giá: ${COUPON_CODE} đã được sao chép!`);
        } catch (error) {
            console.error('Không thể sao chép mã giảm giá:', error);
            toast.error('Không thể sao chép mã giảm giá. Vui lòng thử lại!');
        }

        // Bước 2: Hiển thị mã coupon trong 1.5 giây, sau đó ẩn banner
        // Tăng thêm sự chú ý cho mã coupon trước khi banner biến mất
        setTimeout(() => {
            setIsOpen(false); // Ẩn banner
            setIsClaiming(false); // Kết thúc trạng thái xử lý
            setShowCouponCode(false); // Tắt hiển thị mã coupon (dù banner đã ẩn)
        }, 1500);
    }, [isClaiming]);

    if (!isOpen) {
        return null;
    }

    // Xác định nội dung hiển thị trên banner
    const bannerContent = showCouponCode ? (
        <span className="text-xl font-extrabold tracking-widest bg-yellow-300 text-gray-900 px-4 py-1 rounded-md transition-all duration-500 ease-out">
            {COUPON_CODE} 🎉
        </span>
    ) : (
        <p>🔥 Nhận GIẢM GIÁ 20% cho đơn hàng đầu tiên của bạn!</p>
    );

    // Xác định nội dung của nút "Claim Offer"
    const buttonContent = isClaiming ? (
        <span className="flex items-center space-x-2">
            <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            Đang sao chép...
        </span>
    ) : (
        'Nhận ngay'
    );

    return (
        <div className="w-full px-6 py-2 font-semibold text-sm text-white text-center bg-linear-to-r from-violet-600 via-[#9938CA] to-[#FF8A00] shadow-xl sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-8">
                {/* Nội dung banner sẽ thay đổi (coupon code hoặc thông báo) */}
                <div
                    className={`transition-opacity duration-500 ${
                        showCouponCode ? 'opacity-100 scale-105' : 'opacity-100'
                    }`}
                >
                    {bannerContent}
                </div>

                <div className="flex items-center space-x-6 ml-4">
                    <button
                        onClick={handleClaim}
                        type="button"
                        disabled={isClaiming}
                        className={`
                            font-bold px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform
                            max-sm:hidden
                            ${
                                isClaiming
                                    ? 'bg-gray-500 text-white cursor-not-allowed animate-pulse'
                                    : 'bg-white text-gray-800 hover:bg-yellow-300 hover:scale-105 shadow-lg'
                            }
                        `}
                    >
                        {buttonContent}
                    </button>
                    {/* Nút đóng banner (X) */}
                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                        aria-label="Close banner"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Đổi fill thành 'currentColor' để dễ dàng thay đổi màu bằng Tailwind */}
                            <rect
                                y="12.532"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-45.74 0 12.532)"
                                fill="white"
                            />
                            <rect
                                x="12.533"
                                y="13.915"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-135.74 12.533 13.915)"
                                fill="white"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
