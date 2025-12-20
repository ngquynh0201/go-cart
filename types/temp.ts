import { StaticImageData } from 'next/image';

export type ProductType = {
    id: string;
    name: string;
    description: string;
    mrp: number;
    price: number;
    images: StaticImageData[];
    category: string;
    storeId: string;
    inStock: boolean;
    store: {
        id: string;
        userId: string;
        name: string;
        description: string;
        username: string;
        address: string;
        status: string;
        isActive: boolean;
        logo: StaticImageData;
        email: string;
        contact: string;
        createdAt: string;
        updatedAt: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: StaticImageData;
        };
    };
    rating: {
        id: string;
        rating: number;
        review: string;
        user: {
            name: string;
            image: StaticImageData;
        };
        productId: string;
        createdAt: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

export type StoreType = {
    id: string;
    userId: string;
    name: string;
    description: string;
    username: string;
    address: string;
    status: string;
    isActive: boolean;
    logo: StaticImageData;
    email: string;
    contact: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        image: StaticImageData;
    };
};
