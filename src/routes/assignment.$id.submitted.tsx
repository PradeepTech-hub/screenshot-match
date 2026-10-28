import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusChip } from "@/components/Work";
import { getWork, getClass, gradable, statusOf, useClassroomState, formatDue } from "@/lib/classroom";

export const Route = createFileRoute("/assignment/$id/submitted")({
  loader: ({ params }) => { if (!getWork(params.id)) throw notFound(); },
  head: () => ({
    meta: [
      { title: "Work turned in · Classroom" },
      { name: "description", content: "Confirmation that your assignment was turned in." },
      { property: "og:title", content: "Work turned in · Classroom" },
      { property: "og:description", content: "Confirmation that your assignment was turned in." },
    ],
  }),
  component: Submitted,
});

function Submitted() {
  const { id } = Route.useParams();
  const w = getWork(id)!;
  const c = getClass(w.classId)!;
  const s = useClassroomState();
  const sub = s.submissions[id];
  const next = gradable.filter((x) => x.id !== id && statusOf(x, s) !== "done" && (x.dueOffsetDays ?? -1) >= 0).sort((a, b) => a.dueOffsetDays! - b.dueOffsetDays!).slice(0, 3);

  return (
    <AppShell title={c.name}>
      <div className="mx-auto max-w-xl p-4 py-10 text-center sm:p-6">
        <CheckCircle2 className="mx-auto size-16 text-success" aria-hidden />
        <h1 className="mt-4 font-display text-3xl">{sub ? "Your work was turned in" : "Not turned in"}</h1>
        <p className="mt-2 text-muted-foreground">{w.title} · {c.name}</p>
        {sub && (
          <div className="mx-auto mt-6 rounded-lg border p-4 text-left text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><StatusChip status="done" /></div>
            <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Submitted</span><span>{new Date(sub.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span></div>
            <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Attachments</span><span>{sub.files.length}</span></div>
            {w.points !== undefined && <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Points</span><span>Not graded yet / {w.points}</span></div>}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/assignment/$id" params={{ id }} className="rounded border px-4 py-2 text-sm font-medium text-primary hover:bg-primary-soft">View submission</Link>
          <Link to="/todo" className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Back to To-do</Link>
        </div>
        {next.length > 0 && (
          <section className="mt-10 text-left">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Up next</h2>
            <ul className="divide-y rounded-lg border">
              {next.map((x) => (
                <li key={x.id}><Link to="/assignment/$id" params={{ id: x.id }} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent">
                  <span className="min-w-0"><span className="block truncate text-sm font-medium">{x.title}</span><span className="block text-xs text-muted-foreground">{getClass(x.classId)?.name} · {formatDue(x.dueOffsetDays, x.dueTime)}</span></span>
                  <StatusChip status={statusOf(x, s)} />
                </Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
}
