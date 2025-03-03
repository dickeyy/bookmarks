"use server";

import { BookmarkWithCategory, Category } from "@/types/bookmarks";
import { createClient } from "@/utils/supabase/server";

export async function getCategories(): Promise<Category[]> {
    const sb = await createClient();
    const {
        data: { user },
        error
    } = await sb.auth.getUser();

    if (error || !user) {
        console.error(error);
        return [];
    }

    const { data: categories, error: categoriesError } = await sb
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

    if (categoriesError) {
        console.error(categoriesError);
        return [];
    }

    return categories.map((category) => ({
        id: category.id,
        label: category.label
    }));
}

export async function getAllBookmarks(): Promise<BookmarkWithCategory[]> {
    const sb = await createClient();
    const {
        data: { user },
        error
    } = await sb.auth.getUser();

    if (error || !user) {
        console.error(error);
        return [];
    }

    const { data: bookmarks, error: bookmarksError } = await sb
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id);

    if (bookmarksError) {
        console.error(bookmarksError);
        return [];
    }

    return bookmarks.map((bookmark) => ({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        created_at: bookmark.created_at,
        category_id: bookmark.category_id || 0
    }));
}

export async function createBookmark(bookmark: BookmarkWithCategory) {
    const sb = await createClient();
    const {
        data: { user },
        error
    } = await sb.auth.getUser();

    if (error || !user) {
        console.error(error);
        return { error: "Unauthorized" };
    }

    const { data: newBookmark, error: newBookmarkError } = await sb.from("bookmarks").insert({
        title: bookmark.title,
        url: bookmark.url,
        user_id: user.id,
        category_id: bookmark.category_id || null
    });

    if (newBookmarkError) {
        console.error(newBookmarkError);
        return { error: "Failed to create bookmark" };
    }

    return newBookmark;
}

export async function updateBookmark(bookmark: BookmarkWithCategory) {
    const sb = await createClient();
    const { data: updatedBookmark, error: updatedBookmarkError } = await sb
        .from("bookmarks")
        .update({
            title: bookmark.title,
            url: bookmark.url,
            category_id: bookmark.category_id || null
        })
        .eq("id", bookmark.id);

    if (updatedBookmarkError) {
        console.error(updatedBookmarkError);
        return { error: "Failed to update bookmark" };
    }

    return updatedBookmark;
}

export async function deleteBookmark(id: number): Promise<boolean> {
    const sb = await createClient();
    const { error: deletedBookmarkError } = await sb.from("bookmarks").delete().eq("id", id);

    if (deletedBookmarkError) {
        console.error(deletedBookmarkError);
        return false;
    }

    return true;
}
