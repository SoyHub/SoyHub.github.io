import { routing } from "./routing";

/** One static page per locale — export from every page, layout and image route under app/[locale]. */
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));
