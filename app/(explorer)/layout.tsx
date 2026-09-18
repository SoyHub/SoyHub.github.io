import { ExplorerProvider } from "@/components/explorer/ExplorerProvider";
import { EndpointList } from "@/components/explorer/EndpointList";
import { TopBar } from "@/components/explorer/TopBar";

export default function ExplorerLayout({ children }: LayoutProps<"/">) {
  return (
    <ExplorerProvider>
      <a
        href="#main"
        className="focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-20 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <TopBar />
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-4 px-4 py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:py-6">
        <aside className="border-hair bg-paper/95 sticky top-[49px] z-[5] -mx-4 border-b px-4 pt-2 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0">
          <EndpointList />
        </aside>
        <main id="main" className="min-w-0">
          {children}
        </main>
      </div>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
        <p className="lbl">no cookies · no analytics · content from content/profile.json</p>
      </footer>
    </ExplorerProvider>
  );
}
