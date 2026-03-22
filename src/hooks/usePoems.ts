"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { Poem, PoemFormData } from "@/types";

export function usePoems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMyPoems = useCallback(async (): Promise<Poem[]> => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (error) { setError(error.message); return []; }
    return data ?? [];
  }, []);

  const createPoem = useCallback(async (formData: PoemFormData): Promise<Poem | null> => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return null; }

    const slug = generateSlug(formData.title);
    const { data, error } = await supabase
      .from("poems")
      .insert({ ...formData, user_id: user.id, slug })
      .select()
      .single();

    setLoading(false);
    if (error) { setError(error.message); return null; }
    return data;
  }, []);

  const updatePoem = useCallback(async (id: string, formData: Partial<PoemFormData>): Promise<Poem | null> => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("poems")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    setLoading(false);
    if (error) { setError(error.message); return null; }
    return data;
  }, []);

  const deletePoem = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("poems").delete().eq("id", id);
    setLoading(false);
    if (error) { setError(error.message); return false; }
    return true;
  }, []);

  const togglePublic = useCallback(async (id: string, isPublic: boolean): Promise<boolean> => {
    const { error } = await supabase
      .from("poems")
      .update({ is_public: isPublic })
      .eq("id", id);
    if (error) { setError(error.message); return false; }
    return true;
  }, []);

  return { loading, error, fetchMyPoems, createPoem, updatePoem, deletePoem, togglePublic };
}
