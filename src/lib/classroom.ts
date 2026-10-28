import { useSyncExternalStore } from "react";

export type ClassInfo = {
  id: string; name: string; section: string; teacher: string; room: string; color: number; code: string;
};
export type Attachment = { name: string; kind: "pdf" | "doc" | "link" | "image" | "slides" };
export type WorkKind = "assignment" | "material" | "quiz";
export type Work = {
  id: string; classId: string; topic: string; kind: WorkKind; title: string;
  instructions: string; points?: number; dueOffsetDays?: number; dueTime?: string;
  postedOffsetDays: number; attachments: Attachment[];
};
export type Announcement = { id: string; classId: string; author: string; postedOffsetDays: number; text: string; attachments?: Attachment[] };

export const classes: ClassInfo[] = [
  { id: "hci", name: "Human-Computer Interaction", section: "MCA – Sem 3 · Section A", teacher: "Dr. Anjali Rao", room: "Lab 204", color: 1, code: "hx7k2pq" },
  { id: "dbms", name: "Advanced Database Systems", section: "MCA – Sem 3", teacher: "Prof. Ramesh Iyer", room: "Room 112", color: 2, code: "db93mna" },
  { id: "ml", name: "Machine Learning", section: "MCA – Sem 3 · Elective", teacher: "Dr. Kavya Menon", room: "Lab 301", color: 3, code: "ml4zz0e" },
  { id: "web", name: "Web Technologies", section: "MCA – Sem 3", teacher: "Mr. Arjun Shetty", room: "Lab 105", color: 4, code: "wt22bcd" },
  { id: "se", name: "Software Engineering", section: "MCA – Sem 3 · Section A", teacher: "Dr. Priya Nair", room: "Room 210", color: 5, code: "se81tyu" },
  { id: "cn", name: "Computer Networks", section: "MCA – Sem 3", teacher: "Prof. Suresh Kumar", room: "Room 118", color: 6, code: "cn55hgf" },
];

