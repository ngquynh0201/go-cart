'use server';

import prisma from '../prisma';
import { StoreSchema } from '../validation/store.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getStores = async () => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                logo: {
                    select: { url: true },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return stores;
    } catch (error) {
        console.error(error);
    }
};

export const getStoreByUsername = async (username: string) => {
    try {
        const stores = await prisma.store.findMany({
            where: { username },
            include: {
                logo: {
                    select: { url: true },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        actualPrice: true,
                        offerPrice: true,
                        images: { select: { url: true } },
                        category: true,
                        inStock: true,
                        store: {
                            select: {
                                name: true,
                                logo: { select: { url: true } },
                                username: true,
                            },
                        },
                        ratings: {
                            select: {
                                id: true,
                                rating: true,
                                review: true,
                                user: { select: { name: true } },
                                createdAt: true,
                            },
                        },
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return stores;
    } catch (error) {
        console.error(error);
    }
};

export const getStoreCount = async () => {
    try {
        const count = await prisma.store.count();
        return count;
    } catch (error) {
        console.error('Error fetching store count:', error);
        return 0;
    }
};

export const getStoreById = async (id: string) => {
    try {
        const store = await prisma.store.findUnique({
            where: { id },
            include: {
                logo: { select: { url: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!store) {
            throw new Error('store not found');
        }

        return store;
    } catch (error) {
        console.error('Error fetching store by id:', error);
        return null;
    }
};

export const getStoreByUserId = async (userId: string) => {
    try {
        const store = await prisma.store.findFirst({
            where: { userId },
            include: {
                logo: { select: { url: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return store;
    } catch (error) {
        console.error('Error fetching store by user id:', error);
        return null;
    }
};

export const createStore = async (currentState: CurrentState, data: StoreSchema & { logoUrls?: string[] }) => {
    try {
        const newStore = await prisma.store.create({
            data: {
                userId: data.userId,
                name: data.name,
                description: data.description,
                username: data.username,
                address: data.address,
                email: data.email,
                contact: data.contact,
            },
        });

        if (data.logoUrls && data.logoUrls.length > 0) {
            await prisma.image.createMany({
                data: data.logoUrls.map((url) => ({
                    url,
                    storeId: newStore.id,
                    createdAt: new Date(),
                })),
            });
        }

        await prisma.notificationAdmin.create({
            data: {
                type: 'STORE',
                storeId: newStore.id,
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
                message: 'Username is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateStore = async (currentState: CurrentState, data: StoreSchema & { logoUrls?: string[] }) => {
    try {
        if (!data.id) {
            throw new Error('Store ID is required for update');
        }

        const updatedStore = await prisma.store.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description,
                username: data.username,
                address: data.address,
                email: data.email,
                contact: data.contact,
            },
        });

        await prisma.image.deleteMany({
            where: { storeId: updatedStore.id },
        });

        if (data.logoUrls && data.logoUrls.length > 0) {
            await prisma.image.createMany({
                data: data.logoUrls.map((url) => ({
                    url,
                    storeId: updatedStore.id,
                    createdDate: new Date(),
                })),
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
                message: 'Username is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const updateStoreApproved = async (storeId: string) => {
    try {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { status: 'approved' },
        });
        return { success: true, error: false, room: updatedStore };
    } catch (error) {
        console.error('Error updating store approved:', error);
        return { success: false, error: true, message: 'Failed to update store approved' };
    }
};

export const updateStoreRejected = async (storeId: string) => {
    try {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { status: 'rejected' },
        });
        return { success: true, error: false, room: updatedStore };
    } catch (error) {
        console.error('Error updating store rejected:', error);
        return { success: false, error: true, message: 'Failed to update store rejected' };
    }
};

export const updateStoreActive = async (storeId: string, isActive: boolean) => {
    try {
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive },
        });
        return { success: true, error: false, room: updatedStore };
    } catch (error) {
        console.error('Error updating store active:', error);
        return { success: false, error: true, message: 'Failed to update store active' };
    }
};

export const deleteStoreById = async (id: string) => {
    try {
        await prisma.store.delete({
            where: {
                id,
            },
        });
        await prisma.image.deleteMany({
            where: { storeId: id },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
