# Life Roadmap

The repository root publishes Phuc's private-planning dashboard as a static site. The visible product is intentionally focused on **Life Roadmap** only, with three internal views:

- Roadmap — 2028 education route and original 2027 route
- Timeline & Citizenship — the original aligned route UI rendered directly as a native same-page tab (no iframe and no separate page), with a sticky year-synchronised Personal planning heuristic and selectable route highlighting
- Relationship & Family — the Personal planning heuristic only, derived from the confirmed reference PDF

## Source

The maintainable React/Vite project is in [`app/`](app/).

```bash
cd app
npm ci
npm run build
```

After verification, publish the generated `app/dist/index.html` and `app/dist/assets/` at the repository root. Vite uses `base: './'`, so the build works from GitHub Pages subpaths and private static hosting.

## Current planning baseline

- Retirement age: 65
- Roadmap window: age 24.3–65
- 2028 route: 3-year undergraduate → 2-year master → 3–5-year PhD
- Total education excludes post-PhD career
- Citizenship dates are conditional planning scenarios, not guarantees
