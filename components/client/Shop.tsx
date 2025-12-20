
import { Suspense } from "react";
import ShopContent from "./helper/ShopContent";

export default function Shop() {
    return (
        <Suspense fallback={<div className="text-center p-10">Đang tải...</div>}>
            <ShopContent />
        </Suspense>
    );
}
