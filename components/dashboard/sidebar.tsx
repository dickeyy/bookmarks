"use client";

import { Category } from "@/types/bookmarks";
import { useCategory } from "../context/CategoryContext";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "../ui/sidebar";

export default function DashboardSidebar({ categories }: { categories: Category[] }) {
    const { selectedCategory, setSelectedCategory } = useCategory();

    return (
        <Sidebar>
            <SidebarContent>
                <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Categories</h2>
                    <SidebarMenu>
                        {categories.map((category) => (
                            <SidebarMenuItem key={category.id}>
                                <SidebarMenuButton
                                    isActive={selectedCategory === category.label}
                                    onClick={() => setSelectedCategory(category.label)}
                                >
                                    <span>{category.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
