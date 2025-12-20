export const currency = 'VND';

export const today = new Date().toISOString().split('T')[0];

export const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const tomorrowStr = tomorrow.toISOString().split('T')[0];

export const kConverter = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
    } else {
        return num;
    }
};

export const thousandSeparator = (num: number): string => {
    // Sử dụng hàm toLocaleString để định dạng số theo chuẩn locale (ở đây là tiếng Anh, để dùng dấu phẩy)
    // 'en-US' thường dùng dấu phẩy cho phân cách hàng nghìn
    return num.toLocaleString('en-US');

    /* * Lưu ý: Nếu muốn dùng dấu chấm (.) phân cách hàng nghìn và dấu phẩy (,) cho phần thập phân
     * theo chuẩn Việt Nam/Châu Âu, bạn có thể dùng:
     * return num.toLocaleString('de-DE'); // Ví dụ: 200000 -> '200.000'
     */
};

export const formatFullDateVn = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Thứ Tư
        year: 'numeric', // 2025
        month: 'long', // tháng 12
        day: 'numeric', // 3
        timeZone: 'Asia/Ho_Chi_Minh',
    };
    return date.toLocaleString('vi-VN', options);
};
