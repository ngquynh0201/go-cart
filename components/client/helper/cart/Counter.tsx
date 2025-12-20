'use client';

import { useStore } from '@/context/StoreContext';
import { useCartStore } from '@/store/cart';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function Counter({ productId, quantity }: { productId: string; quantity?: number }) {
    const userId = Cookies.get('userId') || '';

    const { cartItemAmount, fetchCartItemAmount } = useCartStore();

    useEffect(() => {
        fetchCartItemAmount(userId, productId);
    }, [fetchCartItemAmount, userId, productId]);

    const { increaseAmount, decreaseAmount } = useStore();

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button
                onClick={() => {
                    decreaseAmount(productId);
                }}
                className="p-1 select-none"
            >
                -
            </button>
            <p className="p-1">{quantity ? quantity : cartItemAmount?.quantity}</p>
            <button
                onClick={() => {
                    increaseAmount(productId);
                }}
                className="p-1 select-none"
            >
                +
            </button>
        </div>
    );
}
