import { getCouponById, getCoupons } from '@/lib/actions/coupon.action';
import { create } from 'zustand';

type Coupon = {
    id: string;
    code: string;
    description: string;
    discount: number;
    forNewUser: boolean;
    forMember: boolean;
    isPublic: boolean;
    expiredAt: Date;
    createdAt: Date;
};

type CouponStore = {
    coupons: Coupon[] | null;
    coupon: Coupon | null;
    fetchCoupons: () => Promise<void>;
    fetchCoupon: (id: string) => Promise<void>;
};

export const useCouponStore = create<CouponStore>((set) => ({
    coupons: [],
    fetchCoupons: async () => {
        try {
            const data = await getCoupons();
            set({ coupons: data });
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    },
    coupon: null,
    fetchCoupon: async (id: string) => {
        try {
            const data = await getCouponById(id);
            set({ coupon: data });
        } catch (error) {
            console.error('Error fetching coupon:', error);
        }
    },
}));
