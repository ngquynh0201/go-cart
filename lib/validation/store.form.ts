import { z } from 'zod';

export const storeSchema = () => {
    return z.object({
        id: z.string().optional(),
        userId: z.string().nonempty({ message: 'Người dùng là bắt buộc' }),
        name: z.string().min(1, { message: 'Vui lòng nhập tên cửa hàng' }),
        description: z.string().min(1, { message: 'Vui lòng nhập mô tả' }),
        username: z.string().min(1, { message: 'Vui lòng nhập biệt danh' }),
        address: z.string().min(1, { message: 'Vui lòng nhập địa chỉ' }),
        logoUrls: z.array(z.string()).optional(),
        email: z.string().min(1, { message: 'Vui lòng nhập địa chỉ email' }),
        contact: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
    });
};

export type StoreSchema = z.infer<ReturnType<typeof storeSchema>>;
