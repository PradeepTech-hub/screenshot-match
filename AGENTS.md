<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Mock data and submission state live in `src/lib/classroom.ts` (localStorage store via useSyncExternalStore); prototype must stay frontend-only with no backend or Google API.
- All screens wrap content in `AppShell` (header + sidebar) so navigation stays consistent with Google Classroom's layout.
