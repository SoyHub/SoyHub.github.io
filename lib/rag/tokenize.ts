// Shared by the build script and the runtime — BM25 stats are only valid if both tokenize alike.
// On a 36-document corpus function words are "rare" and would dominate IDF, hence the stoplist.
const STOP = new Set(
  (
    "a an the and or of to in on at for with by from as is are was were be been being do does did has have had he his him " +
    "she her it its they them their we our you your i me my what which who whom whose when where why how this that these those " +
    "there here about into over under than then so if not no yes can could would should will shall may might must any some all " +
    "tell walk give show me please " +
    "il lo la i gli le un uno una di a da in con su per tra fra e o che chi cosa come dove quando perché quale quali è sono ha " +
    "hanno sta stanno del della dei delle al alla ai alle nel nella sul sulla adesso ora lui suo sua suoi sue " +
    "هل ما من في على عن إلى هو هي هذا هذه"
  ).split(/\s+/),
);

export const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^\p{L}\p{N}+#.]+/u)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length >= 2 && !STOP.has(t));
