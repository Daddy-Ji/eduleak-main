import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile } from "@/lib/storage";
import { SignedImage } from "@/components/SignedImage";
import { extractYouTubeId } from "@/lib/utils-youtube";
import { Trash2, Plus, Save, LogOut, ShieldAlert, Upload, ImagePlus, Loader2, GraduationCap, BookOpen, Video, FileText, Layers, TrendingUp, ListVideo, FileJson, Wand2 } from "lucide-react";
import { PortalsAdmin, InstitutesAdmin, WhyAdmin, AudienceAdmin, NotificationsAdmin } from "@/components/admin/SimpleCMS";

// Styled logo upload button — drag/drop + click, with preview
function LogoUploader({
  bucket, value, onChange, size = "lg",
}: { bucket: string; value?: string | null; onChange: (path: string) => void; size?: "sm" | "lg" }) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  
  const handle = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please pick an image");
    setBusy(true);
    try { const path = await uploadFile(bucket, file); onChange(path); toast.success("Logo uploaded"); }
    catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };
  const dim = size === "lg" ? "h-32" : "h-20";
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
      className={`group relative flex ${dim} cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all overflow-hidden ${
        drag ? "border-primary bg-primary/10 scale-[1.02]" : "border-border bg-muted/40 hover:border-primary/60 hover:bg-primary/5"
      }`}
    >
      <input type="file" accept="image/*" className="sr-only"
        onChange={(e) => handle(e.target.files?.[0])} />
      {value ? (
        <>
          <SignedImage bucket={bucket} path={value} alt="logo" className="h-full w-full object-contain p-2" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Replace logo</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition">
          {busy ? <Loader2 className="h-7 w-7 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
          <div className="text-sm font-medium">{busy ? "Uploading…" : "Click or drop logo here"}</div>
          <div className="text-xs">PNG, JPG, SVG up to ~5MB</div>
        </div>
      )}
    </label>
  );
}


export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | EduLeak" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "stats" | "courses" | "coachings" | "exams" | "portals" | "institutes" | "why" | "audience" | "notifications" | "import" | "settings";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("stats");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) return <div className="p-8 text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <ShieldAlert className="h-10 w-10 mx-auto text-destructive mb-3" />
        <h1 className="font-display text-2xl">Admin access required</h1>
        <p className="text-muted-foreground mt-2">
          Your account isn't an admin. The pre-seeded admin email is <code className="bg-muted px-1.5 py-0.5 rounded">business.pokesparky@gmail.com</code> —
          sign up with that address to gain admin access.
        </p>
        <Link to="/" className="inline-block mt-4 text-primary hover:underline">Go home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Admin dashboard</h1>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()} className="gap-1.5">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
      <div className="flex gap-1 border-b mb-6 overflow-auto">
        {(["stats", "courses", "coachings", "exams", "portals", "institutes", "why", "audience", "notifications", "import", "settings"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize whitespace-nowrap transition ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t}
          </button>
        ))}
      </div>
      {tab === "stats" && <StatsAdmin />}
      {tab === "courses" && <CoursesAdmin />}
      {tab === "coachings" && <CoachingsAdmin />}
      {tab === "exams" && <ExamsAdmin />}
      {tab === "portals" && <PortalsAdmin />}
      {tab === "institutes" && <InstitutesAdmin />}
      {tab === "why" && <WhyAdmin />}
      {tab === "audience" && <AudienceAdmin />}
      {tab === "notifications" && <NotificationsAdmin />}
      {tab === "import" && <ImportAdmin />}
      {tab === "settings" && <SettingsAdmin />}
    </div>
  );
}

