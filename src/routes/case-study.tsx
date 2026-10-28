import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { actions } from "@/lib/classroom";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "UX Case Study · Classroom Redesign" },
      { name: "description", content: "Interface analysis, proposed improvements, wireframes and a usability-testing checklist for the Classroom redesign." },
      { property: "og:title", content: "UX Case Study · Classroom Redesign" },
      { property: "og:description", content: "Interface analysis, proposed improvements, wireframes and a usability-testing checklist." },
    ],
  }),
  component: CaseStudy,
});

const analysis = [
  ["Home", "Class cards with coloured banners; due items appear only per card, so work across classes must be scanned card by card."],
  ["Stream", "Announcements and auto-posts of classwork share one feed; the 'Upcoming' box is small and shows few items."],
  ["Classwork", "Topic-grouped list; status of each item is only visible after opening it."],
  ["To-do", "Assigned / Missing / Done tabs grouped by time; status relies mostly on text in a secondary position."],
  ["Assignment", "Instructions left, 'Your work' panel right; 'Mark as done' vs 'Turn in' changes label based on attachments."],
];
const needs = [
  "Hypothesis: students with many classes may find it slow to see what is due next across all of them.",
  "Hypothesis: overdue work may be missed when status is shown with colour or small text only.",
  "Hypothesis: on mobile, the submission panel may be far from the instructions, increasing scrolling.",
  "Hypothesis: 'Mark as done' without attachments could be clicked by mistake.",
];
const improvements = [
  ["'Needs your attention' strip on Home", "Surfaces missing and due-within-2-days work from every class in one place."],
  ["Status chips with icon + text + colour", "Pending, due soon, missing and turned in are scannable and don't rely on colour alone (WCAG 1.4.1)."],
  ["Status visible in Classwork list & expandable rows", "Users can preview instructions without leaving the list."],
  ["Key facts row on assignment page", "Points, due date and status grouped directly under the title for clearer hierarchy."],
  ["Turn-in confirmation dialog + confirmation screen", "Prevents accidental submission and shows what was submitted and what's next."],
  ["Class filter and time grouping in To-do", "Improves discovery across classes."],
  ["Weekly Upcoming view", "Deadlines laid out by day with class colour coding; 'Hide turned-in' filter."],
];
const checklist = [
  "Find the assignment that is due soonest across all classes.",
  "Identify all missing assignments and the class they belong to.",
  "Open the HCI class and locate Unit 2 materials.",
  "Read the instructions for an assignment and identify points and due date.",
  "Attach a file and turn in an assignment.",
  "Confirm the submission and find it in the To-do 'Done' tab.",
  "Unsubmit an assignment and resubmit it.",
  "Find what is due next week using Upcoming.",
  "Complete tasks 1–5 on a mobile-width screen.",
  "Complete tasks 1–5 using the keyboard only.",
];

function CaseStudy() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  useEffect(() => { try { setChecked(JSON.parse(localStorage.getItem("gc-checklist") ?? "{}")); } catch { /* ignore */ } }, []);
  const toggle = (i: number) => { const n = { ...checked, [i]: !checked[i] }; setChecked(n); localStorage.setItem("gc-checklist", JSON.stringify(n)); };

  return (
    <AppShell title="UX case study">
      <article className="mx-auto max-w-3xl space-y-10 p-4 py-8 sm:p-6">
        <header>
          <p className="text-sm font-medium text-primary">MCA · UI/UX Design · EL-1</p>
          <h1 className="mt-1 font-display text-4xl">Google Classroom – student experience redesign</h1>
          <p className="mt-3 text-muted-foreground">A visually faithful redesign prototype. All data is mock data; no Google account or API is used. Pain points below are hypotheses to validate, not research findings.</p>
        </header>

        <section><h2 className="mb-3 font-display text-2xl">1. Existing interface analysis</h2>
          <dl className="divide-y rounded-lg border">{analysis.map(([k, v]) => <div key={k} className="grid gap-1 p-4 sm:grid-cols-[140px_1fr]"><dt className="font-medium">{k}</dt><dd className="text-sm text-muted-foreground">{v}</dd></div>)}</dl>
        </section>

        <section><h2 className="mb-3 font-display text-2xl">2. User needs & assumed pain points</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">{needs.map((n) => <li key={n}>{n}</li>)}</ul>
        </section>

        <section><h2 className="mb-3 font-display text-2xl">3. Proposed improvements & rationale</h2>
          <ul className="space-y-3">{improvements.map(([k, v]) => <li key={k} className="rounded-lg border p-4"><p className="font-medium">{k}</p><p className="text-sm text-muted-foreground">{v}</p></li>)}</ul>
        </section>

        <section><h2 className="mb-3 font-display text-2xl">4. Wireframes</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["Home", ["h-6", "h-10", "grid"]], ["Assignment", ["h-6", "split"]], ["To-do", ["h-6", "tabs", "rows"]]].map(([name, parts]) => (
              <figure key={name as string} className="rounded-lg border p-3">
                <div className="space-y-2">{(parts as string[]).map((p, i) => p === "grid" ? <div key={i} className="grid grid-cols-2 gap-2">{[0, 1, 2, 3].map((x) => <div key={x} className="h-12 rounded border-2 border-dashed" />)}</div> : p === "split" ? <div key={i} className="grid grid-cols-[2fr_1fr] gap-2"><div className="h-28 rounded border-2 border-dashed" /><div className="h-20 rounded border-2 border-dashed" /></div> : p === "tabs" ? <div key={i} className="flex gap-2">{[0, 1, 2].map((x) => <div key={x} className="h-4 flex-1 rounded border-2 border-dashed" />)}</div> : p === "rows" ? <div key={i} className="space-y-1">{[0, 1, 2, 3].map((x) => <div key={x} className="h-5 rounded border-2 border-dashed" />)}</div> : <div key={i} className={`${p} rounded border-2 border-dashed`} />)}</div>
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">{name as string}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section><h2 className="mb-3 font-display text-2xl">5. Interactive prototype</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/" className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">Home</Link>
            <Link to="/class/$classId" params={{ classId: "hci" }} className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">Class stream</Link>
            <Link to="/class/$classId/classwork" params={{ classId: "hci" }} className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">Classwork</Link>
            <Link to="/todo" className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">To-do</Link>
            <Link to="/assignment/$id" params={{ id: "hci-1" }} className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">Assignment</Link>
            <Link to="/upcoming" className="rounded border px-3 py-1.5 text-primary hover:bg-primary-soft">Upcoming</Link>
            <button onClick={() => { actions.reset(); alert("Demo data reset."); }} className="rounded border px-3 py-1.5 text-destructive hover:bg-destructive-soft">Reset demo submissions</button>
          </div>
        </section>

        <section><h2 className="mb-3 font-display text-2xl">6. Usability-testing checklist</h2>
          <p className="mb-3 text-sm text-muted-foreground">Tasks for future moderated sessions. Ticks are saved in this browser only; no results are reported here.</p>
          <ul className="divide-y rounded-lg border">{checklist.map((t, i) => <li key={i}><label className="flex cursor-pointer items-start gap-3 p-3 text-sm hover:bg-accent"><input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} className="mt-0.5 size-4 accent-primary" /><span>{i + 1}. {t}</span></label></li>)}</ul>
        </section>
      </article>
    </AppShell>
  );
}
