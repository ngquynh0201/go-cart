'use server';

import prisma from '../prisma';
import { ProductSchema } from '../validation/product.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getProducts = async () => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                images: {
                    select: { url: true },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: { select: { url: true } },
                        username: true,
                    },
                },
                ratings: {
                    select: { rating: true, review: true, user: { select: { name: true } }, createdAt: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error(error);
    }
};

export const getProductsByStore = async (storeId: string) => {
    try {
        const products = await prisma.product.findMany({
            where: { storeId },
            include: {
                category: true,
                images: {
                    select: { url: true },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: { select: { url: true } },
                        username: true,
                    },
                },
                ratings: {
                    select: { rating: true, review: true, user: { select: { name: true } }, createdAt: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error(error);
    }
};

export const getProductByStoreCount = async (storeId: string) => {
    try {
        const count = await prisma.product.count({
            where: { storeId },
        });
        return count;
    } catch (error) {
        console.error('Error fetching product count:', error);
        return 0;
    }
};

export const getProductCount = async () => {
    try {
        const count = await prisma.product.count({});
        return count;
    } catch (error) {
        console.error('Error fetching product count:', error);
        return 0;
    }
};

export const getProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    select: { url: true },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: { select: { url: true } },
                        username: true,
                    },
                },
                ratings: {
                    select: { rating: true, review: true, user: { select: { name: true } }, createdAt: true },
                },
            },
        });
        if (!product) {
            throw new Error('product not found');
        }

        return product;
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return null;
    }
};

export const getProductByStoreId = async (storeId: string) => {
    try {
        const product = await prisma.product.findFirst({
            where: { storeId },
            include: {
                category: true,
                images: {
                    select: { url: true },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: { select: { url: true } },
                        username: true,
                    },
                },
                ratings: {
                    select: { rating: true, review: true, user: { select: { name: true } }, createdAt: true },
                },
            },
        });
        return product;
    } catch (error) {
        console.error('Error fetching product by store id:', error);
        return null;
    }
};

export const createProduct = async (currentState: CurrentState, data: ProductSchema & { imageUrls?: string[] }) => {
    try {
        const newProduct = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                actualPrice: Number(data.actualPrice),
                offerPrice: Number(data.offerPrice),
                categoryId: data.categoryId,
                quantity: Number(data.quantity) || 0,
                inStock: Number(data.quantity) > 0 ? true : false,
                storeId: data.storeId,
            },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: newProduct.id,
                    createdAt: new Date(),
                })),
            });
        }

        await prisma.notificationAdmin.create({
            data: {
                type: 'PRODUCT',
                productId: newProduct.id,
                storeId: newProduct.storeId,
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
                message: 'Name is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateProduct = async (currentState: CurrentState, data: ProductSchema & { imageUrls?: string[] }) => {
    try {
        if (!data.id) {
            throw new Error('Product ID is required for update');
        }

        const updatedProduct = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description,
                actualPrice: Number(data.actualPrice),
                offerPrice: Number(data.offerPrice) || null,
                categoryId: data.categoryId,
                quantity: Number(data.quantity) || 0,
                inStock: Number(data.quantity) > 0 ? true : false,
                storeId: data.storeId,
            },
        });

        await prisma.image.deleteMany({
            where: { productId: updatedProduct.id },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: updatedProduct.id,
                    createdAt: new Date(),
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
                message: 'Name is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const updateProductInStock = async (productId: string, inStock: boolean) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { inStock },
        });
        return { success: true, error: false, product: updatedProduct };
    } catch (error) {
        console.error('Error updating product in stock:', error);
        return { success: false, error: true, message: 'Failed to update product in stock' };
    }
};

export const deleteProductById = async (id: string) => {
    try {
        await prisma.product.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
