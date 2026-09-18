import type { Metadata } from "next";
import { endpoints } from "@/content/endpoints";
import { site } from "@/content/site";
import { LocaleRedirect } from "@/components/LocaleRedirect";

// /experience → /<locale>/experience/ for links published before the site had languages.
export const generateStaticParams = () =>
  endpoints.filter((e) => e.href !== "/").map((e) => ({ path: e.href.slice(1).split("/") }));

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await params;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: `/${site.defaultLocale}/${path.join("/")}/` },
  };
}

export default async function Redirect({ params }: PageProps<"/[...path]">) {
  const { path } = await params;
  return <LocaleRedirect to={`/${path.join("/")}/`} />;
}
