'use client';

import { useUserStore } from '@/store/user';
import FreePlan from './helper/pricing/FreePlan';
import PlusPlan from './helper/pricing/PlusPlan';
import { useEffect } from 'react';
import { switchToFreePlan, switchToPlusPlan } from '@/lib/actions/user.action';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function Pricing() {
    const userId = Cookies.get('userId') || '';
    const { currentUser, planUser, fetchCurrentUser, fetchPlanUser } = useUserStore();

    useEffect(() => {
        fetchCurrentUser();
        fetchPlanUser();
    }, [fetchCurrentUser, fetchPlanUser]);

    const handleSwitchToFreePlan = async () => {
        if (!userId) {
            toast.error('Vui lòng đăng nhập');
            return;
        }
        const result = await switchToFreePlan(userId);
        if (result.success) {
            toast.success('Chuyển sang gói miễn phí thành công!');
            fetchCurrentUser();
            fetchPlanUser();
        } else {
            toast.error(result.message || 'Chuyển sang gói miễn phí thất bại');
        }
    };

    const handleSwitchToPlusPlan = async () => {
        if (!userId) {
            toast.error('Vui lòng đăng nhập');
            return;
        }
        const result = await switchToPlusPlan(userId);
        if (result.success) {
            toast.success('Chuyển sang gói plus (thành viên) thành công!');
            fetchCurrentUser();
        } else {
            toast.error(result.message || 'Chuyển sang gói plus (thành viên) thất bại');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6">
            <FreePlan currentUser={currentUser} onFree={handleSwitchToFreePlan} />
            <PlusPlan currentUser={currentUser} planUser={planUser} onPlus={handleSwitchToPlusPlan} />
        </div>
    );
}
