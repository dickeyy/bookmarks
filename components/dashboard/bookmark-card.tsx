import { deleteBookmark } from "@/actions/bookmarks";
import { formatDate, formatURL } from "@/lib/utils";
import { BookmarkWithCategory } from "@/types/bookmarks";
import { Copy, Edit, EllipsisVertical, ExternalLink, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default function BookmarkCard({ bookmark }: { bookmark: BookmarkWithCategory }) {
    const handleCardClick = (e: React.MouseEvent) => {
        // Check if the click is on or within the dropdown menu
        const target = e.target as Element;
        if (target.closest('[data-dropdown-trigger="true"]') || target.closest('[role="menu"]')) {
            return;
        }
        window.open(bookmark.url, "_blank", "noopener,noreferrer");
    };

    const handleCopyUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(bookmark.url);
        toast.success("URL copied to clipboard");
    };

    const handleOpenInNewTab = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(bookmark.url, "_blank", "noopener,noreferrer");
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteBookmark(bookmark.id).then((data) => {
            if (data) {
                toast.success("Bookmark deleted");
            } else {
                toast.error("Failed to delete bookmark");
            }
        });
        // reload the page
        window.location.reload();
    };

    return (
        <Card
            className="hover:bg-accent/50 h-fit cursor-pointer gap-0 p-0"
            onClick={handleCardClick}
        >
            <CardHeader className="p-3">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <CardTitle className="truncate">{bookmark.title}</CardTitle>
                        <CardDescription className="truncate" title={bookmark.url}>
                            {formatURL(bookmark.url)}
                        </CardDescription>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                data-dropdown-trigger="true"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyUrl}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy URL</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenInNewTab}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Open in new tab</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardFooter className="text-foreground/50 flex justify-between border-t p-2 text-xs">
                <p>{formatDate(bookmark.created_at)}</p>
                <p>{bookmark.categoryName}</p>
            </CardFooter>
        </Card>
    );
}