// ============ Coachings ============
function CoachingsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "", logo_url: "", display_order: 0 });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("coachings").select("*").order("display_order");
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug are required");
    setBusy(true);
    const { error } = await supabase.from("coachings").insert(form);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Coaching added");
    setForm({ name: "", slug: "", description: "", logo_url: "", display_order: 0 });
    load();
  };

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("coachings").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coaching?")) return;
    const { error } = await supabase.from("coachings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };




  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-primary/10 p-2"><GraduationCap className="h-5 w-5 text-primary" /></div>
          <h3 className="font-display text-lg font-semibold">Add a coaching institute</h3>
        </div>
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="px-3 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/30 outline-none transition" placeholder="Name (e.g. Allen)"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="px-3 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/30 outline-none transition" placeholder="Slug (e.g. allen)"
              value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })} />
            <textarea className="sm:col-span-2 px-3 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[88px]" placeholder="Short description"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button className="sm:col-span-2 mt-1" onClick={create} disabled={busy} size="lg">
              {busy ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
              Add coaching
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <LogoUploader bucket="coaching-logos" value={form.logo_url}
              onChange={(p) => setForm({ ...form, logo_url: p })} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="group rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <LogoUploader bucket="coaching-logos" value={c.logo_url}
              onChange={(p) => update(c.id, { logo_url: p })} size="sm" />
            <div className="mt-3 space-y-2">
              <input defaultValue={c.name} className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-sm font-medium"
                onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })} />
              <input defaultValue={c.slug} className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-xs text-muted-foreground"
                onBlur={(e) => e.target.value !== c.slug && update(c.id, { slug: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="number" defaultValue={c.display_order} className="px-2 py-1.5 rounded-lg border bg-background w-20 text-xs"
                  onBlur={(e) => Number(e.target.value) !== c.display_order && update(c.id, { display_order: Number(e.target.value) })} />
                <span className="text-xs text-muted-foreground">order</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => remove(c.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center text-muted-foreground text-sm p-10 border rounded-2xl border-dashed">
            No coachings yet — add your first above.
          </div>
        )}
      </div>
    </div>
  );
}


