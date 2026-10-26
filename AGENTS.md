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

## Project rules
- Order creation + stock decrease runs only through the `registrar_pedido` SQL function, so it is one atomic transaction; never write orders from the client directly.
- Money is computed in integer cents on the client and numeric(…,2) in the database to avoid rounding errors.
- Public signup is enabled: anyone can create an account from the login screen ("Criar conta" mode), with email confirmation required.
- The Flask version of this project is delivered separately as a ZIP; this web app is the TanStack + Lovable Cloud alternative.
