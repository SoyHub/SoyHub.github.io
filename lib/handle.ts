/** "https://github.com/soyhub" → "soyhub"; "https://www.linkedin.com/in/sohayb/" → "sohayb". */
export const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? "";
