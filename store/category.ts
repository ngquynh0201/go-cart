import { getCategories, getCategoryById } from '@/lib/actions/category.action';
import { create } from 'zustand';

type Category = {
    id: string;
    name: string;
    createdAt: Date;
};

type CategoryStore = {
    categories: Category[] | null;
    category: Category | null;
    fetchCategories: () => Promise<void>;
    fetchCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    fetchCategories: async () => {
        try {
            const data = await getCategories();
            set({ categories: data });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },
    category: null,
    fetchCategory: async (id: string) => {
        try {
            const data = await getCategoryById(id);
            set({ category: data });
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    },
}));
