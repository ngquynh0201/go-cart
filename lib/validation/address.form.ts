import { z } from 'zod';

export const addressSchema = () => {
    return z.object({
        id: z.string().optional(),
        firstName: z.string().min(1, { message: 'Vui lòng nhập họ' }),
        lastName: z.string().min(1, { message: 'Vui lòng nhập tên' }),
        email: z
            .string()
            .min(1, { message: 'Vui lòng nhập địa chỉ email' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
        street: z.string().min(1, { message: 'Vui lòng nhập đường' }),
        city: z.string().min(1, { message: 'Vui lòng nhập thành phố' }),
        state: z.string().min(1, { message: 'Vui lòng nhập quận/huyện' }),
        zip: z.string().min(1, { message: 'Vui lòng nhập mã zip' }),
        country: z.string().min(1, { message: 'Vui lòng nhập quốc gia' }),
        phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
        userId: z.string().min(1, { message: 'Người dùng là bắt buộc' }),
    });
};

export type AddressSchema = z.infer<ReturnType<typeof addressSchema>>;
