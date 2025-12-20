/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Cart, Order, Product } from '@/app/generated/prisma/client';
import prisma from '../prisma';
import { revalidatePath } from 'next/cache';
import { CouponType } from '@/types/types';

type OrderResponse = {
    success: boolean;
    error: boolean;
    message?: string;
    data?: Order | null;
};

export type OrderStatus = 'order placed' | 'processing' | 'shipped' | 'delivered';

// Type for Cart with Product relation
type CartWithProduct = Cart & { product: Product };

export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        actualPrice: true,
                        offerPrice: true,
                        category: true,
                        images: { select: { url: true } },
                    },
                },
                status: { select: { name: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        addresses: {
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
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return orders;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getAllOrdersByStore = async (storeId: string) => {
    try {
        const orders = await prisma.order.findMany({
            where: { product: { storeId } },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        actualPrice: true,
                        offerPrice: true,
                        category: true,
                        images: { select: { url: true } },
                    },
                },
                status: { select: { name: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        addresses: {
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
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return orders;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getOrderRevenue = async () => {
    try {
        const orders = await prisma.order.findMany({
            where: { isPaid: true },
            include: {
                product: {
                    select: { actualPrice: true, offerPrice: true },
                },
            },
        });

        const coupons = await prisma.coupon.findMany({});

        const totalPrice = orders.reduce((total: number, item: any) => {
            const price = item.product.offerPrice ? item.product.offerPrice : item.product.actualPrice;
            const totalAmount = price * item.quantity;
            const couponDiscount = coupons.find((cp) => cp.code === item.coupon)?.discount || 0;

            const discountedAmount = totalAmount - (couponDiscount / 100) * totalAmount;
            return total + parseFloat(discountedAmount.toFixed(2));
        }, 0);

        return totalPrice;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getOrderRevenueStore = async (storeId: string) => {
    try {
        const orders = await prisma.order.findMany({
            where: { product: { storeId }, isPaid: true },
            include: {
                product: {
                    select: { actualPrice: true, offerPrice: true },
                },
            },
        });

        const coupons = await prisma.coupon.findMany({});

        const totalPrice = orders.reduce((total: number, item: any) => {
            const price = item.product.offerPrice ? item.product.offerPrice : item.product.actualPrice;
            const totalAmount = price * item.quantity;
            const couponDiscount = coupons.find((cp) => cp.code === item.coupon)?.discount || 0;

            const discountedAmount = totalAmount - (couponDiscount / 100) * totalAmount;
            return total + parseFloat(discountedAmount.toFixed(2));
        }, 0);

        return totalPrice;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getOrderStatuses = async () => {
    try {
        const statuses = await prisma.status.findMany({});
        return statuses;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderCount = async () => {
    try {
        const count = await prisma.order.count();
        return count;
    } catch (error) {
        console.error('Error fetching order count:', error);
        return 0;
    }
};

export const getOrderStoreCount = async (storeId: string) => {
    try {
        const count = await prisma.order.count({
            where: { product: { storeId } },
        });
        return count;
    } catch (error) {
        console.error('Error fetching order count:', error);
        return 0;
    }
};

export const getUserOrders = async (userId: string) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        actualPrice: true,
                        offerPrice: true,
                        category: true,
                        images: { select: { url: true } },
                    },
                },
                status: { select: { name: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        addresses: {
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
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return orders;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const getStatuses = async () => {
    try {
        const statuses = await prisma.status.findMany({});
        return statuses;
    } catch (error) {
        console.error(error);
    }
};

export const createOrder = async (
    userId: string,
    paymentMethod: 'COD' | 'STRIPE',
    coupon: CouponType | null,
): Promise<OrderResponse> => {
    try {
        // Start transaction
        await prisma.$transaction(async (prisma) => {
            console.log('Starting transaction');
            // 1. Get ready status
            const readyStatus = await prisma.status.findUnique({
                where: { name: 'order placed' },
            });

            if (!readyStatus) {
                throw new Error('Order placed status not found');
            }

            // 2. Get cart items
            const cartItems = await prisma.cart.findMany({
                where: { userId },
                include: { product: true },
            });

            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            for (const cartItem of cartItems) {
                if (cartItem.quantity > cartItem.product.quantity) {
                    throw new Error(`Insufficient stock for product ID ${cartItem.productId}`);
                }
            }

            // 3. Create orders for each cart item
            const orderPromises = cartItems.map(async (cartItem: CartWithProduct) => {
                // Create order
                const order = await prisma.order.create({
                    data: {
                        userId,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        statusId: readyStatus.id,
                        paymentMethod,
                        coupon: coupon?.code || null,
                        isCouponUsed: !!coupon,
                    },
                });

                // Update product quantity
                const updatedProduct = await prisma.product.update({
                    where: { id: cartItem.productId },
                    data: {
                        quantity: {
                            decrement: cartItem.quantity,
                        },
                    },
                });

                await prisma.product.update({
                    where: { id: cartItem.productId },
                    data: {
                        inStock: Number(updatedProduct.quantity) > 0 ? true : false,
                    },
                });

                if (order.coupon) {
                    await prisma.notificationAdmin.create({
                        data: {
                            type: 'ORDER',
                            orderId: order.id,
                        },
                    });
                }

                const product = await prisma.product.findFirst({
                    where: { id: order.productId },
                });

                if (product) {
                    await prisma.notificationStore.create({
                        data: {
                            storeId: product.storeId,
                            type: 'ORDER',
                            orderId: order.id,
                        },
                    });
                }

                return order;
            });

            // Wait for all orders and delivery info to be created
            const orders = await Promise.all(orderPromises);

            // 5. Clear cart
            await prisma.cart.deleteMany({
                where: { userId },
            });

            return orders;
        });

        console.log('createOrder completed successfully');
        revalidatePath('/orders');

        return {
            success: true,
            error: false,
            message: 'Orders created successfully',
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            error: true,
            message: error instanceof Error ? error.message : 'Failed to create order',
        };
    }
};

export const updateOrderStatus = async ({
    orderId,
    statusId,
}: {
    orderId: string;
    statusId: string;
}): Promise<OrderResponse> => {
    try {
        // Check if the order exists and get its current status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Prevent update if the order is cancelled
        if (order.status.name === 'Cancelled') {
            throw new Error('Cannot update a cancelled order');
        }

        // Verify the new status exists and is one of the allowed statuses
        const allowedStatuses = ['order placed', 'processing', 'shipped', 'delivered'];
        const status = await prisma.status.findUnique({
            where: { id: statusId },
        });

        if (!status) {
            throw new Error('Status not found');
        }

        if (!allowedStatuses.includes(status.name)) {
            throw new Error(`Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}`);
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/list/orders');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Update order to status ${status.name} successful`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Update order status failed',
        };
    }
};

export const updateOrderStatusByName = async (orderId: string, statusName: OrderStatus) => {
    try {
        // Get the status ID for the new status
        const status = await prisma.status.findUnique({
            where: { name: statusName },
        });

        if (!status) {
            throw new Error(`Status '${statusName}' not found`);
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true, product: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id, isPaid: statusName === 'delivered' },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/admin/list-order');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Update order to status ${statusName} successful`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Update order status failed',
        };
    }
};
