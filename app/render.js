// Bargain Beacon — turning deals into HTML.
// One job: build the card markup and the summary numbers. It never reads the
// controls and never fetches anything; main.js hands it filtered deals.

import { DEALS, VERDICT_LABELS, discountPct, saving } from "./deals.js";
import { countByVerdict } from "./filters.js";

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const save = saving(deal);
  return `
  <article class="card verdict-${deal.verdict}" data-id="${deal.id}">
    <div class="card-top">
      <span class="store">${deal.store}</span>
      <span class="category">${deal.category}</span>
    </div>
    <h3 class="product">${deal.product}</h3>
    <p class="prices">
      <span class="sale">${money(deal.sale)}</span>
      <span class="usual">${money(deal.usual)}</span>
      <span class="pct">-${pct}%</span>
    </p>
    <p class="saving">You save ${money(save)}</p>
    <p class="verdict"><span class="badge badge-${deal.verdict}">${VERDICT_LABELS[deal.verdict]}</span></p>
    <p class="evidence">${deal.evidence}</p>
    <p class="checked">Checked ${deal.checked} — ${deal.source}</p>
    <a class="store-link" href="${deal.link}" target="_blank" rel="noopener">View at ${deal.store} &rarr;</a>
  </article>`;
}

export function dealGrid(deals) {
  if (!deals.length) {
    return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
  }
  return deals.map(dealCard).join("\n");
}

// A legend under the controls so a shopper can read the verdict badges at
// a glance without guessing what each colour means.
export function verdictLegend() {
  const meanings = {
    "new-low": "lowest price reported",
    strong: "genuine, well-above-average cut",
    routine: "real saving, modest or seen before",
    inflated: "list price was raised first — % overstates it",
  };
  return Object.entries(VERDICT_LABELS)
    .map(
      ([key, label]) =>
        `<span class="legend-item"><span class="badge badge-${key}">${label}</span> ${meanings[key]}</span>`,
    )
    .join(" ");
}

export function summaryLine(total, shown) {
  const counts = countByVerdict(DEALS);
  const totalSaving = DEALS.reduce((sum, d) => sum + saving(d), 0);
  return {
    showing: `Showing ${shown} of ${total} deals`,
    counts: `${counts["new-low"]} new lows · ${counts.strong} strong deals · ${counts.routine} routine · ${counts.inflated} inflated lists flagged`,
    totalSaving: `Combined savings if you bought one of each: ${money(totalSaving)}`,
  };
}
