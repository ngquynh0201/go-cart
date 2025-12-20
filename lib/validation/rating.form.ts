import { z } from 'zod';

export const ratingSchema = () => {
    return z.object({
        id: z.string().optional(),
        rating: z.coerce.number().min(1, { message: 'Vui lòng đánh giá 1-5 sao' }),
        review: z.string().min(1, { message: 'Vui lòng nhập nội dung đánh giá' }),
        userId: z.string().nonempty({ message: 'Người dùng là bắt buộc' }),
        productId: z.string().nonempty({ message: 'Sản phẩm là bắt buộc' }),
    });
};

export type RatingSchema = z.infer<ReturnType<typeof ratingSchema>>;
