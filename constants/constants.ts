import { CheckIcon } from 'lucide-react';
import { createElement, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho một Feature (tính năng)
export type Feature = {
    text: string;
    icon: ReactNode;
};

export const commonFeatures: Feature[] = [
    { text: 'Phiếu giảm giá có giới hạn', icon: createElement(CheckIcon, { className: 'w-4 h-4 text-green-500' }) },
    { text: 'Sản phẩm giảm giá có giới hạn', icon: createElement(CheckIcon, { className: 'w-4 h-4 text-green-500' }) },
    {
        text: 'Không có quyền truy cập sớm vào bán hàng',
        icon: createElement(CheckIcon, { className: 'w-4 h-4 text-green-500' }),
    },
    {
        text: 'Hoàn tiền và phần thưởng có giới hạn',
        icon: createElement(CheckIcon, { className: 'w-4 h-4 text-green-500' }),
    },
    { text: 'Miễn phí vận chuyển', icon: createElement(CheckIcon, { className: 'w-4 h-4 text-green-500' }) },
];
