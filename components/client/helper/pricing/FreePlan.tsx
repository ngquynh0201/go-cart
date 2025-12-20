'use client';

import { commonFeatures } from '@/constants/constants';
import { currency } from '@/lib/utils';
import { UserType } from '@/types/types';

export default function FreePlan({
    currentUser,
    onFree,
}: {
    currentUser: UserType | null;
    onFree: () => Promise<void>;
}) {
    return (
        <div
            className={`bg-white shadow-2xl w-full rounded-xl flex flex-col transition-all duration-300 border border-gray-200`}
        >
            {/* Header Section */}
            <div className={`p-6 rounded-t-xl bg-gray-50`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900">Miễn phí</h2>
                        <p className="text-sm mt-1 text-gray-500">Luôn luôn miễn phí</p>
                    </div>
                    {currentUser && currentUser.isSwitchedFree && (
                        <p className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white`}>
                            Hoạt động
                        </p>
                    )}
                </div>

                <div className="flex items-end gap-1 mt-4">
                    <p className="text-4xl font-extrabold text-gray-900">0 {currency}</p>
                    <span className="text-gray-500 text-base font-medium">Luôn luôn miễn phí</span>
                </div>
            </div>

            {/* Features Section */}
            <div className="p-6 flex flex-col grow">
                <ul className="flex flex-col gap-3 grow">
                    {commonFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600 font-medium">
                            {feature.icon}
                            <span>{feature.text}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                {currentUser && currentUser.isSwitchedPlus ? (
                    <button
                        onClick={onFree}
                        className={`w-full rounded-xl py-3 font-semibold mt-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition duration-200`}
                    >
                        Chuyển sang miễn phí
                    </button>
                ) : (
                    <button
                        className={`w-full rounded-xl py-3 font-semibold mt-8 bg-gray-300 text-gray-600 cursor-not-allowed transition duration-200`}
                    >
                        Gói hiện tại
                    </button>
                )}
            </div>
        </div>
    );
}
