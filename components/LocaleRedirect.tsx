import { site } from "@/content/site";

// Static hosts cannot negotiate the language server-side. This page picks the visitor's language in
// the browser (their earlier choice, then Accept-Language) and jumps to it; crawlers follow the
// meta refresh to the default language. `to` is the path after the locale, e.g. "/experience/".
export function LocaleRedirect({ to = "/" }: { to?: string }) {
  const script = `(function(){var L=${JSON.stringify(site.locales)},d=${JSON.stringify(site.defaultLocale)},p=${JSON.stringify(to)};var c=null;try{c=localStorage.getItem("locale")}catch(e){}var w=[c].concat(navigator.languages||[navigator.language]).filter(Boolean).map(function(s){return s.toLowerCase().split("-")[0]});var l=w.find(function(x){return L.indexOf(x)>=0})||d;location.replace("/"+l+p+location.search+location.hash)})()`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=/${site.defaultLocale}${to}`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p style={{ fontFamily: "monospace", padding: 16 }}>
        <a href={`/${site.defaultLocale}${to}`}>
          → /{site.defaultLocale}
          {to}
        </a>
      </p>
    </>
  );
}
