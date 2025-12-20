import { z } from 'zod';

export const productSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: 'Vui lòng nhập tên sản phẩm' }),
        description: z.string().min(1, { message: 'Vui lòng nhập mô tả' }),
        actualPrice: z.coerce.number().min(1, { message: 'Vui lòng nhập giá' }),
        offerPrice: z.coerce.number().optional(),
        imageUrls: z.array(z.string()).optional(),
        categoryId: z.string().min(1, { message: 'Danh mục là bắt buộc' }),
        inStock: z.boolean().default(true),
        quantity: z.coerce.number().default(0),
        storeId: z.string().min(1, { message: 'Cửa hàng là bắt buộc' }),
    });
};

export type ProductSchema = z.infer<ReturnType<typeof productSchema>>;
