import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusChip } from "@/components/Work";
import { gradable, getClass, statusOf, useClassroomState, dateFromOffset, bannerClass } from "@/lib/classroom";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming work · Classroom Redesign Prototype" },
      { name: "description", content: "A weekly view of upcoming assignments and deadlines across classes." },
      { property: "og:title", content: "Upcoming work · Classroom Redesign Prototype" },
      { property: "og:description", content: "A weekly view of upcoming assignments and deadlines across classes." },
    ],
  }),
  component: Upcoming,
});

function Upcoming() {
  const s = useClassroomState();
  const [week, setWeek] = useState(0);
  const [hideDone, setHideDone] = useState(false);
  const today = new Date().getDay();
  const days = Array.from({ length: 7 }, (_, i) => i - today + week * 7);
  const range = `${dateFromOffset(days[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${dateFromOffset(days[6]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <AppShell title="Upcoming">
      <div className="mx-auto max-w-[1200px] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button aria-label="Previous week" onClick={() => setWeek(week - 1)} className="grid size-10 place-items-center rounded-full hover:bg-accent"><ChevronLeft className="size-5" /></button>
          <h1 className="min-w-48 text-center font-display text-xl">{range}</h1>
          <button aria-label="Next week" onClick={() => setWeek(week + 1)} className="grid size-10 place-items-center rounded-full hover:bg-accent"><ChevronRight className="size-5" /></button>
          {week !== 0 && <button onClick={() => setWeek(0)} className="rounded border px-3 py-1.5 text-sm font-medium text-primary">This week</button>}
          <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="size-4 accent-primary" />Hide turned-in work</label>
        </div>
        <div className="grid gap-3 md:grid-cols-7">
          {days.map((d) => {
            const items = gradable.filter((w) => w.dueOffsetDays === d && (!hideDone || statusOf(w, s) !== "done"));
            const isToday = d === 0;
            const date = dateFromOffset(d);
            return (
              <section key={d} aria-label={date.toDateString()} className={`min-h-24 rounded-lg border p-2 md:min-h-64 ${isToday ? "border-primary" : ""}`}>
                <h2 className="mb-2 flex items-center gap-2 md:flex-col md:gap-0">
                  <span className={`text-xs font-medium uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className={`grid size-9 place-items-center rounded-full font-display text-lg ${isToday ? "bg-primary text-primary-foreground" : ""}`}>{date.getDate()}</span>
                </h2>
                <ul className="space-y-2">
                  {items.map((w) => {
                    const c = getClass(w.classId)!;
                    const st = statusOf(w, s);
                    return (
                      <li key={w.id}><Link to="/assignment/$id" params={{ id: w.id }} className={`block rounded border-l-4 bg-secondary p-2 text-xs hover:shadow-gc ${st === "done" ? "opacity-60" : ""}`} style={{ borderLeftColor: `var(--banner-${c.color})` }}>
                        <span className="block font-medium leading-4">{w.title}</span>
                        <span className="mt-1 flex items-center gap-1 text-muted-foreground"><span className={`size-2 rounded-full ${bannerClass(c.color)}`} />{c.name}</span>
                        <span className="mt-1 block"><StatusChip status={st} /></span>
                      </Link></li>
                    );
                  })}
                  {!items.length && <li className="text-xs text-muted-foreground md:text-center">—</li>}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
