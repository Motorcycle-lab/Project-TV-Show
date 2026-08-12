//You can edit ALL of the code here.

// ===============================
// LEVEL 400 – MULTI‑SHOW SUPPORT
// ===============================

// Cache for all shows
let allShowsCache = [];

// Cache for episodes per show: { showId: [episodes] }
let episodesCache = {};

// Currently selected show ID
let currentShowId = null;

// MAIN SETUP

async function setup() {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading shows, please wait ...";

  try {
    // 1. Fetch ALL shows (only once)
    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    allShowsCache = await response.json();

    // Sort alphabetically (case‑insensitive)
    allShowsCache.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    rootElem.textContent = "";

    // Build UI
    setupShowSelect();
    setupSearchBar();
    setupEpisodeSelectElement();

    // Populate show dropdown
    populateShowSelect(allShowsCache);
  } catch (error) {
    showErrorState("Failed to load shows. Please try again later.");
  }
}

// ERROR + LOADING

function showErrorState(message) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
}

function showLoading(message) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = message;
}

// SHOW SELECT DROPDOWN

function setupShowSelect() {
  const select = document.createElement("select");
  select.id = "show-select";
  document.body.insertBefore(select, document.getElementById("root"));

  select.addEventListener("change", async (event) => {
    const showId = Number(event.target.value);
    currentShowId = showId;

    await loadEpisodesForShow(showId);
  });
}

function populateShowSelect(shows) {
  const select = document.getElementById("show-select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show...";
  select.appendChild(defaultOption);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });
}

// FETCH EPISODES FOR SELECTED SHOW

async function loadEpisodesForShow(showId) {
  const rootElem = document.getElementById("root");
  showLoading("Loading episodes...");

  // If cached → use cache
  if (episodesCache[showId]) {
    renderEpisodes(episodesCache[showId]);
    updateEpisodeSelect(episodesCache[showId]);
    return;
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const episodes = await response.json();
    episodesCache[showId] = episodes;

    renderEpisodes(episodes);
    updateEpisodeSelect(episodes);
  } catch (error) {
    showErrorState("Failed to load episodes. Please try again later.");
  }
}

// EPISODE SELECT DROPDOWN

function setupEpisodeSelectElement() {
  const select = document.createElement("select");
  select.id = "episode-select";
  document.body.insertBefore(select, document.getElementById("root"));

  select.addEventListener("change", () => {
    const selectedId = Number(select.value);
    const episodes = episodesCache[currentShowId];

    if (selectedId === 0) {
      renderEpisodes(episodes);
    } else {
      const filtered = episodes.filter((ep) => ep.id === selectedId);
      renderEpisodes(filtered);
    }
  });
}

function updateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = 0;
  defaultOption.textContent = "Show all episodes";
  select.appendChild(defaultOption);

  episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}`;
    select.appendChild(option);
  });
}

// SEARCH BAR

function setupSearchBar() {
  const input = document.createElement("input");
  input.type = "search";
  input.id = "search-input";
  input.placeholder = "Search episodes...";

  const count = document.createElement("span");
  count.id = "search-count";

  document.body.insertBefore(input, document.getElementById("root"));
  document.body.insertBefore(count, document.getElementById("root"));

  input.addEventListener("input", () => {
    if (!currentShowId) return;

    const episodes = episodesCache[currentShowId];
    const term = input.value.toLowerCase().trim();

    const filtered = episodes.filter((ep) => {
      const name = ep.name.toLowerCase();
      const summary = ep.summary.toLowerCase();
      const code = formatEpisodeCode(ep.season, ep.number).toLowerCase();

      return (
        name.includes(term) || summary.includes(term) || code.includes(term)
      );
    });

    renderEpisodes(filtered);
  });
}

// RENDER EPISODES

function renderEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const countElem = document.getElementById("search-count");
  countElem.textContent = `Displaying ${episodes.length}/${episodesCache[currentShowId].length} episodes`;

  episodes.forEach((ep) => {
    rootElem.appendChild(createEpisodeCard(ep));
  });
}

// EPISODE CARD

function createEpisodeCard(ep) {
  const card = document.createElement("section");
  card.classList.add("drama-card");

  const code = formatEpisodeCode(ep.season, ep.number);

  const header = document.createElement("div");
  header.classList.add("small-card");
  header.textContent = `${ep.name} - ${code}`;
  card.appendChild(header);

  const img = document.createElement("img");
  img.src = ep.image ? ep.image.medium : "";
  card.appendChild(img);

  const summary = document.createElement("div");
  summary.innerHTML = ep.summary || "<p>No summary available.</p>";
  card.appendChild(summary);

  return card;
}

// UTIL

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

window.onload = setup;
