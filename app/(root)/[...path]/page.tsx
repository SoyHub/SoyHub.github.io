import type { Metadata } from "next";
import { endpoints } from "@/content/endpoints";
import { LocaleRedirect } from "@/components/LocaleRedirect";
import { shareMetadata } from "@/lib/share";

// /experience → /<locale>/experience/ for links published before the site had languages.
export const generateStaticParams = () =>
  endpoints.filter((e) => e.href !== "/").map((e) => ({ path: e.href.slice(1).split("/") }));

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await params;
  return shareMetadata(`/${path.join("/")}/`);
}

export default async function Redirect({ params }: PageProps<"/[...path]">) {
  const { path } = await params;
  return <LocaleRedirect to={`/${path.join("/")}/`} />;
}
