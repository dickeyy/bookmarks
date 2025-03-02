import { getCategories } from "@/actions/bookmarks";
import { CategoryProvider } from "@/components/context/CategoryContext";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const sb = await createClient();
    const {
        data: { user },
        error
    } = await sb.auth.getUser();

    if (error) {
        console.error(error);
    }

    if (!user) {
        redirect("/auth/sign-in");
    }

    const categories = await getCategories();
    categories.unshift({ id: 0, label: "All" });

    return (
        <SidebarProvider>
            <CategoryProvider>
                <DashboardSidebar categories={categories} />
                {children}
            </CategoryProvider>
        </SidebarProvider>
    );
}
