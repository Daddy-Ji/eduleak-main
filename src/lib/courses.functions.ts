import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ---------- Public reads ----------

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const [settings, coachings, exams, latest, portals, institutes, why, audience, testSeriesCount] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", "singleton").maybeSingle(),
    sb.from("coachings").select("*").order("display_order"),
    sb.from("exams").select("*").order("display_order"),
    sb.from("courses")
      .select("id, slug, title, description, cover_url, course_type, coaching:coachings(name,slug,logo_url), exam:exams(name,slug), created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(8),
    sb.from("portals").select("*").eq("is_active", true).order("display_order").order("created_at", { ascending: false }),
    sb.from("featured_institutes").select("*").order("display_order"),
    sb.from("why_us").select("*").order("display_order"),
    sb.from("audience").select("*").order("display_order"),
    sb.from("test_series").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);
  return {
    settings: settings.data,
    coachings: coachings.data ?? [],
    exams: exams.data ?? [],
    latest: (latest.data ?? []) as any[],
    portals: portals.data ?? [],
    institutes: institutes.data ?? [],
    why: why.data ?? [],
    audience: audience.data ?? [],
    testSeriesCount: testSeriesCount.count ?? 0,
  };
});

export const getTestSeries = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb.from("test_series").select("*").eq("is_active", true)
    .order("display_order").order("created_at", { ascending: false });
  return data ?? [];
});

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb.from("site_settings").select("*").eq("id", "singleton").maybeSingle();
  return data;
});

export const listCourses = createServerFn({ method: "GET" })
  .inputValidator(z.object({
    coachingSlug: z.string().optional(),
    examSlug: z.string().optional(),
    type: z.enum(["youtube", "pdf", "external"]).optional(),
    q: z.string().optional(),
  }).optional())
  .handler(async ({ data }) => {
    const sb = await admin();
    let q = sb.from("courses")
      .select("id, slug, title, description, cover_url, course_type, coaching:coachings(name,slug,logo_url), exam:exams(name,slug), coaching_id, exam_id")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (data?.type) q = q.eq("course_type", data.type);
    if (data?.q) q = q.ilike("title", `%${data.q}%`);
    const { data: rows } = await q;
    let filtered = (rows ?? []) as any[];
    if (data?.coachingSlug) filtered = filtered.filter((r) => r.coaching?.slug === data.coachingSlug);
    if (data?.examSlug) filtered = filtered.filter((r) => r.exam?.slug === data.examSlug);
    return filtered;
  });

export const getCourseBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: course } = await sb.from("courses")
      .select("*, coaching:coachings(*), exam:exams(*)")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!course) return null;
    const [lessons, files] = await Promise.all([
      sb.from("lessons").select("*").eq("course_id", course.id).order("display_order"),
      sb.from("course_files").select("*").eq("course_id", course.id).order("display_order"),
    ]);
    return { course, lessons: lessons.data ?? [], files: files.data ?? [] };
  });

export const getCoachingBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: coaching } = await sb.from("coachings").select("*").eq("slug", data.slug).maybeSingle();
    if (!coaching) return null;
    const { data: courses } = await sb.from("courses")
      .select("id, slug, title, description, cover_url, course_type, coaching:coachings(name,slug,logo_url), exam:exams(name,slug)")
      .eq("coaching_id", coaching.id)
      .eq("is_published", true)
      .order("display_order");
    return { coaching, courses: courses ?? [] };
  });

export const getExamBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: exam } = await sb.from("exams").select("*").eq("slug", data.slug).maybeSingle();
    if (!exam) return null;
    const { data: courses } = await sb.from("courses")
      .select("id, slug, title, description, cover_url, course_type, coaching:coachings(name,slug,logo_url), exam:exams(name,slug)")
      .eq("exam_id", exam.id)
      .eq("is_published", true)
      .order("display_order");
    return { exam, courses: courses ?? [] };
  });

export const listCoachings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb.from("coachings").select("*").order("display_order");
  return data ?? [];
});

export const listExams = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb.from("exams").select("*").order("display_order");
  return data ?? [];
});
