"use client";

import { SignInWithOAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import GitHubLogo from "@/public/icons/github.svg";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthButtons() {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async (provider: "github") => {
        try {
            setLoading(true);
            const response = await SignInWithOAuth(provider);

            if (response.error) {
                toast.error(`Error signing in: ${response.error.message}`);
                console.error("Auth error:", response.error);
                return;
            }

            if (response.url) {
                window.location.href = response.url;
            } else {
                toast.error("No redirect URL received");
                console.error("No URL in response:", response);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="jsustify-center mt-8 flex w-full flex-col items-center gap-2 font-sans">
            <Button
                className="w-full cursor-pointer"
                onClick={() => handleClick("github")}
                disabled={loading}
            >
                <GitHubLogo className="h-full w-full fill-black" />
                Continue with GitHub
            </Button>
        </div>
    );
}
