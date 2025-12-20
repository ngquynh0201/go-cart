import { getRatings, getRatingsByStore } from '@/lib/actions/rating.action';
import { create } from 'zustand';

type Rating = {
    id: string;
    rating: number;
    review: string;
    user: { id: string; name: string };
    product: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
    };
    createdAt: Date;
};

type RatingStore = {
    ratings: Rating[] | null;
    ratingsByStore: Rating[] | null;
    fetchRatings: () => Promise<void>;
    fetchRatingsByStore: (storeId: string) => Promise<void>;
};

export const useRatingStore = create<RatingStore>((set) => ({
    ratings: null,
    fetchRatings: async () => {
        try {
            const data = await getRatings();
            set({ ratings: data });
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    },
    ratingsByStore: null,
    fetchRatingsByStore: async (storeId: string) => {
        try {
            const data = await getRatingsByStore(storeId);
            set({ ratingsByStore: data });
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    },
}));
