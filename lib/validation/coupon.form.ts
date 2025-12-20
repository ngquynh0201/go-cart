import { z } from 'zod';

export const couponSchema = () => {
    return z.object({
        id: z.string().optional(),
        code: z.string().min(1, { message: 'Vui lòng nhập mã giảm giá' }),
        description: z.string().min(1, { message: 'Vui lòng nhập mô tả' }),
        discount: z.coerce.number().min(1, { message: 'Vui lòng nhập số phần trăm giảm' }),
        forNewUser: z.boolean(),
        forMember: z.boolean().default(false),
        isPublic: z.boolean(),
        expiredAt: z.coerce.date(),
    });
};

export type CouponSchema = z.infer<ReturnType<typeof couponSchema>>;