export const works: Work[] = [
  { id: "hci-1", classId: "hci", topic: "Unit 2 · Usability", kind: "assignment", title: "Heuristic evaluation of a learning platform", instructions: "Pick any learning platform and evaluate it against Nielsen's 10 usability heuristics.\n\nDeliverables:\n• A table listing each violation, its heuristic and severity (0–4)\n• At least 3 annotated screenshots\n• A one-page summary of top recommendations\n\nSubmit as a single PDF.", points: 20, dueOffsetDays: 2, dueTime: "11:59 PM", postedOffsetDays: -5, attachments: [{ name: "Nielsen_Heuristics.pdf", kind: "pdf" }, { name: "Severity rating template", kind: "doc" }] },
  { id: "hci-2", classId: "hci", topic: "Unit 2 · Usability", kind: "material", title: "Lecture slides – Usability testing methods", instructions: "Slides from Tuesday's lecture on moderated vs. unmoderated testing.", postedOffsetDays: -3, attachments: [{ name: "Usability_Testing.pptx", kind: "slides" }] },
  { id: "hci-3", classId: "hci", topic: "Unit 1 · Foundations", kind: "assignment", title: "Persona & journey map", instructions: "Create two personas and one journey map for a student using an LMS. Use the template provided.", points: 15, dueOffsetDays: -3, dueTime: "11:59 PM", postedOffsetDays: -12, attachments: [{ name: "Persona template", kind: "doc" }] },
  { id: "hci-4", classId: "hci", topic: "Unit 3 · Prototyping", kind: "assignment", title: "EL-1: Redesign case study", instructions: "Submit your complete UI/UX redesign case study including analysis, wireframes, high-fidelity screens and an interactive prototype link.", points: 50, dueOffsetDays: 9, dueTime: "5:00 PM", postedOffsetDays: -1, attachments: [{ name: "EL-1 rubric.pdf", kind: "pdf" }, { name: "figma.com/case-study-guide", kind: "link" }] },
  { id: "dbms-1", classId: "dbms", topic: "Transactions", kind: "assignment", title: "Concurrency control problem set", instructions: "Solve problems 1–8 on two-phase locking and timestamp ordering. Show the schedule for each.", points: 25, dueOffsetDays: 1, dueTime: "9:00 AM", postedOffsetDays: -6, attachments: [{ name: "ProblemSet_4.pdf", kind: "pdf" }] },
  { id: "dbms-2", classId: "dbms", topic: "NoSQL", kind: "quiz", title: "Quiz: Document stores", instructions: "10 MCQs, 15 minutes. Opens in a new tab.", points: 10, dueOffsetDays: 4, dueTime: "11:59 PM", postedOffsetDays: -2, attachments: [{ name: "Quiz form", kind: "link" }] },
  { id: "dbms-3", classId: "dbms", topic: "Transactions", kind: "material", title: "Reading: ACID properties", instructions: "Chapter 17 from the textbook.", postedOffsetDays: -8, attachments: [{ name: "Chapter17.pdf", kind: "pdf" }] },
  { id: "ml-1", classId: "ml", topic: "Supervised learning", kind: "assignment", title: "Linear regression notebook", instructions: "Implement linear regression from scratch with NumPy and compare it with scikit-learn on the housing dataset.", points: 30, dueOffsetDays: -1, dueTime: "11:59 PM", postedOffsetDays: -10, attachments: [{ name: "housing.csv", kind: "doc" }, { name: "starter.ipynb", kind: "doc" }] },
  { id: "ml-2", classId: "ml", topic: "Supervised learning", kind: "assignment", title: "Decision trees – short report", instructions: "Write a 2-page report comparing Gini and entropy splitting.", points: 20, dueOffsetDays: 6, dueTime: "11:59 PM", postedOffsetDays: -2, attachments: [] },
  { id: "web-1", classId: "web", topic: "React", kind: "assignment", title: "Build a to-do app with React hooks", instructions: "Use useState and useEffect. Persist tasks to localStorage. Deploy and share the link.", points: 20, dueOffsetDays: 3, dueTime: "11:59 PM", postedOffsetDays: -4, attachments: [{ name: "Requirements.pdf", kind: "pdf" }] },
  { id: "web-2", classId: "web", topic: "HTML & CSS", kind: "assignment", title: "Responsive portfolio page", instructions: "Create a responsive portfolio page using Flexbox and Grid.", points: 15, dueOffsetDays: -6, dueTime: "11:59 PM", postedOffsetDays: -14, attachments: [] },
  { id: "se-1", classId: "se", topic: "Requirements", kind: "assignment", title: "SRS document – team project", instructions: "Prepare the Software Requirements Specification following IEEE 830.", points: 25, dueOffsetDays: 12, dueTime: "11:59 PM", postedOffsetDays: -1, attachments: [{ name: "IEEE830_template.doc", kind: "doc" }] },
  { id: "cn-1", classId: "cn", topic: "Transport layer", kind: "assignment", title: "TCP congestion control worksheet", instructions: "Answer the worksheet questions on slow start and AIMD.", points: 10, dueOffsetDays: 0, dueTime: "11:59 PM", postedOffsetDays: -3, attachments: [{ name: "Worksheet_TCP.pdf", kind: "pdf" }] },
  { id: "cn-2", classId: "cn", topic: "Transport layer", kind: "material", title: "Wireshark lab guide", instructions: "Guide for next week's lab.", postedOffsetDays: -2, attachments: [{ name: "Wireshark_Lab.pdf", kind: "pdf" }] },
];

export const announcements: Announcement[] = [
  { id: "a1", classId: "hci", author: "Dr. Anjali Rao", postedOffsetDays: -1, text: "EL-1 case study has been posted under Unit 3. Please read the rubric carefully — the usability testing checklist carries 10 marks.", attachments: [{ name: "EL-1 rubric.pdf", kind: "pdf" }] },
  { id: "a2", classId: "hci", author: "Dr. Anjali Rao", postedOffsetDays: -4, text: "No class on Friday. Use the time to start your heuristic evaluation." },
  { id: "a3", classId: "dbms", author: "Prof. Ramesh Iyer", postedOffsetDays: -2, text: "Mid-term marks are now available. Office hours on Thursday 3–4 PM." },
  { id: "a4", classId: "ml", author: "Dr. Kavya Menon", postedOffsetDays: -1, text: "Reminder: GPU lab access requires the signed form." },
  { id: "a5", classId: "web", author: "Mr. Arjun Shetty", postedOffsetDays: -3, text: "Guest lecture on Next.js next Monday at 10 AM in the seminar hall." },
  { id: "a6", classId: "se", author: "Dr. Priya Nair", postedOffsetDays: -1, text: "Team formation for the semester project closes this week." },
  { id: "a7", classId: "cn", author: "Prof. Suresh Kumar", postedOffsetDays: -2, text: "Lab manuals are now available at the library." },
];

