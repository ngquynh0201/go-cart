import { z } from 'zod';

export const categorySchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: 'Vui lòng nhập tên danh mục' }),
    });
};

export type CategorySchema = z.infer<ReturnType<typeof categorySchema>>;
