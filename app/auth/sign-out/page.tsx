import { SignOut } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    await SignOut();
    redirect("/auth/sign-in");
}
