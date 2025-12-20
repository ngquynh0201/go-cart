import Title from '../helper/Title';

export default function Newsletter() {
    return (
        <div className="flex flex-col items-center mx-4 my-36">
            <Title
                title="Tham gia bản tin"
                description="Đăng ký để nhận các ưu đãi độc quyền, hàng mới về và thông tin cập nhật nội bộ được gửi thẳng vào hộp thư đến của bạn hàng tuần."
                visibleButton={false}
            />
            <div className="flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200">
                <input className="flex-1 pl-5 outline-none" type="text" placeholder="Nhập địa chỉ email của bạn" />
                <button className="font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition">
                    Nhận thông tin cập nhật
                </button>
            </div>
        </div>
    );
}
