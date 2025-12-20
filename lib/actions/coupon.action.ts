'use server';

import prisma from '../prisma';
import { CouponSchema } from '../validation/coupon.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getCoupons = async () => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return coupons;
    } catch (error) {
        console.error(error);
    }
};

export const getCouponCount = async () => {
    try {
        const count = await prisma.coupon.count();
        return count;
    } catch (error) {
        console.error('Error fetching coupon count:', error);
        return 0;
    }
};

export const getCouponById = async (id: string) => {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { id },
        });
        if (!coupon) {
            throw new Error('coupon not found');
        }

        return coupon;
    } catch (error) {
        console.error('Error fetching coupon by id:', error);
        return null;
    }
};

export const createCoupon = async (currentState: CurrentState, data: CouponSchema) => {
    try {
        await prisma.coupon.create({
            data: {
                code: data.code,
                description: data.description,
                discount: Number(data.discount),
                forNewUser: data.forNewUser,
                forMember: data.forMember,
                isPublic: data.isPublic,
                expiredAt: new Date(data.expiredAt),
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'code is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateCoupon = async (currentState: CurrentState, data: CouponSchema) => {
    try {
        if (!data.id) {
            throw new Error('Coupon ID is required for update');
        }

        await prisma.coupon.update({
            where: { id: data.id },
            data: {
                code: data.code,
                description: data.description,
                discount: Number(data.discount),
                forNewUser: data.forNewUser,
                forMember: data.forMember,
                isPublic: data.isPublic,
                expiredAt: new Date(data.expiredAt),
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Code is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};
export const updateCouponPublic = async (couponId: string, isPublic: boolean) => {
    try {
        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
            data: { isPublic },
        });
        return { success: true, error: false, room: updatedCoupon };
    } catch (error) {
        console.error('Error updating coupon public:', error);
        return { success: false, error: true, message: 'Failed to update coupon public' };
    }
};

export const deleteCouponById = async (id: string) => {
    try {
        await prisma.coupon.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
