import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

// Generic CRUD for the simple homepage CMS tables
type Field = { key: string; label: string; type?: "text" | "textarea" | "number" | "checkbox" | "url" };

export function SimpleCMS({ table, title, fields, defaultRow }: {
  table: string; title: string; fields: Field[]; defaultRow: Record<string, any>;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(defaultRow);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from(table as any).select("*").order("display_order", { ascending: true });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setBusy(true);
    const { error } = await supabase.from(table as any).insert(form);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Added"); setForm(defaultRow); load();
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from(table as any).update(patch).eq("id", id);
    if (error) toast.error(error.message); else load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  const renderInput = (f: Field, value: any, onChange: (v: any) => void) => {
    if (f.type === "textarea") return <textarea className="w-full px-3 py-2 rounded-lg border bg-background text-sm" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.label} />;
    if (f.type === "checkbox") return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>;
    if (f.type === "number") return <input type="number" className="px-3 py-2 rounded-lg border bg-background text-sm w-24" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} placeholder={f.label} />;
    return <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.label} />;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold mb-4">Add {title}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              {renderInput(f, form[f.key], (v) => setForm({ ...form, [f.key]: v }))}
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={create} disabled={busy}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border bg-card p-4">
            <div className="grid sm:grid-cols-2 gap-2">
              {fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  {renderInput(f, it[f.key], (v) => {
                    it[f.key] = v;
                    setItems([...items]);
                  })}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => update(it.id, fields.reduce((a, f) => ({ ...a, [f.key]: it[f.key] }), {}))}><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-sm text-muted-foreground p-8 border-dashed border rounded-xl">None yet.</div>}
      </div>
    </div>
  );
}

export function PortalsAdmin() {
  return <SimpleCMS table="portals" title="portal" defaultRow={{ title: "", subtitle: "", description: "", emoji: "📚", link_url: "", whatsapp_url: "", embed_in_app: false, display_order: 0, is_active: true }} fields={[
    { key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" },
    { key: "emoji", label: "Emoji" }, { key: "display_order", label: "Order", type: "number" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "link_url", label: "Link URL (https://...)" }, { key: "whatsapp_url", label: "WhatsApp URL" },
    { key: "embed_in_app", label: "Open inside our site (iframe)", type: "checkbox" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ]} />;
}

export function InstitutesAdmin() {
  return <SimpleCMS table="featured_institutes" title="institute" defaultRow={{ name: "", logo_url: "", link_url: "", display_order: 0 }} fields={[
    { key: "name", label: "Name" }, { key: "display_order", label: "Order", type: "number" },
    { key: "logo_url", label: "Logo URL (full https URL)" },
    { key: "link_url", label: "Link (optional)" },
  ]} />;
}

export function WhyAdmin() {
  return <SimpleCMS table="why_us" title="reason" defaultRow={{ title: "", description: "", icon: "✨", display_order: 0 }} fields={[
    { key: "icon", label: "Icon/Emoji" }, { key: "display_order", label: "Order", type: "number" },
    { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" },
  ]} />;
}

export function AudienceAdmin() {
  return <SimpleCMS table="audience" title="audience" defaultRow={{ title: "", description: "", icon: "🎯", display_order: 0 }} fields={[
    { key: "icon", label: "Icon/Emoji" }, { key: "display_order", label: "Order", type: "number" },
    { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" },
  ]} />;
}

export function NotificationsAdmin() {
  return <SimpleCMS table="notifications" title="notification" defaultRow={{ title: "", body: "", link_url: "", is_active: true }} fields={[
    { key: "title", label: "Title" }, { key: "is_active", label: "Active", type: "checkbox" },
    { key: "body", label: "Body", type: "textarea" }, { key: "link_url", label: "Link URL (optional)" },
  ]} />;
}
