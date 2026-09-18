export const VOYAGE_MODEL = "voyage-4";

// Twenty lines of fetch instead of the SDK: identical at build time and at runtime, no option-name guessing.
export async function embed(
  input: string[],
  inputType: "query" | "document",
  signal?: AbortSignal,
): Promise<number[][]> {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) throw new Error("VOYAGE_API_KEY is not set");
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: VOYAGE_MODEL, input, input_type: inputType }),
    signal,
  });
  if (!res.ok) throw new Error(`voyage ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { data: { index: number; embedding: number[] }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}
