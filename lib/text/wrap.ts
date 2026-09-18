/** Word-wrap to `width` columns; continuation lines get `indent` spaces. */
export const wrapText = (text: string, width = 80, indent = 0): string[] => {
  const pad = " ".repeat(indent);
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    const limit = lines.length ? width - indent : width;
    if (candidate.length > limit && line) {
      lines.push(lines.length ? pad + line : line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(lines.length ? pad + line : line);
  return lines;
};
