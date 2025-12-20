/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    addToCart,
    getCartItems,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
    removeFromCart,
    getCartTotals,
    updateCartItemQuantity,
    getItemAmountByProductId,
} from '@/lib/actions/cart.action';
import { getUserIdFromCookie } from '@/lib/auth';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';

type ProductType = {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    discount: number;
    images: { url: string }[];
    inStock: boolean;
};

type CartItem = {
    id: string;
    product: ProductType;
    quantity: number;
};

type StoreContextType = {
    handleAddToCart: (productId: string, size?: string) => Promise<void>;
    cart: CartItem[];
    handleRemoveFromCart: (productId: string) => Promise<void>;
    increaseAmount: (productId: string) => Promise<void>;
    decreaseAmount: (productId: string) => Promise<void>;
    getItemAmountFromProduct: (productId: string) => Promise<{ quantity: number } | null | undefined>;
    handleUpdateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
    cartTotal: number;
    itemAmount: number;
    updateCart: () => Promise<void>;
};

export const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { fetchCartItemAmount, fetchCartItems } = useCartStore();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [itemAmount, setItemAmount] = useState(0);

    const updateCart = async () => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                setCart([]);
                setItemAmount(0);
                setCartTotal(0);
                return;
            }

            const cartItems = await getCartItems(userId);
            const { itemAmount, cartTotal } = await getCartTotals(userId);

            setCart(
                cartItems.map((item: any) => ({
                    id: item.id,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        image: item.product.images[0]?.url || '/placeholder.png',
                        price: item.product.price,
                        discount: item.product.discount,
                        description: item.product.description,
                        images: item.product.images,
                        category: item.product.category,
                        inStock: item.product.inStock,
                    },
                    quantity: item.quantity,
                    size: item.size,
                })),
            );
            setItemAmount(itemAmount);
            setCartTotal(cartTotal);
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Update cart failed');
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateCart();
    }, []);

    const handleAddToCart = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                toast.error('Vui lòng đăng nhập!!');
                return;
            }

            const result = await addToCart(userId, productId);
            if (result.success) {
                await updateCart();
                toast.success('Thêm vào giỏ hàng thành công!!');
                fetchCartItemAmount(userId, productId);
                fetchCartItems();
            } else {
                toast.error(result.error || 'Thêm vào giỏ hàng thất bại!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Thêm vào giỏ hàng thất bại!');
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await removeFromCart(userId, productId);
            if (result.success) {
                await updateCart();
                toast.success('Xóa khỏi giỏ hàng thành công!');
                fetchCartItemAmount(userId, productId);
                fetchCartItems();
            } else {
                toast.error(result.error || 'Xóa khỏi giỏ hàng thất bại!');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Xóa khỏi giỏ hàng thất bại!');
        }
    };

    const increaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await increaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
                toast.success('Tăng số lương thành công!');
                fetchCartItemAmount(userId, productId);
                fetchCartItems();
            } else {
                toast.error(result.error || 'Tăng thất bại!');
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            toast.error('Tăng thất bại!');
        }
    };

    const decreaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await decreaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
                toast.success('Giảm số lượng thành công!');
                fetchCartItemAmount(userId, productId);
                fetchCartItems();
            } else {
                toast.error(result.error || 'Giảm số lượng thất bại!');
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            toast.error('Giảm số lượng thất bại!');
        }
    };

    const getItemAmountFromProduct = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await getItemAmountByProductId(userId, productId);
            return result;
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            toast.error('Decrease failed!');
        }
    };

    const handleUpdateCartItemQuantity = async (productId: string, quantity: number) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await updateCartItemQuantity(userId, productId, quantity);
            if (result.success) {
                await updateCart();
                toast.success('Cập nhật số lượng thành công!');
            } else {
                toast.error(result.error || 'Cập nhật số lượng thất bại!');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Cập nhật số lượng thất bại!');
        }
    };

    const contextValue = {
        handleAddToCart,
        cart,
        handleRemoveFromCart,
        increaseAmount,
        decreaseAmount,
        getItemAmountFromProduct,
        handleUpdateCartItemQuantity,
        cartTotal,
        itemAmount,
        updateCart,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreContext');
    }
    return context;
};
