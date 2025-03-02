import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
        const { error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error getting user:", error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`);
        }
    }

    if (redirectTo) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${redirectTo}`);
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
}
