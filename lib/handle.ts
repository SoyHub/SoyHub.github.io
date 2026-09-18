/** "https://github.com/octocat" → "octocat"; "https://www.linkedin.com/in/octocat/" → "octocat". */
export const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? "";
