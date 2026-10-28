import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Home, Calendar, ClipboardList, CalendarClock, BookOpen, Settings, Plus, Grid3x3, X, FileText } from "lucide-react";
import { classes, bannerClass, gradable, statusOf, useClassroomState } from "@/lib/classroom";

function NavItem({ to, icon, label, active, badge, onClick }: { to: string; icon: ReactNode; label: string; active: boolean; badge?: number; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className={`flex h-12 items-center gap-5 rounded-r-full pl-6 pr-4 text-sm font-medium ${active ? "bg-primary-soft text-primary" : "text-foreground hover:bg-accent"}`}>
      {icon}<span className="flex-1 truncate">{label}</span>
      {badge ? <span className="rounded-full bg-destructive px-2 text-xs leading-5 text-destructive-foreground" aria-label={`${badge} missing`}>{badge}</span> : null}
    </Link>
  );
}

export function AppShell({ title, children, tabs }: { title?: ReactNode; children: ReactNode; tabs?: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const s = useClassroomState();
  const missing = gradable.filter((w) => statusOf(w, s) === "missing").length;
  const close = () => setOpen(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const sidebar = (
    <nav aria-label="Main" className="flex flex-col py-2">
      <NavItem to="/" icon={<Home className="size-5" />} label="Home" active={path === "/"} onClick={close} />
      <NavItem to="/upcoming" icon={<Calendar className="size-5" />} label="Upcoming" active={path === "/upcoming"} onClick={close} />
      <hr className="my-2" />
      <p className="px-6 py-2 text-sm font-medium text-muted-foreground">Enrolled</p>
      <NavItem to="/todo" icon={<ClipboardList className="size-5" />} label="To-do" active={path === "/todo"} badge={missing} onClick={close} />
      {classes.map((c) => (
        <Link key={c.id} to="/class/$classId" params={{ classId: c.id }} onClick={close}
          className={`flex h-14 items-center gap-4 rounded-r-full pl-5 pr-4 ${path.startsWith(`/class/${c.id}`) ? "bg-primary-soft" : "hover:bg-accent"}`}>
          <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-medium text-on-banner ${bannerClass(c.color)}`}>{c.name[0]}</span>
          <span className="min-w-0"><span className="block truncate text-sm font-medium">{c.name}</span><span className="block truncate text-xs text-muted-foreground">{c.section}</span></span>
        </Link>
      ))}
      <hr className="my-2" />
      <NavItem to="/case-study" icon={<FileText className="size-5" />} label="UX case study" active={path === "/case-study"} onClick={close} />
      <button onClick={() => say("Archived classes: none in this demo")} className="flex h-12 items-center gap-5 rounded-r-full pl-6 text-sm font-medium hover:bg-accent"><BookOpen className="size-5" />Archived classes</button>
      <button onClick={() => say("Settings are not part of this prototype")} className="flex h-12 items-center gap-5 rounded-r-full pl-6 text-sm font-medium hover:bg-accent"><Settings className="size-5" />Settings</button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center gap-2 px-2 sm:px-4">
          <button aria-label="Main menu" onClick={() => setOpen((o) => !o)} className="grid size-12 place-items-center rounded-full hover:bg-accent"><Menu className="size-6 text-muted-foreground" /></button>
          <Link to="/" className="flex items-center gap-2 pr-2">
            <span className="grid size-8 place-items-center rounded bg-success text-on-banner"><ClipboardList className="size-5" /></span>
            <span className="font-display text-[22px] text-muted-foreground">Classroom</span>
          </Link>
          {title ? <span className="hidden min-w-0 items-center gap-2 truncate font-display text-[22px] sm:flex"><span className="text-muted-foreground">›</span><span className="truncate">{title}</span></span> : null}
          <div className="ml-auto flex items-center gap-1">
            <button aria-label="Join class" onClick={() => say("Join class: use a class code from your teacher (demo)")} className="grid size-12 place-items-center rounded-full hover:bg-accent"><Plus className="size-6 text-muted-foreground" /></button>
            <button aria-label="Google apps" onClick={() => say("Google apps menu (demo)")} className="hidden size-12 place-items-center rounded-full hover:bg-accent sm:grid"><Grid3x3 className="size-5 text-muted-foreground" /></button>
            <span aria-label="Signed in as Pradeep M" className="ml-1 grid size-8 place-items-center rounded-full bg-banner-5 text-sm font-medium text-on-banner">P</span>
          </div>
        </div>
        {tabs}
      </header>
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r lg:block">{sidebar}</aside>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={close} />
            <aside className="relative h-full w-72 overflow-y-auto bg-background shadow-gc">
              <div className="flex h-16 items-center justify-between px-4"><span className="font-display text-xl text-muted-foreground">Classroom</span><button aria-label="Close" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-accent"><X className="size-5" /></button></div>
              {sidebar}
            </aside>
          </div>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      {toast && <div role="status" className="fixed bottom-6 left-6 z-50 rounded bg-foreground px-4 py-3 text-sm text-background shadow-gc">{toast}</div>}
    </div>
  );
}

export function ClassTabs({ classId, active }: { classId: string; active: "stream" | "classwork" }) {
  const cls = "flex h-12 items-center border-b-4 px-4 text-sm font-medium";
  return (
    <nav aria-label="Class sections" className="flex justify-center gap-2">
      <Link to="/class/$classId" params={{ classId }} className={`${cls} ${active === "stream" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-accent"}`}>Stream</Link>
      <Link to="/class/$classId/classwork" params={{ classId }} className={`${cls} ${active === "classwork" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-accent"}`}>Classwork</Link>
    </nav>
  );
}
