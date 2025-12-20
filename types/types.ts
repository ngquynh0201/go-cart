export type StoreType = {
    id: string;
    name: string;
    description: string;
    username: string;
    address: string;
    status: string;
    isActive: boolean;
    logo: { url: string }[];
    user: {
        id: string;
        name: string;
        email: string;
    };
    email: string;
    contact: string;
    createdAt: Date;
};

export type ProductType = {
    id: string;
    name: string;
    description: string;
    actualPrice: number;
    offerPrice: number | null;
    images: { url: string }[];
    category: {
        id: string;
        name: string;
        createdAt: Date;
    };
    inStock: boolean;
    store: { name: string; logo: { url: string }[]; username: string };
    ratings: { rating: number; review: string; user: { name: string }; createdAt: Date }[];
    createdAt: Date;
};

export type CartType = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        actualPrice: number;
        offerPrice: number | null;
        images: { url: string }[];
    };
};

export type CouponType = {
    id: string;
    code: string;
    description: string;
    discount: number;
    forNewUser: boolean;
    forMember: boolean;
    isPublic: boolean;
    expiredAt: Date;
    createdAt: Date;
};

export type AddressType = {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
};

export type OrderType = {
    id: string;
    product: {
        id: string;
        name: string;
        actualPrice: number;
        offerPrice: number | null;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        images: { url: string }[];
    };
    status: { name: string };
    user: {
        id: string;
        name: string;
        email: string;
        addresses: {
            firstName: string;
            lastName: string;
            email: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            phone: string;
        }[];
    };
    quantity: number;
    createdAt: Date;
    coupon: string | null;
    isCouponUsed: boolean;
    isPaid: boolean;
    paymentMethod: 'COD' | 'STRIPE';
};

export type UserType = {
    id: string;
    name: string;
    email: string;
    isPlus: boolean;
    isSwitchedFree: boolean;
    isSwitchedPlus: boolean;
    store: { id: string }[];
    createdAt: Date;
};

export type PlanUserType = {
    expiredAt: Date;
};
