import slugify from "slugify";
import { nanoid } from "nanoid";

export function generateSlug(title: string): string {
  const base = slugify(title || "untitled", {
    lower: true,
    strict: true,
    trim: true,
  });
  const suffix = nanoid(6);
  return `${base || "poem"}-${suffix}`;
}
