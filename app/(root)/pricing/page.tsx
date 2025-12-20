import Pricing from '@/components/client/Pricing';

export default function PricingPage() {
    return (
        <div className="max-w-4xl mx-auto z-20 my-32 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-slate-800 text-5xl font-extrabold mb-4">Chọn gói của bạn 💰</h2>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Bắt đầu miễn phí và mở rộng quy mô khi bạn phát triển. Tìm kế hoạch hoàn hảo cho nhu cầu sáng tạo
                    hiện tại của bạn.
                </p>
            </div>
            <div className="mt-16">
                <Pricing />
            </div>
        </div>
    );
}
