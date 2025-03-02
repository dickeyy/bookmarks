export type BookmarkWithCategory = {
    id: number;
    title: string;
    url: string;
    created_at: string;
    category_id: number | null;
    categoryName?: string;
};

export type Category = {
    id: number;
    label: string;
};