// ============ Exams ============
function ExamsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "", display_order: 0 });
  const load = async () => { const { data } = await supabase.from("exams").select("*").order("display_order"); setItems(data ?? []); };
  useEffect(() => { load(); }, []);
  const create = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    const { error } = await supabase.from("exams").insert(form);
    if (error) toast.error(error.message); else { toast.success("Added"); setForm({ name: "", slug: "", description: "", display_order: 0 }); load(); }
  };
  const update = async (id: string, patch: any) => { const { error } = await supabase.from("exams").update(patch).eq("id", id); if (error) toast.error(error.message); else load(); };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; const { error } = await supabase.from("exams").delete().eq("id", id); if (error) toast.error(error.message); else load(); };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold mb-3">Add exam</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-lg border" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="px-3 py-2 rounded-lg border" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })} />
          <textarea className="sm:col-span-2 px-3 py-2 rounded-lg border" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button className="mt-3" onClick={create}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">
        {items.map((e) => (
          <div key={e.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <input defaultValue={e.name} className="px-2 py-1.5 rounded border flex-1" onBlur={(ev) => ev.target.value !== e.name && update(e.id, { name: ev.target.value })} />
            <input defaultValue={e.slug} className="px-2 py-1.5 rounded border flex-1" onBlur={(ev) => ev.target.value !== e.slug && update(e.id, { slug: ev.target.value })} />
            <Button variant="ghost" size="sm" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Courses ============
function CoursesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [coachings, setCoachings] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const [c, co, ex] = await Promise.all([
      supabase.from("courses").select("*, coaching:coachings(name), exam:exams(name)").order("created_at", { ascending: false }),
      supabase.from("coachings").select("*").order("display_order"),
      supabase.from("exams").select("*").order("display_order"),
    ]);
    setItems(c.data ?? []); setCoachings(co.data ?? []); setExams(ex.data ?? []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete course and all its lessons?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  if (editing) return <CourseEditor course={editing} coachings={coachings} exams={exams} onDone={() => { setEditing(null); load(); }} />;

  return (
    <div className="space-y-4">
      <Button onClick={() => setEditing({ _new: true, course_type: "youtube", is_published: true, display_order: 0 })}>
        <Plus className="h-4 w-4 mr-1" /> New course
      </Button>
      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <SignedImage bucket="course-covers" path={c.cover_url} alt={c.title} className="h-14 w-20 rounded object-cover bg-muted" />
            <div className="flex-1">
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">
                {c.coaching?.name ?? "—"} • {c.exam?.name ?? "—"} • {c.course_type} • {c.is_published ? "Published" : "Draft"}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(c)}>Edit</Button>
            <Button variant="ghost" size="sm" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground text-sm p-6 text-center border rounded-xl">No courses yet.</div>}
      </div>
    </div>
  );
}

function CourseEditor({ course, coachings, exams, onDone }: any) {
  const [f, setF] = useState({
    title: course.title ?? "",
    slug: course.slug ?? "",
    description: course.description ?? "",
    cover_url: course.cover_url ?? "",
    course_type: course.course_type ?? "youtube",
    coaching_id: course.coaching_id ?? "",
    exam_id: course.exam_id ?? "",
    external_url: course.external_url ?? "",
    is_published: course.is_published ?? true,
    display_order: course.display_order ?? 0,
  });
  const [lessons, setLessons] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({ title: "", youtube_url: "" });
  const [busy, setBusy] = useState(false);
  const id = course.id;

  useEffect(() => {
    if (!id) return;
    supabase.from("lessons").select("*").eq("course_id", id).order("display_order").then(({ data }) => setLessons(data ?? []));
    supabase.from("course_files").select("*").eq("course_id", id).order("display_order").then(({ data }) => setFiles(data ?? []));
  }, [id]);

  const save = async () => {
    if (!f.title || !f.slug) return toast.error("Title and slug required");
    setBusy(true);
    const payload = { ...f, coaching_id: f.coaching_id || null, exam_id: f.exam_id || null };
    const res = course._new
      ? await supabase.from("courses").insert(payload).select().single()
      : await supabase.from("courses").update(payload).eq("id", id).select().single();
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    onDone();
  };

  const addLesson = async () => {
    const yid = extractYouTubeId(newLesson.youtube_url);
    if (!yid) return toast.error("Invalid YouTube URL");
    if (!newLesson.title) return toast.error("Lesson title required");
    const { error } = await supabase.from("lessons").insert({
      course_id: id, title: newLesson.title, youtube_url: newLesson.youtube_url, youtube_id: yid,
      display_order: lessons.length,
    });
    if (error) return toast.error(error.message);
    setNewLesson({ title: "", youtube_url: "" });
    const { data } = await supabase.from("lessons").select("*").eq("course_id", id).order("display_order");
    setLessons(data ?? []);
  };
  const delLesson = async (lid: string) => {
    await supabase.from("lessons").delete().eq("id", lid);
    setLessons(lessons.filter((l) => l.id !== lid));
  };

  const addFile = async (file: File) => {
    try {
      const path = await uploadFile("course-files", file);
      const { error } = await supabase.from("course_files").insert({
        course_id: id, name: file.name, file_url: path, display_order: files.length,
      });
      if (error) throw error;
      const { data } = await supabase.from("course_files").select("*").eq("course_id", id).order("display_order");
      setFiles(data ?? []);
      toast.success("File uploaded");
    } catch (e: any) { toast.error(e.message); }
  };
  const delFile = async (fid: string) => {
    await supabase.from("course_files").delete().eq("id", fid);
    setFiles(files.filter((x) => x.id !== fid));
  };

  const uploadCover = async (file: File) => {
    try { const path = await uploadFile("course-covers", file); setF({ ...f, cover_url: path }); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <button onClick={onDone} className="text-sm text-muted-foreground hover:text-foreground">← Back to courses</button>

      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h3 className="font-display text-xl font-semibold">{course._new ? "New course" : "Edit course"}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-lg border" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <input className="px-3 py-2 rounded-lg border" placeholder="Slug" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
          <textarea className="sm:col-span-2 px-3 py-2 rounded-lg border" placeholder="Description" rows={3}
            value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <select className="px-3 py-2 rounded-lg border bg-background" value={f.coaching_id} onChange={(e) => setF({ ...f, coaching_id: e.target.value })}>
            <option value="">— Coaching —</option>
            {coachings.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg border bg-background" value={f.exam_id} onChange={(e) => setF({ ...f, exam_id: e.target.value })}>
            <option value="">— Exam —</option>
            {exams.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg border bg-background" value={f.course_type} onChange={(e) => setF({ ...f, course_type: e.target.value as any })}>
            <option value="youtube">YouTube video series (stays on our site)</option>
            <option value="pdf">PDF / notes</option>
            <option value="external">External redirect</option>
          </select>
          {f.course_type === "external" && (
            <input className="px-3 py-2 rounded-lg border" placeholder="External URL" value={f.external_url} onChange={(e) => setF({ ...f, external_url: e.target.value })} />
          )}
          <div className="sm:col-span-2 flex items-center gap-4">
            <label className="text-sm">Cover image:</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
            {f.cover_url && <SignedImage bucket="course-covers" path={f.cover_url} alt="cover" className="h-14 w-20 rounded object-cover" />}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Published
          </label>
          <input type="number" placeholder="Display order" className="px-3 py-2 rounded-lg border" value={f.display_order}
            onChange={(e) => setF({ ...f, display_order: Number(e.target.value) })} />
        </div>
        <Button onClick={save} disabled={busy}><Save className="h-4 w-4 mr-1" /> Save course</Button>
      </div>

      {!course._new && f.course_type === "youtube" && (
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h3 className="font-semibold">YouTube lessons</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input className="flex-1 px-3 py-2 rounded-lg border" placeholder="Lesson title"
              value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} />
            <input className="flex-1 px-3 py-2 rounded-lg border" placeholder="YouTube URL"
              value={newLesson.youtube_url} onChange={(e) => setNewLesson({ ...newLesson, youtube_url: e.target.value })} />
            <Button onClick={addLesson}><Plus className="h-4 w-4" /></Button>
          </div>
          <ul className="space-y-1">
            {lessons.map((l, i) => (
              <li key={l.id} className="flex items-center gap-3 p-2 rounded border">
                <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                <span className="flex-1 text-sm">{l.title}</span>
                <span className="text-xs text-muted-foreground">{l.youtube_id}</span>
                <Button variant="ghost" size="sm" onClick={() => delLesson(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!course._new && (
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h3 className="font-semibold">Attached files (PDFs, notes)</h3>
          <input type="file" onChange={(e) => e.target.files?.[0] && addFile(e.target.files[0])} />
          <ul className="space-y-1">
            {files.map((x) => (
              <li key={x.id} className="flex items-center gap-3 p-2 rounded border">
                <span className="flex-1 text-sm">{x.name}</span>
                <Button variant="ghost" size="sm" onClick={() => delFile(x.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============ Settings ============
function SettingsAdmin() {
  const [f, setF] = useState<any>({ telegram_url: "", hero_title: "", hero_subtitle: "", site_name: "EduLeak", site_logo_url: "", tagline: "", portals_title: "", portals_subtitle: "", institutes_title: "", institutes_subtitle: "", why_title: "", why_subtitle: "", who_title: "", who_subtitle: "", cta_title: "", cta_subtitle: "", cta_button_text: "", cta_button_url: "", footer_text: "", intro_animation_enabled: true, telegram_popup_enabled: true, founders: "[]" });
  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", "singleton").maybeSingle().then(({ data }) => {
      if (data) setF({ ...data, founders: JSON.stringify(data.founders ?? [], null, 2) });
    });
  }, []);
  const save = async () => {
    let founders: any = [];
    try { founders = JSON.parse(f.founders); } catch { return toast.error("Founders JSON is invalid"); }
    const { founders: _, ...rest } = f;
    const { error } = await supabase.from("site_settings").upsert({ id: "singleton", ...rest, founders });
    if (error) toast.error(error.message); else toast.success("Settings saved");
  };
  const text = (k: string, label: string, multiline = false) => (
    <label className="block text-sm">{label}
      {multiline ? (
        <textarea className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      ) : (
        <input className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      )}
    </label>
  );
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4 max-w-3xl">
      <h3 className="font-display text-lg font-semibold">Site settings — edit every section of the homepage</h3>
      <div>
        <div className="text-sm font-medium mb-2">Site logo (shown in header)</div>
        <LogoUploader bucket="coaching-logos" value={f.site_logo_url}
          onChange={(p) => setF({ ...f, site_logo_url: p })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {text("site_name", "Site name")}
        {text("tagline", "Tagline")}
        {text("telegram_url", "Telegram channel URL")}
        {text("footer_text", "Footer text")}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.intro_animation_enabled} onChange={(e) => setF({ ...f, intro_animation_enabled: e.target.checked })} /> Show intro animation on first visit</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.telegram_popup_enabled} onChange={(e) => setF({ ...f, telegram_popup_enabled: e.target.checked })} /> Show Telegram popup every visit</label>
      </div>
      <h4 className="font-semibold pt-2">Hero</h4>
      {text("hero_title", "Hero title")}
      {text("hero_subtitle", "Hero subtitle", true)}
      <h4 className="font-semibold pt-2">Portals section</h4>
      <div className="grid sm:grid-cols-2 gap-3">{text("portals_title", "Title")}{text("portals_subtitle", "Subtitle")}</div>
      <h4 className="font-semibold pt-2">Featured Institutions section</h4>
      <div className="grid sm:grid-cols-2 gap-3">{text("institutes_title", "Title")}{text("institutes_subtitle", "Subtitle")}</div>
      <h4 className="font-semibold pt-2">Why Choose Us section</h4>
      <div className="grid sm:grid-cols-2 gap-3">{text("why_title", "Title")}{text("why_subtitle", "Subtitle")}</div>
      <h4 className="font-semibold pt-2">Who is this for section</h4>
      <div className="grid sm:grid-cols-2 gap-3">{text("who_title", "Title")}{text("who_subtitle", "Subtitle")}</div>
      <h4 className="font-semibold pt-2">Ready to Start CTA</h4>
      <div className="grid sm:grid-cols-2 gap-3">{text("cta_title", "Title")}{text("cta_button_text", "Button text")}{text("cta_subtitle", "Subtitle")}{text("cta_button_url", "Button URL")}</div>
      <FoundersEditor value={f.founders} onChange={(v) => setF({ ...f, founders: v })} />
      <Button onClick={save}><Save className="h-4 w-4 mr-1" /> Save all settings</Button>
    </div>
  );
}

// Founders editor with per-founder avatar upload from gallery
function FoundersEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let parsed: any[] = [];
  try { parsed = JSON.parse(value || "[]"); if (!Array.isArray(parsed)) parsed = []; } catch { parsed = []; }
  const update = (next: any[]) => onChange(JSON.stringify(next, null, 2));
  const setAt = (i: number, patch: any) => update(parsed.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const upload = async (i: number, file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Pick an image");
    try { const path = await uploadFile("coaching-logos", file); setAt(i, { avatar: path }); toast.success("Photo uploaded"); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Team behind EduLeak</h4>
        <Button size="sm" variant="outline" onClick={() => update([...parsed, { name: "", role: "", bio: "", avatar: "", telegram: "" }])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add member
        </Button>
      </div>
      {parsed.map((m, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 grid sm:grid-cols-[120px_1fr_auto] gap-3 items-start">
          <label className="group relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/40 hover:border-primary/60 overflow-hidden transition">
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(i, e.target.files?.[0])} />
            {m.avatar ? (
              m.avatar.startsWith("http")
                ? <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                : <SignedImage bucket="coaching-logos" path={m.avatar} alt={m.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary text-xs">
                <ImagePlus className="h-6 w-6" /> Pick photo
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition text-xs font-medium">Change</div>
          </label>
          <div className="space-y-2">
            <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Name" value={m.name ?? ""} onChange={(e) => setAt(i, { name: e.target.value })} />
            <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Role" value={m.role ?? ""} onChange={(e) => setAt(i, { role: e.target.value })} />
            <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Telegram username (without @)" value={m.telegram ?? ""} onChange={(e) => setAt(i, { telegram: e.target.value.replace(/^@/, "").trim() })} />
            <textarea className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Bio" value={m.bio ?? ""} onChange={(e) => setAt(i, { bio: e.target.value })} />
          </div>
          <Button size="sm" variant="ghost" onClick={() => update(parsed.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      {parsed.length === 0 && <div className="text-center text-sm text-muted-foreground p-6 border-dashed border rounded-xl">No team members yet.</div>}
    </div>
  );
}



// ============ Stats ============
function StatsAdmin() {
  const [s, setS] = useState({ courses: 0, published: 0, lessons: 0, files: 0, coachings: 0, exams: 0, users: 0, recent: [] as any[] });
  useEffect(() => {
    (async () => {
      const [co, cp, le, fi, ca, ex, us, rec] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("course_files").select("*", { count: "exact", head: true }),
        supabase.from("coachings").select("*", { count: "exact", head: true }),
        supabase.from("exams").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("id, title, created_at, is_published").order("created_at", { ascending: false }).limit(6),
      ]);
      setS({
        courses: co.count ?? 0, published: cp.count ?? 0, lessons: le.count ?? 0, files: fi.count ?? 0,
        coachings: ca.count ?? 0, exams: ex.count ?? 0, users: us.count ?? 0, recent: rec.data ?? [],
      });
    })();
  }, []);
  const cards = [
    { label: "Total courses", value: s.courses, icon: BookOpen, hint: `${s.published} published` },
    { label: "Lessons", value: s.lessons, icon: Video, hint: "YouTube videos" },
    { label: "PDFs / Notes", value: s.files, icon: FileText, hint: "Uploaded files" },
    { label: "Coachings", value: s.coachings, icon: GraduationCap, hint: "Institutes" },
    { label: "Exams", value: s.exams, icon: Layers, hint: "Categories" },
    { label: "Registered users", value: s.users, icon: TrendingUp, hint: "Profiles" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">Live numbers from your database.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 p-5 hover:-translate-y-0.5 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2"><c.icon className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground">{c.hint}</span>
            </div>
            <div className="mt-3 font-display text-4xl font-semibold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold mb-3">Recently added courses</h3>
        {s.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses yet.</p>
        ) : (
          <ul className="divide-y">
            {s.recent.map((r) => (
              <li key={r.id} className="py-2.5 flex items-center gap-3 text-sm">
                <span className={`h-2 w-2 rounded-full ${r.is_published ? "bg-primary" : "bg-muted-foreground/40"}`} />
                <span className="flex-1">{r.title}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ============ Import: bulk YouTube + JSON ============
function ImportAdmin() {
  const [coachings, setCoachings] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("coachings").select("*").order("display_order").then(({ data }) => setCoachings(data ?? []));
    supabase.from("exams").select("*").order("display_order").then(({ data }) => setExams(data ?? []));
  }, []);

  // --- Bulk YouTube ---
  const [bulk, setBulk] = useState({
    title: "", slug: "", description: "", coaching_id: "", exam_id: "", urls: "",
  });
  const [busy, setBusy] = useState(false);

  const importBulk = async () => {
    if (!bulk.title || !bulk.slug) return toast.error("Course title and slug required");
    const lines = bulk.urls.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return toast.error("Paste at least one YouTube URL");
    const parsed = lines.map((l) => {
      // optional "Title | URL" format
      const [maybeTitle, maybeUrl] = l.includes("|") ? l.split("|").map((x) => x.trim()) : [null, l];
      const url = maybeUrl ?? l;
      const id = extractYouTubeId(url);
      return id ? { title: maybeTitle || `Lesson`, url, id } : null;
    });
    if (parsed.some((p) => !p)) return toast.error("One or more URLs are invalid YouTube links");

    setBusy(true);
    try {
      const { data: course, error } = await supabase.from("courses").insert({
        title: bulk.title, slug: bulk.slug, description: bulk.description,
        coaching_id: bulk.coaching_id || null, exam_id: bulk.exam_id || null,
        course_type: "youtube", is_published: true, display_order: 0,
      }).select().single();
      if (error) throw error;
      const rows = parsed.map((p, i) => ({
        course_id: course.id, title: p!.title === "Lesson" ? `Lesson ${i + 1}` : p!.title,
        youtube_url: p!.url, youtube_id: p!.id, display_order: i,
      }));
      const { error: e2 } = await supabase.from("lessons").insert(rows);
      if (e2) throw e2;
      toast.success(`Course created with ${rows.length} lessons`);
      setBulk({ title: "", slug: "", description: "", coaching_id: "", exam_id: "", urls: "" });
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  // --- JSON import ---
  const [json, setJson] = useState("");
  const [jbusy, setJBusy] = useState(false);
  const sampleJson = JSON.stringify({
    title: "Complete Physics — Class 11",
    slug: "physics-class-11",
    description: "Full free physics series.",
    coaching_slug: "physics-wallah",
    exam_slug: "jee",
    course_type: "youtube",
    is_published: true,
    external_url: null,
    lessons: [
      { title: "Units & Measurements", youtube_url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
      { title: "Kinematics 1D", youtube_url: "https://youtu.be/YYYYYYYYYYY" },
    ],
  }, null, 2);

  const importJson = async () => {
    setJBusy(true);
    try {
      const obj = JSON.parse(json);
      const courses = Array.isArray(obj) ? obj : [obj];
      let total = 0, lessonCount = 0;
      for (const c of courses) {
        if (!c.title || !c.slug) throw new Error("Each course needs title + slug");
        const coaching = c.coaching_slug ? coachings.find((x) => x.slug === c.coaching_slug) : null;
        const exam = c.exam_slug ? exams.find((x) => x.slug === c.exam_slug) : null;
        const { data: course, error } = await supabase.from("courses").insert({
          title: c.title, slug: c.slug, description: c.description ?? null,
          coaching_id: coaching?.id ?? null, exam_id: exam?.id ?? null,
          course_type: c.course_type ?? "youtube",
          external_url: c.external_url ?? null,
          is_published: c.is_published ?? true,
          display_order: c.display_order ?? 0,
        }).select().single();
        if (error) throw error;
        total++;
        const lessons = (c.lessons ?? []).map((l: any, i: number) => {
          const id = extractYouTubeId(l.youtube_url || "");
          if (!id) throw new Error(`Invalid YouTube URL in lesson "${l.title}"`);
          return {
            course_id: course.id,
            title: l.title || `Lesson ${i + 1}`,
            youtube_url: l.youtube_url,
            youtube_id: id,
            description: l.description ?? null,
            display_order: i,
          };
        });
        if (lessons.length) {
          const { error: e2 } = await supabase.from("lessons").insert(lessons);
          if (e2) throw e2;
          lessonCount += lessons.length;
        }
      }
      toast.success(`Imported ${total} course(s) and ${lessonCount} lesson(s)`);
      setJson("");
    } catch (e: any) { toast.error(e.message); }
    finally { setJBusy(false); }
  };

  return (
    <div className="space-y-8">
      {/* Bulk YouTube */}
      <div className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-primary/10 p-2"><ListVideo className="h-5 w-5 text-primary" /></div>
          <div>
            <h3 className="font-display text-lg font-semibold">Bulk YouTube import</h3>
            <p className="text-xs text-muted-foreground">Create a course and add many lessons in one go.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="px-3 py-2.5 rounded-lg border bg-background" placeholder="Course title"
            value={bulk.title} onChange={(e) => setBulk({ ...bulk, title: e.target.value })} />
          <input className="px-3 py-2.5 rounded-lg border bg-background" placeholder="course-slug"
            value={bulk.slug} onChange={(e) => setBulk({ ...bulk, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
          <textarea className="sm:col-span-2 px-3 py-2.5 rounded-lg border bg-background min-h-[70px]" placeholder="Short description"
            value={bulk.description} onChange={(e) => setBulk({ ...bulk, description: e.target.value })} />
          <select className="px-3 py-2.5 rounded-lg border bg-background"
            value={bulk.coaching_id} onChange={(e) => setBulk({ ...bulk, coaching_id: e.target.value })}>
            <option value="">— Coaching —</option>
            {coachings.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="px-3 py-2.5 rounded-lg border bg-background"
            value={bulk.exam_id} onChange={(e) => setBulk({ ...bulk, exam_id: e.target.value })}>
            <option value="">— Exam —</option>
            {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <textarea className="sm:col-span-2 px-3 py-2.5 rounded-lg border bg-background font-mono text-xs min-h-[160px]"
            placeholder={"One URL per line, or  Title | URL\nhttps://www.youtube.com/watch?v=...\nKinematics 1D | https://youtu.be/..."}
            value={bulk.urls} onChange={(e) => setBulk({ ...bulk, urls: e.target.value })} />
        </div>
        <Button className="mt-4" onClick={importBulk} disabled={busy} size="lg">
          {busy ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Wand2 className="h-4 w-4 mr-1.5" />}
          Create course with lessons
        </Button>
      </div>

      {/* JSON import */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-accent/40 p-2"><FileJson className="h-5 w-5 text-accent-foreground" /></div>
          <div>
            <h3 className="font-display text-lg font-semibold">Import from JSON API</h3>
            <p className="text-xs text-muted-foreground">Paste a course object (or array of courses). Use coaching/exam slugs.</p>
          </div>
        </div>
        <textarea className="w-full px-3 py-2.5 rounded-lg border bg-background font-mono text-xs min-h-[280px]"
          placeholder={sampleJson} value={json} onChange={(e) => setJson(e.target.value)} />
        <div className="flex items-center gap-2 mt-3">
          <Button onClick={importJson} disabled={jbusy || !json.trim()}>
            {jbusy ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
            Import JSON
          </Button>
          <Button variant="outline" onClick={() => setJson(sampleJson)}>Load sample</Button>
        </div>
      </div>
    </div>
  );
}
