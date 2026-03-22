export type Poem = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  language: string;
  is_public: boolean;
  slug: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export type PoemFormData = Pick<Poem, "title" | "content" | "language" | "is_public" | "tags">;

export type TranscriptStatus = "idle" | "requesting" | "recording" | "processing" | "error";

export type PoemWithAuthor = Poem & { profiles: Profile };
