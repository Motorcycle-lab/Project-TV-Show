//You can edit ALL of the code here

// You can edit ALL of the code here

let allEpisodesCache = [];

async function setup() {
  const rootElem = document.getElementById("root");

  rootElem.textContent = "Loading episodes, please wait ...";

  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const allEpisodes = await response.json();
    allEpisodesCache = allEpisodes;

    rootElem.textContent = "";

    setupSearchBar();
    createEpisodeSelectElement();
    createEpisodeOptions(allEpisodes);
    setupEpisodeSelectListener(allEpisodes);
    handleSearchInput(allEpisodes);

    makePageForEpisodes(allEpisodes);
  } catch (error) {
    showErrorState("Failed to load episodes. Please try again later.");
  }
}

function showErrorState(message) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
}

function formatEpisodeCode(season, episode) {
  const formattedSeason = String(season).padStart(2, "0");
  const formattedNumber = String(episode).padStart(2, "0");
  return `S${formattedSeason}E${formattedNumber}`;
}

// Drop-down list
function createEpisodeSelectElement() {
  const createSelect = document.createElement("select");
  createSelect.id = "episode-select";
  const rootElem = document.getElementById("root");
  document.body.insertBefore(createSelect, rootElem);
  return createSelect;
}

function createEpisodeOptions(episodes) {
  const createSelect = document.getElementById("episode-select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "ALL";
  defaultOption.textContent = "Show all episodes";
  createSelect.appendChild(defaultOption);

  episodes.map((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    createSelect.appendChild(option);
  });
}

function setupEpisodeSelectListener(episodes) {
  const createSelect = document.getElementById("episode-select");

  createSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "ALL") {
      makePageForEpisodes(episodes);
    } else {
      const result = episodes.filter(
        (episode) => episode.id === Number(selectedValue)
      );
      makePageForEpisodes(result);
    }
  });
}

// Set the search bar
function setupSearchBar() {
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "search-input";
  searchInput.name = "q";
  searchInput.placeholder = "Search episodes...";

  const searchCount = document.createElement("span");
  searchCount.id = "search-count";

  const rootElem = document.getElementById("root");
  document.body.insertBefore(searchInput, rootElem);
  document.body.insertBefore(searchCount, rootElem);
}

// Show specific episodes when the user types
function handleSearchInput(episodes) {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    const filteredEpisodes = episodes.filter((episode) => {
      const matchName = episode.name.toLowerCase().includes(searchTerm);
      const matchSummary = episode.summary.toLowerCase().includes(searchTerm);
      const matchCode = formatEpisodeCode(episode.season, episode.number)
        .toLowerCase()
        .includes(searchTerm);

      return matchName || matchSummary || matchCode;
    });

    makePageForEpisodes(filteredEpisodes);
  });
}

function makePageForEpisodes(episodeToDisplay) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const countElem = document.getElementById("search-count");
  if (countElem) {
    countElem.textContent = `Displaying ${episodeToDisplay.length}/${allEpisodesCache.length} episodes`;
  }

  const cards = episodeToDisplay.map((episode) => createDramaCard(episode));
  rootElem.append(...cards);
}

function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  parentElement.append(element);
  return element;
}

function createDramaCard(episode) {
  const card = document.createElement("section");
  card.classList.add("drama-card");

  const episodeCode = formatEpisodeCode(episode.season, episode.number);

  const smallcard = document.createElement("div");
  smallcard.classList.add("small-card");
  createChildElement(smallcard, "h3", `${episode.name} - ${episodeCode}`);
  card.append(smallcard);

  const img = document.createElement("img");
  img.src = episode.image ? episode.image.medium : "";
  card.append(img);

  const summaryElem = document.createElement("div");
  summaryElem.innerHTML = episode.summary || "<p>No summary available.</p>";
  card.append(summaryElem);

  return card;
}

window.onload = setup;
