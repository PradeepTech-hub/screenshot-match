import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Info, MoreVertical, ClipboardList, Users } from "lucide-react";
import { AppShell, ClassTabs } from "@/components/AppShell";
import { AttachmentCard, WorkIcon } from "@/components/Work";
import { getClass, announcements, works, bannerClass, formatDue, formatPosted, statusOf, useClassroomState } from "@/lib/classroom";

export const Route = createFileRoute("/class/$classId/")({
  loader: ({ params }) => { const c = getClass(params.classId); if (!c) throw notFound(); return { name: c.name }; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Class"} · Stream` },
      { name: "description", content: "Class stream with announcements and posted classwork." },
      { property: "og:title", content: `${loaderData?.name ?? "Class"} · Stream` },
      { property: "og:description", content: "Class stream with announcements and posted classwork." },
    ],
  }),
  component: Stream,
});

function Stream() {
  const { classId } = Route.useParams();
  const c = getClass(classId)!;
  const s = useClassroomState();
  const [showCode, setShowCode] = useState(false);
  const [draft, setDraft] = useState("");
  const [mine, setMine] = useState<string[]>([]);
  const feed = [
    ...announcements.filter((a) => a.classId === classId).map((a) => ({ t: "a" as const, d: a.postedOffsetDays, a })),
    ...works.filter((w) => w.classId === classId).map((w) => ({ t: "w" as const, d: w.postedOffsetDays, w })),
  ].sort((x, y) => y.d - x.d);
  const upcoming = works.filter((w) => w.classId === classId && w.kind !== "material" && statusOf(w, s) !== "done" && (w.dueOffsetDays ?? -1) >= 0);

  return (
    <AppShell title={c.name} tabs={<ClassTabs classId={classId} active="stream" />}>
      <div className="mx-auto max-w-[1000px] p-4 sm:p-6">
        <div className={`banner-pattern relative flex h-[200px] flex-col justify-end rounded-lg p-6 text-on-banner sm:h-[240px] ${bannerClass(c.color)}`}>
          <h1 className="font-display text-3xl sm:text-4xl">{c.name}</h1>
          <p className="text-lg">{c.section}</p>
          <button aria-label="Class details" aria-expanded={showCode} onClick={() => setShowCode((v) => !v)} className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full hover:bg-on-banner/20"><Info className="size-5" /></button>
        </div>
        {showCode && <div className="mt-2 rounded-lg border p-4 text-sm"><p><b>Teacher:</b> {c.teacher}</p><p><b>Room:</b> {c.room}</p><p><b>Class code:</b> <span className="font-mono text-primary">{c.code}</span></p></div>}

        <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-3 text-sm font-medium">Upcoming</h2>
              {upcoming.length ? upcoming.map((w) => (
                <Link key={w.id} to="/assignment/$id" params={{ id: w.id }} className="mb-3 block text-xs hover:underline">
                  <span className="block text-muted-foreground">{formatDue(w.dueOffsetDays, w.dueTime)}</span>
                  <span className="block text-sm">{w.title}</span>
                </Link>
              )) : <p className="text-xs text-muted-foreground">Woohoo, no work due soon!</p>}
              <Link to="/class/$classId/classwork" params={{ classId }} className="mt-2 block text-right text-sm font-medium text-primary">View all</Link>
            </div>
            <div className="hidden rounded-lg border p-4 text-sm md:block"><Users className="mb-2 size-5 text-muted-foreground" />{c.teacher}<p className="text-xs text-muted-foreground">Teacher · {c.room}</p></div>
          </aside>

          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setMine([draft.trim(), ...mine]); setDraft(""); } }} className="flex items-center gap-3 rounded-lg border p-4 shadow-gc">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-banner-5 text-on-banner">P</span>
              <label className="sr-only" htmlFor="share">Announce something to your class</label>
              <input id="share" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Announce something to your class" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <button disabled={!draft.trim()} className="rounded px-4 py-2 text-sm font-medium text-primary hover:bg-primary-soft disabled:text-muted-foreground disabled:hover:bg-transparent">Post</button>
            </form>

            {mine.map((t, i) => (
              <article key={i} className="rounded-lg border p-4">
                <header className="mb-2 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-banner-5 text-on-banner">P</span><div><p className="text-sm font-medium">Pradeep M</p><p className="text-xs text-muted-foreground">Just now</p></div></header>
                <p className="text-sm">{t}</p>
              </article>
            ))}

            {feed.map((item) => item.t === "a" ? (
              <article key={item.a.id} className="rounded-lg border">
                <header className="flex items-center gap-3 p-4 pb-2">
                  <span className={`grid size-10 place-items-center rounded-full text-on-banner ${bannerClass(c.color)}`}>{item.a.author.split(" ").at(-1)![0]}</span>
                  <div className="flex-1"><p className="text-sm font-medium">{item.a.author}</p><p className="text-xs text-muted-foreground">{formatPosted(item.a.postedOffsetDays)}</p></div>
                  <MoreVertical className="size-5 text-muted-foreground" aria-hidden />
                </header>
                <p className="whitespace-pre-line px-4 pb-4 text-sm leading-6">{item.a.text}</p>
                {item.a.attachments?.length ? <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">{item.a.attachments.map((a) => <AttachmentCard key={a.name} a={a} />)}</div> : null}
              </article>
            ) : (
              <Link key={item.w.id} to="/assignment/$id" params={{ id: item.w.id }} className="flex items-center gap-4 rounded-lg border p-4 hover:shadow-gc">
                <WorkIcon kind={item.w.kind} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{item.w.kind === "material" ? `${c.teacher} posted a new material: ` : `${c.teacher} posted a new ${item.w.kind}: `}<b className="font-medium">{item.w.title}</b></span>
                  <span className="block text-xs text-muted-foreground">{formatPosted(item.w.postedOffsetDays)}{item.w.dueOffsetDays !== undefined ? ` · ${formatDue(item.w.dueOffsetDays, item.w.dueTime)}` : ""}</span>
                </span>
                <ClipboardList className="hidden size-5 text-muted-foreground sm:block" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
