// Bargain Beacon — page wiring.
// One job: read the controls, ask filters.js for the deals to show, hand
// them to render.js, and paint the result. All state lives in `state`.

import { CATEGORIES, CHECKED_NOTE, DEALS, STORES } from "./deals.js";
import { SORTS, applyFilters, emptyState } from "./filters.js";
import { dealGrid, summaryLine, verdictLegend } from "./render.js";

const state = emptyState();

const grid = document.getElementById("deal-grid");
const countEl = document.getElementById("result-count");
const verdictEl = document.getElementById("verdict-counts");
const savingEl = document.getElementById("total-saving");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const storeEl = document.getElementById("store");
const discountEl = document.getElementById("min-discount");
const sortEl = document.getElementById("sort");
const resetEl = document.getElementById("reset");

function fillSelect(select, items, allLabel) {
  select.innerHTML = `<option value="all">${allLabel}</option>` +
    items.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function fillSort(select) {
  select.innerHTML = Object.entries(SORTS)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
}

export function renderAll() {
  const shown = applyFilters(DEALS, state);
  grid.innerHTML = dealGrid(shown);
  const summary = summaryLine(DEALS.length, shown.length);
  countEl.textContent = summary.showing;
  verdictEl.textContent = summary.counts;
  savingEl.textContent = summary.totalSaving;
}

// Shareable views: a link such as ?category=Audio&minDiscount=40 opens the
// finder with those filters already applied, so a filtered screenshot shows
// the same state a shopper would get from that link.
function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") ?? params.get("search") ?? "";
  const category = params.get("category") ?? "all";
  const store = params.get("store") ?? "all";
  const minDiscount = Number(params.get("minDiscount") ?? params.get("min") ?? 0);
  const sort = params.get("sort") ?? "verdict";
  if (query) state.query = query;
  if (CATEGORIES.includes(category)) state.category = category;
  if (STORES.includes(store)) state.store = store;
  if ([0, 20, 30, 40, 50].includes(minDiscount)) state.minDiscount = minDiscount;
  if (sort in SORTS) state.sort = sort;
}

function syncControls() {
  searchEl.value = state.query;
  categoryEl.value = state.category;
  storeEl.value = state.store;
  discountEl.value = String(state.minDiscount);
  sortEl.value = state.sort;
}

function resetFilters() {
  Object.assign(state, emptyState());
  searchEl.value = "";
  categoryEl.value = "all";
  storeEl.value = "all";
  discountEl.value = "0";
  sortEl.value = "verdict";
  renderAll();
}

export function initFinder() {
  fillSelect(categoryEl, CATEGORIES, "All categories");
  fillSelect(storeEl, STORES, "All stores");
  fillSort(sortEl);
  document.getElementById("checked-note").textContent = CHECKED_NOTE;
  document.getElementById("legend").innerHTML = verdictLegend();

  searchEl.addEventListener("input", () => {
    state.query = searchEl.value;
    renderAll();
  });
  categoryEl.addEventListener("change", () => {
    state.category = categoryEl.value;
    renderAll();
  });
  storeEl.addEventListener("change", () => {
    state.store = storeEl.value;
    renderAll();
  });
  discountEl.addEventListener("change", () => {
    state.minDiscount = Number(discountEl.value);
    renderAll();
  });
  sortEl.addEventListener("change", () => {
    state.sort = sortEl.value;
    renderAll();
  });
  resetEl.addEventListener("click", resetFilters);

  readUrlState();
  syncControls();
  renderAll();
}

initFinder();
