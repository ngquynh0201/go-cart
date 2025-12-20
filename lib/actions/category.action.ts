'use server';

import prisma from '../prisma';
import { CategorySchema } from '../validation/category.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return categories;
    } catch (error) {
        console.error(error);
    }
};

export const getCategoryCount = async () => {
    try {
        const count = await prisma.category.count();
        return count;
    } catch (error) {
        console.error('Error fetching category count:', error);
        return 0;
    }
};

export const getCategoryById = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new Error('category not found');
        }

        return category;
    } catch (error) {
        console.error('Error fetching category by id:', error);
        return null;
    }
};

export const getCategoryName = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new Error('category not found');
        }

        return category.name;
    } catch (error) {
        console.error('Error fetching category name:', error);
        return null;
    }
};

export const createCategory = async (currentState: CurrentState, data: CategorySchema) => {
    try {
        await prisma.category.create({
            data: {
                name: data.name,
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
                message: 'name is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateCategory = async (currentState: CurrentState, data: CategorySchema) => {
    try {
        if (!data.id) {
            throw new Error('Category ID is required for update');
        }

        await prisma.category.update({
            where: { id: data.id },
            data: {
                name: data.name,
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
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const deleteCategoryById = async (id: string) => {
    try {
        await prisma.category.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
