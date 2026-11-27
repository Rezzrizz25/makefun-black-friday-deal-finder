// Bargain Beacon — search, filter and sort logic.
// One job: given the deal list and the shopper's controls, return the deals
// to show, in the order they should appear. No DOM work lives here.

import { DEALS, VERDICT_RANK, discountPct, saving } from "./deals.js";

export const SORTS = {
  verdict: "Best verdict first",
  discount: "Biggest % off",
  saving: "Biggest cash saving",
  price: "Lowest sale price",
  name: "Product A–Z",
};

export function emptyState() {
  return { query: "", category: "all", store: "all", minDiscount: 0, sort: "verdict" };
}

export function matchesQuery(deal, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return (
    deal.product.toLowerCase().includes(q) ||
    deal.store.toLowerCase().includes(q) ||
    deal.category.toLowerCase().includes(q)
  );
}

export function applyFilters(deals, state) {
  const kept = deals.filter(
    (d) =>
      matchesQuery(d, state.query) &&
      (state.category === "all" || d.category === state.category) &&
      (state.store === "all" || d.store === state.store) &&
      discountPct(d) >= state.minDiscount,
  );
  return sortDeals(kept, state.sort);
}

export function sortDeals(deals, sort) {
  const list = [...deals];
  switch (sort) {
    case "discount":
      return list.sort((a, b) => discountPct(b) - discountPct(a) || saving(b) - saving(a));
    case "saving":
      return list.sort((a, b) => saving(b) - saving(a) || discountPct(b) - discountPct(a));
    case "price":
      return list.sort((a, b) => a.sale - b.sale);
    case "name":
      return list.sort((a, b) => a.product.localeCompare(b.product));
    case "verdict":
    default:
      return list.sort(
        (a, b) =>
          VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
          discountPct(b) - discountPct(a),
      );
  }
}

export function countByVerdict(deals) {
  const counts = { "new-low": 0, strong: 0, routine: 0, inflated: 0 };
  for (const d of deals) counts[d.verdict] += 1;
  return counts;
}

export function bestDeal(deals) {
  if (!deals.length) return null;
  return sortDeals(deals, "verdict")[0];
}

export { DEALS };
