"use client";

import { createBookmark, getAllBookmarks, getCategories } from "@/actions/bookmarks";
import { useCategory } from "@/components/context/CategoryContext";
import BookmarkCard from "@/components/dashboard/bookmark-card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookmarkWithCategory } from "@/types/bookmarks";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
    const { selectedCategory } = useCategory();
    const [bookmarks, setBookmarks] = useState<BookmarkWithCategory[]>([]);
    const [categories, setCategories] = useState<{ id: number; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            const [bookmarksData, categoriesData] = await Promise.all([
                getAllBookmarks(),
                getCategories()
            ]);

            // Add category name to each bookmark
            const bookmarksWithCategory = bookmarksData.map((bookmark) => {
                const category = categoriesData.find((c) => c.id === bookmark.category_id);
                return {
                    ...bookmark,
                    categoryName: category?.label || "Uncategorized"
                };
            });

            setBookmarks(bookmarksWithCategory);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredBookmarks =
        selectedCategory === "All"
            ? bookmarks
            : bookmarks.filter((bookmark) => {
                  const category = categories.find((c) => c.id === bookmark.category_id);
                  return category?.label === selectedCategory;
              });

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex flex-1 flex-col">
                <main className="flex-1 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="flex h-8 w-8 md:hidden" />
                            <h2 className="text-2xl font-bold">{selectedCategory} Bookmarks</h2>
                        </div>
                        <CreateBookmarkModal
                            categories={categories}
                            onSuccess={() => {
                                toast.success("Bookmark created successfully");
                                loadData();
                            }}
                            isOpen={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        />
                    </div>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        {isLoading ? (
                            <div className="flex justify-center p-8">Loading bookmarks...</div>
                        ) : filteredBookmarks.length === 0 ? (
                            <div className="flex justify-center p-8">You have no bookmarks yet</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredBookmarks.map((bookmark) => {
                                    return <BookmarkCard key={bookmark.id} bookmark={bookmark} />;
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}

interface CreateBookmarkModalProps {
    categories: { id: number; label: string }[];
    onSuccess: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

function CreateBookmarkModal({
    categories,
    onSuccess,
    isOpen,
    onOpenChange
}: CreateBookmarkModalProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const newBookmark: BookmarkWithCategory = {
                id: 0, // Will be assigned by the database
                title,
                url:
                    url.startsWith("http://") || url.startsWith("https://")
                        ? url
                        : "https://" + url,
                created_at: new Date().toISOString(),
                category_id: categoryId
            };

            const result = await createBookmark(newBookmark);

            if (result && "error" in result) {
                setError(result.error);
                return;
            }

            // Reset form
            setTitle("");
            setUrl("");
            setCategoryId(null);

            // Close dialog
            onOpenChange(false);

            // Refresh bookmarks
            onSuccess();
        } catch (err) {
            console.error("Error creating bookmark:", err);
            setError("Failed to create bookmark. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Bookmark</DialogTitle>
                        <DialogDescription>
                            Add a new bookmark to your collection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="title">Title</label>
                            <Input
                                id="title"
                                placeholder="Bookmark title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="url">URL</label>
                            <Input
                                id="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="category">Category (optional)</label>
                            <Select
                                value={categoryId?.toString() || "0"}
                                onValueChange={(value) =>
                                    setCategoryId(value ? parseInt(value) : null)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">None</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {error && <p className="text-destructive text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Bookmark"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
