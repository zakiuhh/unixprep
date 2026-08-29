/* ===================== [LATEST-JS] =====================
   Builds the "Latest added" strip by cloning any card in the
   main grid marked data-latest="true" — so you only ever edit
   a resource in one place. Toggle that attribute on a card in
   resources.html's [RESOURCE-GRID] to feature or unfeature it. */
const latestBlock = document.getElementById("latest-block");
const latestStrip = document.getElementById("latest-strip");
const latestSource = document.querySelectorAll('#resource-grid [data-latest="true"]');

if (latestSource.length === 0) {
  latestBlock.hidden = true;
} else {
  latestSource.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add("latest-card");
    latestStrip.appendChild(clone);
  });
}

/* ===================== [SEARCH-JS] =====================
   Live-filters the cards in #resource-grid as the person
   types, matching against each card's visible text plus its
   data-tags attribute. Shows #no-results when nothing matches. */
const searchInput = document.getElementById("resource-search");
const resourceCards = document.querySelectorAll("#resource-grid .resource-card");
const noResults = document.getElementById("no-results");
const noResultsQuery = document.getElementById("no-results-query");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  resourceCards.forEach(card => {
    const haystack = (card.textContent + " " + (card.dataset.tags || "")).toLowerCase();
    const matches = haystack.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  });

  const showNoResults = query.length > 0 && visibleCount === 0;
  noResults.hidden = !showNoResults;
  noResultsQuery.textContent = searchInput.value.trim();
});
