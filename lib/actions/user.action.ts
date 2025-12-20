'use server';

import bcrypt from 'bcrypt';

import { loginSchema, LoginSchema, signUpSchema, SignUpSchema } from '../validation/user.form';
import prisma from '../prisma';
import { generateToken } from '../auth';
import { Role, User } from '@/types/prisma';
import { AddressSchema } from '../validation/address.form';
import { addMonths } from 'date-fns';

type CurrentState = { success: boolean; error: boolean };

export const signUpUser = async (
    currentState: CurrentState,
    data: SignUpSchema,
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    user?: User & { role: Role };
}> => {
    try {
        signUpSchema().parse(data);

        // check username exists
        const existingName = await prisma.user.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            return {
                success: false,
                error: true,
                message: 'Name is already exists',
            };
        }

        // check email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            return {
                success: false,
                error: true,
                message: 'Email is already exists',
            };
        }

        // Lấy role Guest từ database
        const guestRole = await prisma.role.findUnique({
            where: { name: 'guest' },
        });

        if (!guestRole) {
            console.error('Guest role not found in database');
            return {
                success: false,
                error: true,
                message: 'Guest role not found',
            };
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Tạo người dùng mới với role Guest
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email,
                roleId: guestRole.id, // Sử dụng ID của role Guest
            },
            include: {
                role: true, // Include role information in the response
            },
        });

        // Tạo token cho người dùng
        const token = generateToken(newUser.id, newUser.role.name);

        const result = {
            success: true,
            error: false,
            token,
            userId: newUser.id,
            user: newUser,
        };
        console.log('signUpUser result:', result);

        return result;
    } catch (error) {
        console.error('Error in signUpUser:', error);

        return { success: false, error: true };
    }
};

export const signInUser = async (currentState: CurrentState, data: LoginSchema) => {
    try {
        loginSchema().parse(data);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: 'Địa chỉ email không tồn tại',
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: 'Mật khẩu không đúng',
            };
        }

        // Generate token with role information
        const token = generateToken(user.id, user.role.name);
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const isPlus = user.isPlus;

        return {
            success: true,
            error: false,
            userId,
            name,
            email,
            isPlus,
            token,
            user,
            role: user.role.name, // Include role in response
            users: {
                ...user,
                role: user.role.name,
            },
        };
    } catch (error) {
        console.error('Error in signInUser:', error);
        return { success: false, error: true, message: 'Sign in failed' };
    }
};

export const subscribePlusPlan = async (userId: string) => {
    try {
        const now = new Date();
        const expiredAt = addMonths(now, 1); // Add 1 month to current date

        const newPlan = await prisma.plusPlan.create({
            data: {
                userId,
                expiredAt,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                isPlus: true,
                isSwitchedPlus: true,
            },
        });

        return {
            success: true,
            planId: newPlan.id,
            expiredAt: newPlan.expiredAt,
        };
    } catch (error) {
        console.error('Error subscribing to Plus Plan:', error);
        return { success: false, message: 'Subscription failed' };
    }
};

export const switchToFreePlan = async (userId: string) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isSwitchedFree: true,
                isSwitchedPlus: false,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error subscribing to Plus Plan:', error);
        return { success: false, message: 'Subscription failed' };
    }
};

export const switchToPlusPlan = async (userId: string) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isSwitchedPlus: true,
                isSwitchedFree: false,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error subscribing to Plus Plan:', error);
        return { success: false, message: 'Subscription failed' };
    }
};

export const getPlanUser = async (userId: string) => {
    try {
        const plan = await prisma.plusPlan.findFirst({
            where: { userId },
            select: {
                expiredAt: true,
            },
        });
        return plan;
    } catch (error) {
        console.error(error);
    }
};

export const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isPlus: true,
                isSwitchedFree: true,
                isSwitchedPlus: true,
                createdAt: true,
                store: { select: { id: true } },
            },
        });
        return users;
    } catch (error) {
        console.error(error);
    }
};

export const getCurrentUser = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isPlus: true,
                isSwitchedFree: true,
                isSwitchedPlus: true,
                createdAt: true,
                store: { select: { id: true } },
            },
        });
        return user;
    } catch (error) {
        console.error(error);
    }
};

export const getAddressByUserId = async (userId: string) => {
    try {
        const address = await prisma.address.findFirst({
            where: { userId },
        });
        return address;
    } catch (error) {
        console.error(error);
    }
};

export const getAddressById = async (id: string) => {
    try {
        const address = await prisma.address.findFirst({
            where: { id },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                street: true,
                city: true,
                state: true,
                zip: true,
                country: true,
                phone: true,
            },
        });
        return address;
    } catch (error) {
        console.error(error);
    }
};

export const addAddress = async (currentState: CurrentState, data: AddressSchema) => {
    try {
        await prisma.address.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
                phone: data.phone,
                userId: data.userId,
            },
        });
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const changeAddress = async (currentState: CurrentState, data: AddressSchema) => {
    try {
        if (!data.id) {
            throw new Error('Address ID is required for change');
        }

        await prisma.address.update({
            where: { id: data.id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
                phone: data.phone,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true, message: 'Update failed' };
    }
};
