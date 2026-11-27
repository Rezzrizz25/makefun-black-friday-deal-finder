# Bargain Beacon — Black Friday Deal Finder

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/Rezzrizz25/makefun-black-friday-deal-finder/rank.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/Rezzrizz25/makefun-black-friday-deal-finder/reward.svg)](https://make.fun/competitions/black-friday-deal-finder-01)

A static deal finder for Black Friday and Cyber Monday 2026: 36 real deals,
each checked by hand on Friday 27 November 2026 against the store or a deals
source that names the store. Every deal shows its product, store, store link,
sale price, usual price, discount, when its price was checked, where it was
read — and an honest verdict on whether it is really a deal (new low, strong
price, routine sale, or inflated list price).

- **Find it:** search by product name, filter by category, store and minimum
  discount, sort by biggest discount, biggest cash saving, lowest price or
  best verdict.
- **Trust it:** every price was read live on 27 Nov 2026. Deals whose list
  price was raised earlier this year are flagged, not celebrated.
- **Run it:** plain static files under `app/` — no build step, no network
  requests. Open `app/index.html` in any browser, or serve the folder with
  any static server.

Built for the [make.fun Black Friday deal finder bounty](https://make.fun/competitions/black-friday-deal-finder-01).
Try make.fun yourself: https://make.fun/r/v4m1pbv2

## Layout

- `app/index.html` — the page shell
- `app/style.css` — all styling, mobile-first
- `app/deals.js` — the 36 checked deals (product, store, prices, verdict, source)
- `app/filters.js` — search / filter / sort logic
- `app/render.js` — turns deals into cards and verdict badges
- `app/main.js` — wires the controls together
- `main.ts` — hands `app/` and `screenshots/` to `/output` with a dossier
- `screenshots/` — real renders of the site

## Run it locally

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

## License

MIT — see [LICENSE](LICENSE).
