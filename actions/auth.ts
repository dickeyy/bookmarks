"use server";

import { createClient } from "@/utils/supabase/server";

export async function SignInWithOAuth(provider: "github") {
    try {
        const sb = await createClient();

        const { data, error } = await sb.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
            }
        });

        if (error) {
            return {
                error: {
                    message: error.message || "Authentication failed"
                }
            };
        }

        if (!data || !data.url) {
            return {
                error: {
                    message: "No authentication URL returned"
                }
            };
        }

        return {
            url: data.url
        };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
        return {
            error: {
                message: errorMessage
            }
        };
    }
}

export async function SignOut() {
    const sb = await createClient();
    await sb.auth.signOut();
}
