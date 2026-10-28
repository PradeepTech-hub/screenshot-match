import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Paperclip, Link2, Users, MessageSquare, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AttachmentCard, StatusChip, WorkIcon } from "@/components/Work";
import { getWork, getClass, formatDue, formatPosted, statusOf, useClassroomState, actions, type Attachment } from "@/lib/classroom";

export const Route = createFileRoute("/assignment/$id/")({
  loader: ({ params }) => { const w = getWork(params.id); if (!w) throw notFound(); return { title: w.title }; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Assignment"} · Classroom` },
      { name: "description", content: "Assignment instructions, attachments, due date, points and submission." },
      { property: "og:title", content: `${loaderData?.title ?? "Assignment"} · Classroom` },
      { property: "og:description", content: "Assignment instructions, attachments, due date, points and submission." },
    ],
  }),
  component: Detail,
});

const kindOf = (n: string): Attachment["kind"] => /\.pdf$/i.test(n) ? "pdf" : /\.(png|jpe?g|gif|webp)$/i.test(n) ? "image" : /\.(pptx?|key)$/i.test(n) ? "slides" : /^https?:/.test(n) ? "link" : "doc";

function Detail() {
  const { id } = Route.useParams();
  const w = getWork(id)!;
  const c = getClass(w.classId)!;
  const s = useClassroomState();
  const nav = useNavigate();
  const st = w.kind === "material" ? null : statusOf(w, s);
  const sub = s.submissions[w.id];
  const draft = s.drafts[w.id] ?? [];
  const fileRef = useRef<HTMLInputElement>(null);
  const [menu, setMenu] = useState(false);
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [confirm, setConfirm] = useState(false);

  const turnIn = () => { actions.submit(w.id, comment || undefined); nav({ to: "/assignment/$id/submitted", params: { id: w.id } }); };

  return (
    <AppShell title={c.name}>
      <div className="mx-auto max-w-[1000px] p-4 sm:p-6">
        <Link to="/class/$classId/classwork" params={{ classId: c.id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Back to classwork</Link>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <header className="flex gap-4 border-b border-primary pb-4">
              <span className="hidden sm:block"><WorkIcon kind={w.kind} /></span>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-2xl text-primary sm:text-3xl">{w.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{c.teacher} · {formatPosted(w.postedOffsetDays)}</p>
                {/* Redesign: key facts grouped at the top for scanning */}
                <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {w.points !== undefined && <div><dt className="sr-only">Points</dt><dd className="font-medium">{sub ? `—/${w.points}` : `${w.points} points`}</dd></div>}
                  {w.dueOffsetDays !== undefined && <div><dt className="sr-only">Due</dt><dd className={st === "missing" ? "font-medium text-destructive" : "font-medium"}>{formatDue(w.dueOffsetDays, w.dueTime)}</dd></div>}
                  {st && <div><dt className="sr-only">Status</dt><dd><StatusChip status={st} /></dd></div>}
                </dl>
              </div>
            </header>
            <section aria-labelledby="ins" className="py-4">
              <h2 id="ins" className="mb-2 text-sm font-medium text-muted-foreground">Instructions</h2>
              <p className="whitespace-pre-line text-[15px] leading-7">{w.instructions}</p>
            </section>
            {w.attachments.length > 0 && (
              <section aria-labelledby="att" className="border-t py-4">
                <h2 id="att" className="mb-3 text-sm font-medium text-muted-foreground">Reference materials</h2>
                <div className="grid gap-3 sm:grid-cols-2">{w.attachments.map((a) => <AttachmentCard key={a.name} a={a} />)}</div>
              </section>
            )}
            <section className="border-t py-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-medium"><Users className="size-4" />Class comments</h2>
              <button onClick={() => alert("Class comments are simulated in this prototype.")} className="text-sm font-medium text-primary hover:underline">Add class comment</button>
            </section>
          </article>

          {w.kind !== "material" && (
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border p-5 shadow-gc">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl">Your work</h2>
                  {st && <StatusChip status={st} />}
                </div>
                {sub ? (
                  <>
                    <div className="space-y-2">{sub.files.length ? sub.files.map((f) => <AttachmentCard key={f} a={{ name: f, kind: kindOf(f) }} />) : <p className="text-sm text-muted-foreground">Marked as done without attachments.</p>}</div>
                    <p className="mt-3 text-xs text-muted-foreground">Turned in {new Date(sub.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                    <button onClick={() => actions.unsubmit(w.id)} className="mt-4 h-10 w-full rounded border text-sm font-medium text-primary hover:bg-primary-soft">Unsubmit</button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">{draft.map((f) => <AttachmentCard key={f} a={{ name: f, kind: kindOf(f) }} onRemove={() => actions.removeFile(w.id, f)} />)}</div>
                    <input ref={fileRef} type="file" multiple className="sr-only" aria-label="Upload files"
                      onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => actions.addFile(w.id, f.name)); e.target.value = ""; setMenu(false); }} />
                    <div className="relative mt-3">
                      <button aria-expanded={menu} onClick={() => setMenu((m) => !m)} className="flex h-10 w-full items-center justify-center gap-2 rounded border text-sm font-medium text-primary hover:bg-primary-soft"><Plus className="size-4" />Add or create</button>
                      {menu && (
                        <div className="absolute inset-x-0 top-11 z-10 rounded-lg border bg-popover py-2 shadow-gc">
                          <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent"><Paperclip className="size-4" />File from device</button>
                          <button onClick={() => { actions.addFile(w.id, `${w.title.split(" ")[0]}_submission.pdf`); setMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent"><Paperclip className="size-4" />Sample file (demo)</button>
                          <form onSubmit={(e) => { e.preventDefault(); if (link.trim()) { actions.addFile(w.id, link.trim().startsWith("http") ? link.trim() : `https://${link.trim()}`); setLink(""); setMenu(false); } }} className="flex items-center gap-2 px-4 py-2">
                            <Link2 className="size-4 shrink-0" /><input value={link} onChange={(e) => setLink(e.target.value)} aria-label="Link URL" placeholder="Paste a link" className="min-w-0 flex-1 border-b bg-transparent text-sm outline-none focus:border-primary" />
                            <button className="text-sm font-medium text-primary">Add</button>
                          </form>
                        </div>
                      )}
                    </div>
                    {/* Redesign: primary action clearly differentiated and labelled by outcome */}
                    <button onClick={() => setConfirm(true)} className="mt-3 h-10 w-full rounded bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">{draft.length ? "Turn in" : "Mark as done"}</button>
                    {st === "missing" && <p className="mt-2 text-xs text-destructive">This is past due. Work turned in now will be marked late.</p>}
                  </>
                )}
              </div>
              <div className="rounded-lg border p-5">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-medium"><MessageSquare className="size-4" />Private comments</h2>
                <label htmlFor="pc" className="sr-only">Add private comment to {c.teacher}</label>
                <textarea id="pc" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder={`Add comment to ${c.teacher}`} className="w-full resize-none rounded border p-2 text-sm outline-none focus:border-primary" />
                {sub?.comment && <p className="mt-2 rounded bg-secondary p-2 text-sm">You: {sub.comment}</p>}
              </div>
            </aside>
          )}
        </div>
      </div>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="cf" className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-gc">
            <h2 id="cf" className="font-display text-xl">{draft.length ? "Turn in your work?" : "Mark as done?"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{draft.length ? `${draft.length} attachment${draft.length > 1 ? "s" : ""} will be submitted for "${w.title}".` : `You haven't attached anything. Your teacher will see this as done without work.`}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button autoFocus onClick={() => setConfirm(false)} className="rounded px-4 py-2 text-sm font-medium text-primary hover:bg-primary-soft">Cancel</button>
              <button onClick={turnIn} className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{draft.length ? "Turn in" : "Mark as done"}</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
