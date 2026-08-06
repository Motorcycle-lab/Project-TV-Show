//You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes();

  // Add search functionality
  const searchInput = document.getElementById("searchBar");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount(filteredEpisodes.length, allEpisodes.length);
  });

  // Initial render
  makePageForEpisodes(allEpisodes);
  updateEpisodeCount(allEpisodes.length, allEpisodes.length);
}

// Update the "Displaying X / Y episodes" text
function updateEpisodeCount(displayed, total) {
  const countElem = document.getElementById("episodeCount");
  countElem.textContent = `Displaying ${displayed} / ${total} episodes`;
}

// Render all episodes into the root element
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  const cards = episodeList.map((episode) => createEpisodeCard(episode));
  rootElem.append(...cards);
}

// Helper function to create and append a child element
function createChildElement(parent, tagName, textContent) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  parent.append(element);
  return element;
}

// Build a single episode card
function createEpisodeCard(episode) {
  const card = document.createElement("section");
  card.className = "episode-card";

  // Format episode code S01E01
  const formattedSeason = String(episode.season).padStart(2, "0");
  const formattedNumber = String(episode.number).padStart(2, "0");
  const episodeCode = `S${formattedSeason}E${formattedNumber}`;

  // Title
  createChildElement(card, "h3", episode.name);

  // Episode code ABOVE the image
  const codeElem = document.createElement("span");
  codeElem.textContent = episodeCode;
  codeElem.className = "episode-code";
  card.append(codeElem);

  // Episode image
  const img = document.createElement("img");
  img.src = episode.image ? episode.image.medium : "";
  img.alt = episode.name;
  card.append(img);

  // Summary
  const summaryElem = document.createElement("div");
  summaryElem.innerHTML = episode.summary;
  card.append(summaryElem);

  return card;
}

//build a function;
//put the template insides
//loop it

// Grab one from th
// create a space and put the information inside.
//create a card and put the data type inside
window.onload = setup;