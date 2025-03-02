"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type CategoryContextType = {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({
    children,
    initialCategory = "All"
}: {
    children: ReactNode;
    initialCategory?: string;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

    return (
        <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategory() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
}
