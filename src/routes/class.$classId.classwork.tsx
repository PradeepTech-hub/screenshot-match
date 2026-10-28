import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell, ClassTabs } from "@/components/AppShell";
import { AttachmentCard, StatusChip, WorkIcon } from "@/components/Work";
import { getClass, works, formatDue, formatPosted, statusOf, useClassroomState } from "@/lib/classroom";

export const Route = createFileRoute("/class/$classId/classwork")({
  loader: ({ params }) => { const c = getClass(params.classId); if (!c) throw notFound(); return { name: c.name }; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Class"} · Classwork` },
      { name: "description", content: "Topics, assignments, materials and due dates for this class." },
      { property: "og:title", content: `${loaderData?.name ?? "Class"} · Classwork` },
      { property: "og:description", content: "Topics, assignments, materials and due dates for this class." },
    ],
  }),
  component: Classwork,
});

function Classwork() {
  const { classId } = Route.useParams();
  const c = getClass(classId)!;
  const s = useClassroomState();
  const items = works.filter((w) => w.classId === classId);
  const topics = [...new Set(items.map((w) => w.topic))];
  const [topic, setTopic] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const shown = topic === "all" ? topics : [topic];

  return (
    <AppShell title={c.name} tabs={<ClassTabs classId={classId} active="classwork" />}>
      <div className="mx-auto grid max-w-[1000px] gap-6 p-4 sm:p-6 md:grid-cols-[180px_1fr]">
        <nav aria-label="Topics" className="flex gap-2 overflow-x-auto md:flex-col md:gap-0">
          {["all", ...topics].map((t) => (
            <button key={t} onClick={() => setTopic(t)} aria-pressed={topic === t}
              className={`shrink-0 rounded-full px-4 py-2 text-left text-sm md:rounded-r-full md:rounded-l-none ${topic === t ? "bg-primary-soft font-medium text-primary" : "hover:bg-accent"}`}>
              {t === "all" ? "All topics" : t}
            </button>
          ))}
        </nav>
        <div className="space-y-8">
          {shown.map((t) => (
            <section key={t}>
              <h2 className="mb-2 border-b border-primary pb-2 font-display text-2xl text-primary">{t}</h2>
              <ul className="divide-y">
                {items.filter((w) => w.topic === t).map((w) => {
                  const st = w.kind === "material" ? null : statusOf(w, s);
                  const isOpen = open === w.id;
                  return (
                    <li key={w.id} className={isOpen ? "my-2 rounded-lg border shadow-gc" : ""}>
                      <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : w.id)} className="flex w-full items-center gap-4 px-3 py-3 text-left hover:bg-accent">
                        <WorkIcon kind={w.kind} done={st === "done"} />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{w.title}</span>
                        {st && <span className="hidden sm:inline"><StatusChip status={st} /></span>}
                        <span className="hidden text-xs text-muted-foreground md:inline">{w.dueOffsetDays !== undefined ? formatDue(w.dueOffsetDays, w.dueTime) : `Posted ${formatPosted(w.postedOffsetDays)}`}</span>
                        <ChevronDown className={`size-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="border-t px-4 py-4">
                          <p className="text-xs text-muted-foreground">Posted {formatPosted(w.postedOffsetDays)}{st ? ` · ${formatDue(w.dueOffsetDays, w.dueTime)}` : ""}</p>
                          <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm">{w.instructions}</p>
                          {w.attachments.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{w.attachments.map((a) => <AttachmentCard key={a.name} a={a} />)}</div>}
                          <Link to="/assignment/$id" params={{ id: w.id }} className="mt-4 inline-block rounded px-3 py-2 text-sm font-medium text-primary hover:bg-primary-soft">View {w.kind}</Link>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
