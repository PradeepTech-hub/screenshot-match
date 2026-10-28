import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusChip, WorkIcon } from "@/components/Work";
import { classes, gradable, getClass, statusOf, useClassroomState, formatDue, type Work } from "@/lib/classroom";

export const Route = createFileRoute("/todo")({
  head: () => ({
    meta: [
      { title: "To-do · Classroom Redesign Prototype" },
      { name: "description", content: "Assigned, missing and done work across all your classes." },
      { property: "og:title", content: "To-do · Classroom Redesign Prototype" },
      { property: "og:description", content: "Assigned, missing and done work across all your classes." },
    ],
  }),
  component: Todo,
});

type Tab = "assigned" | "missing" | "done";

function Group({ title, items, s }: { title: string; items: Work[]; s: ReturnType<typeof useClassroomState> }) {
  const [open, setOpen] = useState(true);
  if (!items.length) return null;
  return (
    <section className="rounded-lg border">
      <button aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">{items.length}<ChevronDown className={`size-5 ${open ? "rotate-180" : ""}`} /></span>
      </button>
      {open && <ul className="divide-y border-t">{items.map((w) => {
        const st = statusOf(w, s);
        return (
          <li key={w.id}><Link to="/assignment/$id" params={{ id: w.id }} className="flex items-center gap-4 px-4 py-3 hover:bg-accent">
            <WorkIcon kind={w.kind} done={st === "done"} />
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{w.title}</span><span className="block truncate text-xs text-muted-foreground">{getClass(w.classId)?.name}</span></span>
            <span className="hidden text-right text-xs text-muted-foreground sm:block">{st === "done" ? `Turned in ${new Date(s.submissions[w.id].submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : formatDue(w.dueOffsetDays, w.dueTime)}</span>
            <StatusChip status={st} />
          </Link></li>
        );
      })}</ul>}
    </section>
  );
}

function Todo() {
  const s = useClassroomState();
  const [tab, setTab] = useState<Tab>("assigned");
  const [cls, setCls] = useState("all");
  const pool = gradable.filter((w) => cls === "all" || w.classId === cls);
  const assigned = pool.filter((w) => ["assigned", "due-soon"].includes(statusOf(w, s))).sort((a, b) => a.dueOffsetDays! - b.dueOffsetDays!);
  const missing = pool.filter((w) => statusOf(w, s) === "missing");
  const done = pool.filter((w) => statusOf(w, s) === "done");
  const counts = { assigned: assigned.length, missing: missing.length, done: done.length };

  const tabs = (
    <div role="tablist" aria-label="To-do status" className="flex justify-center">
      {(["assigned", "missing", "done"] as Tab[]).map((t) => (
        <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex h-12 items-center gap-2 border-b-4 px-5 text-sm font-medium capitalize ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-accent"}`}>
          {t}<span className={`rounded-full px-2 text-xs leading-5 ${t === "missing" && counts.missing ? "bg-destructive text-destructive-foreground" : "bg-secondary"}`}>{counts[t]}</span>
        </button>
      ))}
    </div>
  );

  return (
    <AppShell title="To-do" tabs={tabs}>
      <div className="mx-auto max-w-[800px] space-y-4 p-4 sm:p-6">
        <label className="block"><span className="sr-only">Filter by class</span>
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="h-12 w-full rounded border bg-background px-3 text-sm sm:w-72">
            <option value="all">All classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        {tab === "assigned" && (<>
          <Group title="Due today & tomorrow" items={assigned.filter((w) => w.dueOffsetDays! <= 1)} s={s} />
          <Group title="This week" items={assigned.filter((w) => w.dueOffsetDays! > 1 && w.dueOffsetDays! <= 7)} s={s} />
          <Group title="Later" items={assigned.filter((w) => w.dueOffsetDays! > 7)} s={s} />
          {!assigned.length && <Empty text="No work assigned. Nice!" />}
        </>)}
        {tab === "missing" && (missing.length ? <Group title="Past due" items={missing} s={s} /> : <Empty text="No missing work. You're all caught up." />)}
        {tab === "done" && (done.length ? <Group title="Turned in" items={done} s={s} /> : <Empty text="Nothing turned in yet." />)}
      </div>
    </AppShell>
  );
}
const Empty = ({ text }: { text: string }) => <p className="rounded-lg border p-10 text-center text-sm text-muted-foreground">{text}</p>;
