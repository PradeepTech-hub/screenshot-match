import { Link } from "@tanstack/react-router";
import { ClipboardList, BookOpen, HelpCircle, FileText, Link2, Image, Presentation, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { Attachment, Status, Work } from "@/lib/classroom";

export function WorkIcon({ kind, done }: { kind: Work["kind"]; done?: boolean }) {
  const Icon = kind === "material" ? BookOpen : kind === "quiz" ? HelpCircle : ClipboardList;
  return <span className={`grid size-10 shrink-0 place-items-center rounded-full ${done ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"}`}><Icon className="size-5" /></span>;
}

const map: Record<Status, { label: string; cls: string; Icon: typeof Clock }> = {
  missing: { label: "Missing", cls: "bg-destructive-soft text-destructive", Icon: AlertCircle },
  "due-soon": { label: "Due soon", cls: "bg-warning-soft text-warning", Icon: Clock },
  assigned: { label: "Assigned", cls: "bg-primary-soft text-primary", Icon: Clock },
  done: { label: "Turned in", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
};
/** Status chip uses icon + text + colour so it doesn't rely on colour alone. */
export function StatusChip({ status }: { status: Status }) {
  const { label, cls, Icon } = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}><Icon className="size-3.5" />{label}</span>;
}

export function AttachmentCard({ a, onRemove }: { a: Attachment | { name: string; kind: Attachment["kind"] }; onRemove?: () => void }) {
  const Icon = a.kind === "link" ? Link2 : a.kind === "image" ? Image : a.kind === "slides" ? Presentation : FileText;
  const color = a.kind === "pdf" ? "text-destructive" : a.kind === "slides" ? "text-warning" : a.kind === "link" ? "text-muted-foreground" : "text-primary";
  return (
    <div className="flex h-16 items-center overflow-hidden rounded-lg border">
      <span className="grid h-full w-16 shrink-0 place-items-center border-r bg-secondary"><Icon className={`size-6 ${color}`} /></span>
      <span className="min-w-0 flex-1 px-3"><span className="block truncate text-sm font-medium">{a.name}</span><span className="block text-xs uppercase text-muted-foreground">{a.kind}</span></span>
      {onRemove && <button onClick={onRemove} aria-label={`Remove ${a.name}`} className="mr-2 grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-accent">✕</button>}
    </div>
  );
}

export function WorkLink({ w, children, className }: { w: Work; children: React.ReactNode; className?: string }) {
  return <Link to="/assignment/$id" params={{ id: w.id }} className={className}>{children}</Link>;
}
