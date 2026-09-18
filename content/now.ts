import { NowSchema } from "./schema";
import data from "./now.json";

export const now = NowSchema.parse(data);