export const getClass = (id: string) => classes.find((c) => c.id === id);
export const getWork = (id: string) => works.find((w) => w.id === id);
export const bannerClass = (n: number) => `bg-banner-${n}`;
// Safelist dynamic classes
export const _safelist = "bg-banner-1 bg-banner-2 bg-banner-3 bg-banner-4 bg-banner-5 bg-banner-6 text-banner-1 text-banner-2 text-banner-3 text-banner-4 text-banner-5 text-banner-6";

export function dateFromOffset(days: number, base = new Date()) {
  const d = new Date(base); d.setHours(23, 59, 0, 0); d.setDate(d.getDate() + days); return d;
}
export function formatDue(days?: number, time?: string) {
  if (days === undefined) return "No due date";
  const d = dateFromOffset(days);
  if (days === 0) return `Due today, ${time ?? ""}`.trim();
  if (days === 1) return `Due tomorrow, ${time ?? ""}`.trim();
  return `Due ${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}${time ? `, ${time}` : ""}`;
}
export function formatPosted(days: number) {
  if (days === 0) return "Today";
  if (days === -1) return "Yesterday";
  return dateFromOffset(days).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------- Submission state (localStorage) ----------
export type Submission = { files: string[]; submittedAt: string; comment?: string };
type State = { submissions: Record<string, Submission>; drafts: Record<string, string[]> };
const KEY = "gc-redesign-state-v1";
let state: State = { submissions: { "web-2": { files: ["portfolio.zip"], submittedAt: new Date(Date.now() - 7 * 864e5).toISOString() } }, drafts: {} };
let loaded = false;
const listeners = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) state = JSON.parse(raw); } catch { /* ignore */ }
}
function emit() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } listeners.forEach((l) => l()); }
const serverState = state;
export function useClassroomState() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => serverState,
  );
}
export const actions = {
  addFile(workId: string, name: string) { const cur = state.drafts[workId] ?? []; state = { ...state, drafts: { ...state.drafts, [workId]: [...cur, name] } }; emit(); },
  removeFile(workId: string, name: string) { state = { ...state, drafts: { ...state.drafts, [workId]: (state.drafts[workId] ?? []).filter((f) => f !== name) } }; emit(); },
  submit(workId: string, comment?: string) {
    const files = state.drafts[workId] ?? [];
    state = { submissions: { ...state.submissions, [workId]: { files, submittedAt: new Date().toISOString(), comment } }, drafts: { ...state.drafts, [workId]: [] } }; emit();
  },
  unsubmit(workId: string) {
    const sub = state.submissions[workId]; if (!sub) return;
    const { [workId]: _, ...rest } = state.submissions;
    state = { submissions: rest, drafts: { ...state.drafts, [workId]: sub.files } }; emit();
  },
  reset() { state = { submissions: {}, drafts: {} }; emit(); },
};

export type Status = "assigned" | "due-soon" | "missing" | "done" | "done-late";
/** Status rules: done if submitted; missing if due date passed (days < 0); due-soon if due within 2 days. */
export function statusOf(w: Work, s: State): Status {
  const sub = s.submissions[w.id];
  if (sub) return w.dueOffsetDays !== undefined && w.dueOffsetDays < 0 && !s.submissions[w.id]?.submittedAt.startsWith("20") ? "done-late" : "done";
  if (w.dueOffsetDays === undefined) return "assigned";
  if (w.dueOffsetDays < 0) return "missing";
  if (w.dueOffsetDays <= 2) return "due-soon";
  return "assigned";
}
export const gradable = works.filter((w) => w.kind !== "material");
