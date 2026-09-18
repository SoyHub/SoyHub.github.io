const wrap = (open: number, close: number) => (s: string) => `\x1b[${open}m${s}\x1b[${close}m`;

export const ansi = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  yellow: wrap(33, 39),
  green: wrap(32, 39),
  cyan: wrap(36, 39),
};

export const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");
