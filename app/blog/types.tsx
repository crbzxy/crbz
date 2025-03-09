// app/blog/types.ts
import { Metadata } from "next";

export type BlogParams = {
  slug: string;
};

export type BlogProps = {
  params: BlogParams;
  searchParams?: Record<string, string | string[]>;
};

export type GenerateMetadata = (props: BlogProps) => Promise<Metadata>;