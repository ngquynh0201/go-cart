'use client';

import { Star } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ratingSchema, RatingSchema } from '@/lib/validation/rating.form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { createRating } from '@/lib/actions/rating.action';
import { useRouter } from 'next/navigation';

interface RatingModalProps {
    userId: string;
    productId: string;
    ratingModal: boolean;
    setRatingModal: Dispatch<SetStateAction<boolean>>;
    fetchRating: () => Promise<void>;
}

export default function RatingModal({ userId, productId, setRatingModal, fetchRating }: RatingModalProps) {
    const [rating, setRating] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<RatingSchema>({
        resolver: zodResolver(ratingSchema()),
        defaultValues: {
            userId,
            productId,
            rating: 0,
        },
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(createRating, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const data = { ...formData, userId, productId, rating };
        formAction(data);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Đánh giá thành công!!');
            router.refresh();

            reset();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasSubmitted(false);
            setRatingModal(false);
            fetchRating();
        } else if (state.error) {
            toast.error(state.message || 'Đánh giá thất bại');
        }
    }, [state, router, hasSubmitted, reset, setRatingModal, fetchRating]);

    return (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/10">
            <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={() => setRatingModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <XIcon size={20} />
                </button>
                <h2 className="text-xl font-medium text-slate-600 mb-4">Đánh giá sản phẩm</h2>
                <div className="flex items-center justify-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${
                                rating > i ? 'text-green-400 fill-current' : 'text-gray-300'
                            }`}
                            onClick={() => {
                                setRating(i + 1);
                                setValue('rating', i + 1, { shouldValidate: true });
                            }}
                        />
                    ))}
                </div>
                <input
                    type="number"
                    {...register('rating', { valueAsNumber: true })}
                    value={rating}
                    className="hidden"
                    min={1}
                    max={5}
                />
                {errors.rating && (
                    <p className="text-xs text-red-400 max-w-[300px] mb-4">{errors.rating.message?.toString()}</p>
                )}
                <textarea
                    placeholder="Viết đánh giá của bạn (tùy chọn)"
                    {...register('review')}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                    rows={4}
                ></textarea>
                {errors.review?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.review?.message.toString()}</p>
                )}
                <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full bg-green-500 disabled:bg-green-300 disabled:cursor-not-allowed text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                    Gửi xếp hạng
                </button>
            </form>
        </div>
    );
}
