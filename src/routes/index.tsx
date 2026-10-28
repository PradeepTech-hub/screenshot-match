import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, FolderOpen, AlertCircle, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusChip } from "@/components/Work";
import { classes, bannerClass, gradable, statusOf, useClassroomState, formatDue, getClass } from "@/lib/classroom";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · Classroom Redesign Prototype" },
      { name: "description", content: "Your classes and upcoming deadlines in a redesigned Google Classroom home." },
      { property: "og:title", content: "Home · Classroom Redesign Prototype" },
      { property: "og:description", content: "Your classes and upcoming deadlines in a redesigned Google Classroom home." },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useClassroomState();
  const pending = gradable
    .map((w) => ({ w, st: statusOf(w, s) }))
    .filter((x) => x.st === "missing" || x.st === "due-soon")
    .sort((a, b) => (a.w.dueOffsetDays ?? 0) - (b.w.dueOffsetDays ?? 0));

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">
        {/* Redesign: cross-class "Needs attention" strip */}
        {pending.length > 0 && (
          <section aria-labelledby="attn" className="mb-6 rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="attn" className="flex items-center gap-2 text-base font-medium"><AlertCircle className="size-5 text-destructive" />Needs your attention</h2>
              <Link to="/todo" className="text-sm font-medium text-primary hover:underline">View all to-do</Link>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {pending.map(({ w, st }) => (
                <li key={w.id}>
                  <Link to="/assignment/$id" params={{ id: w.id }} className="flex items-center gap-3 rounded-lg border px-3 py-2.5 hover:bg-accent">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{w.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{getClass(w.classId)?.name} · {formatDue(w.dueOffsetDays, w.dueTime)}</span>
                    </span>
                    <StatusChip status={st} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {classes.map((c) => {
            const due = gradable.filter((w) => w.classId === c.id && statusOf(w, s) !== "done" && (w.dueOffsetDays ?? -1) >= 0).sort((a, b) => a.dueOffsetDays! - b.dueOffsetDays!).slice(0, 2);
            return (
              <li key={c.id} className="flex h-[296px] flex-col overflow-hidden rounded-lg border hover:shadow-gc">
                <Link to="/class/$classId" params={{ classId: c.id }} className={`banner-pattern relative block h-[100px] p-4 text-on-banner ${bannerClass(c.color)}`}>
                  <span className="block truncate font-display text-[22px] hover:underline">{c.name}</span>
                  <span className="block truncate text-sm">{c.section}</span>
                  <span className="mt-1 block truncate text-sm">{c.teacher}</span>
                  <span className={`absolute -bottom-9 right-4 grid size-[74px] place-items-center rounded-full border-4 border-background text-2xl font-medium ${bannerClass(((c.color + 2) % 6) + 1)}`}>{c.teacher.split(" ").at(-1)![0]}</span>
                </Link>
                <div className="flex-1 px-4 pt-3">
                  {due.length ? (
                    <>
                      {due.map((w) => (
                        <Link key={w.id} to="/assignment/$id" params={{ id: w.id }} className="mb-2 block text-sm hover:underline">
                          <span className="block text-xs text-muted-foreground">{formatDue(w.dueOffsetDays, w.dueTime)}</span>
                          <span className="block truncate">{w.title}</span>
                        </Link>
                      ))}
                    </>
                  ) : <p className="text-sm text-muted-foreground">No work due soon</p>}
                </div>
                <div className="flex justify-end gap-1 border-t px-2 py-1">
                  <Link to="/class/$classId/classwork" params={{ classId: c.id }} aria-label={`Open classwork for ${c.name}`} className="grid size-12 place-items-center rounded-full hover:bg-accent"><ClipboardList className="size-5 text-muted-foreground" /></Link>
                  <Link to="/class/$classId/classwork" params={{ classId: c.id }} aria-label={`Open folder for ${c.name}`} className="grid size-12 place-items-center rounded-full hover:bg-accent"><FolderOpen className="size-5 text-muted-foreground" /></Link>
                </div>
              </li>
            );
          })}
        </ul>

        <Link to="/case-study" className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">About this redesign prototype <ChevronRight className="size-4" /></Link>
      </div>
    </AppShell>
  );
}
