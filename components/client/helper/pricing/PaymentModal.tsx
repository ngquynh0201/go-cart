'use client';

import { XIcon } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { subscribePlusPlan } from '@/lib/actions/user.action';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/user';

type PaymentModalProps = {
    onClose: () => void;
};

export default function PaymentModal({ onClose }: PaymentModalProps) {
    const userId = Cookies.get('userId') || '';

    const { fetchCurrentUser, fetchPlanUser } = useUserStore();

    const [bankingName, setBankingName] = useState('');
    const [bankingNumber, setBankingNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
        // Đóng modal khi click ra ngoài vùng nội dung modal
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleProceedToPayment = async () => {
        if (!bankingName.trim() || !bankingNumber.trim()) {
            setError('Vui lòng nhập tên và số ngân hàng.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Simulate payment processing (fake, no real payment)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay

        // Call server action to subscribe to Plus plan
        const result = await subscribePlusPlan(userId);
        if (result.success) {
            toast.success('Đăng ký thành công! Bây giờ bạn có quyền truy cập Plus.');
            onClose();
            fetchCurrentUser();
            fetchPlanUser();
        } else {
            setError(result.message || 'Thanh toán không thành công. Vui lòng thử lại.');
        }

        setIsLoading(false);
    };

    return (
        <div
            onClick={handleOutsideClick}
            className="fixed inset-0 z-50 flex justify-center items-center text-sm text-gray-600 bg-black/50 p-4"
        >
            <div className="relative sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-6 bg-white shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close payment modal"
                >
                    <XIcon className="w-5 h-5" />
                </button>

                <h1 className="text-gray-900 text-3xl mt-4 font-bold">Thanh toán</h1>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                    Bắt đầu miễn phí và mở rộng quy mô khi bạn phát triển. Tìm kế hoạch hoàn hảo cho nhu cầu sáng tạo
                    hiện tại của bạn.
                </p>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Nhập vào tên ngân hàng"
                        value={bankingName}
                        onChange={(e) => setBankingName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    <input
                        type="text"
                        placeholder="Nhập vào số tài khoản"
                        value={bankingNumber}
                        onChange={(e) => setBankingNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <button
                        onClick={handleProceedToPayment}
                        disabled={isLoading || !bankingName.trim() || !bankingNumber.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed w-full rounded-xl py-3 text-white font-medium mt-4 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                    </button>
                </div>
            </div>
        </div>
    );
}
