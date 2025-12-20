'use server';

import prisma from '../prisma';
import { RatingSchema } from '../validation/rating.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getRatings = async () => {
    try {
        const ratings = await prisma.rating.findMany({
            include: {
                user: { select: { id: true, name: true } },
                product: { select: { id: true, name: true, category: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return ratings;
    } catch (error) {
        console.error(error);
    }
};

export const getRatingProduct = async (userId: string, productId: string) => {
    try {
        const rating = await prisma.rating.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            select: {
                rating: true,
            },
        });
        return rating?.rating || 0;
    } catch (error) {
        console.error(error);
    }
};

export const getRatingsByStore = async (storeId: string) => {
    try {
        console.log('🔍 Querying ratings for storeId:', storeId); // Log input

        const ratings = await prisma.rating.findMany({
            where: { product: { storeId } },
            include: {
                user: { select: { id: true, name: true } },
                product: { select: { id: true, name: true, category: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log('📊 Ratings found:', ratings.length, 'items:', ratings); // Log output
        return ratings;
    } catch (error) {
        console.error('❌ Error in getRatingsByStore:', error); // Log full error
        return []; // Return empty array thay vì undefined để safe
    }
};

export const getRatingStoreCount = async (storeId: string) => {
    try {
        const count = await prisma.rating.count({
            where: { product: { storeId } },
        });
        return count;
    } catch (error) {
        console.error(error);
    }
};

export const getRatingCount = async () => {
    try {
        const count = await prisma.rating.count({});
        return count;
    } catch (error) {
        console.error(error);
    }
};

export const createRating = async (currentState: CurrentState, data: RatingSchema) => {
    try {
        const newRating = await prisma.rating.create({
            data: {
                rating: Number(data.rating),
                review: data.review,
                userId: data.userId,
                productId: data.productId,
            },
        });

        const product = await prisma.product.findFirst({
            where: { id: newRating.productId },
        });

        if (product) {
            await prisma.notificationStore.create({
                data: {
                    storeId: product.storeId,
                    type: 'RATING',
                    ratingId: newRating.id,
                },
            });
        }

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'review is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};
