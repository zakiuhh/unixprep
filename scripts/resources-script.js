/* ===================== [SEARCH-JS] =====================
   While the search box is empty: [CATEGORIES] (the normal
   categorized browse view) is shown, [SEARCH-RESULTS] is hidden.

   While the search box has text: [CATEGORIES] is hidden, and
   [SEARCH-RESULTS] is filled with clones of every matching card,
   in one flat grid — no category headings, no non-matching cards.
   A card matches if every word you've typed appears somewhere in
   its title, description, or data-tags (any order, so "tool math"
   and "math tool" both work).

   Also handles: a clear (×) button and a live "X of Y shown" count
   (both self-installed into the search bar if not already present),
   debounced input, and keyboard shortcuts ("/" to focus the search
   box from anywhere, Escape to clear it). */
(function setUpResourceSearch() {
  const searchBar = document.querySelector(".search-bar");
  const searchInput = document.getElementById("resource-search");
  const categoriesWrap = document.getElementById("resource-categories");
  const searchResults = document.getElementById("search-results");
  const noResults = document.getElementById("no-results");
  const noResultsQuery = document.getElementById("no-results-query");

  if (!searchBar || !searchInput || !categoriesWrap || !searchResults) return;

  const allCards = document.querySelectorAll("#resource-categories .resource-card");

  function normalize(str) {
    return (str || "").toLowerCase().trim();
  }

  // Every word in the query must appear somewhere in the haystack.
  function matchesQuery(haystack, query) {
    if (!query) return true;
    const words = query.split(/\s+/).filter(Boolean);
    return words.every(word => haystack.includes(word));
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  let clearBtn = document.getElementById("resource-search-clear");
  if (!clearBtn) {
    clearBtn = document.createElement("button");
    clearBtn.id = "resource-search-clear";
    clearBtn.type = "button";
    clearBtn.className = "search-clear";
    clearBtn.setAttribute("aria-label", "Clear search");
    clearBtn.textContent = "×";
    clearBtn.hidden = true;
    searchBar.appendChild(clearBtn);
  }

  let resultCount = document.getElementById("resource-count");
  if (!resultCount) {
    resultCount = document.createElement("p");
    resultCount.id = "resource-count";
    resultCount.className = "search-count";
    resultCount.setAttribute("aria-live", "polite");
    searchBar.insertAdjacentElement("afterend", resultCount);
  }

  function runFilter() {
    const query = normalize(searchInput.value);

    // Empty box — show the normal categorized browse view, nothing else to do
    if (!query) {
      categoriesWrap.hidden = false;
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      if (noResults) noResults.hidden = true;
      clearBtn.hidden = true;
      resultCount.textContent = "";
      return;
    }

    // Searching — hide the categorized view, build a flat grid of matches only
    categoriesWrap.hidden = true;

    const matches = [];
    allCards.forEach(card => {
      const haystack = normalize(card.textContent + " " + (card.dataset.tags || ""));
      if (matchesQuery(haystack, query)) matches.push(card);
    });

    searchResults.innerHTML = "";
    matches.forEach(card => searchResults.appendChild(card.cloneNode(true)));

    searchResults.hidden = matches.length === 0;
    if (noResults) noResults.hidden = matches.length !== 0;
    if (noResultsQuery) noResultsQuery.textContent = searchInput.value.trim();

    clearBtn.hidden = false;
    resultCount.textContent = `${matches.length} of ${allCards.length} shown`;
  }

  function clearSearch() {
    searchInput.value = "";
    runFilter();
    searchInput.focus();
  }

  const debouncedFilter = debounce(runFilter, 120);
  searchInput.addEventListener("input", debouncedFilter);
  clearBtn.addEventListener("click", clearSearch);

  document.addEventListener("keydown", (e) => {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      searchInput.focus();
    }

    if (e.key === "Escape" && document.activeElement === searchInput) {
      clearSearch();
    }
  });

  runFilter(); // in case the box already has a value (e.g. back/forward navigation)
})();
