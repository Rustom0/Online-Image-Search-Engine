const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResults = document.getElementById("search-result");
const showmoreBtn = document.getElementById("show-more-button");

// Config
const CONFIG = {
  accessKey: "iGA2OZMxOqKkEI30hGfNivFkORRbB6nP-vu0EqixtSA",
  apiBase: "https://api.unsplash.com/search/photos",
  perPage: 12
};

// State
let keyword = "";
let page = 1;
let isLoading = false;
let hasMoreResults = true;

async function searchImages() {
  const trimmedKeyword = searchBox.value.trim();

  if (!trimmedKeyword) {
    alert("Please enter a search keyword");
    return;
  }

  // Prevent duplicate requests
  if (isLoading) return;
  isLoading = true;
  showmoreBtn.disabled = true;

  try {
    const url = new URL(CONFIG.apiBase);
    url.searchParams.set("page", page);
    url.searchParams.set("query", trimmedKeyword);
    url.searchParams.set("client_id", CONFIG.accessKey);
    url.searchParams.set("per_page", CONFIG.perPage);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const { results, total } = await response.json();

    // Clear results on first page
    if (page === 1) {
      searchResults.innerHTML = "";
      keyword = trimmedKeyword;
    }

    if (!results.length) {
      if (page === 1) {
        searchResults.innerHTML = "<p>No images found. Try another search.</p>";
      }
      hasMoreResults = false;
      showmoreBtn.style.display = "none";
      return;
    }

    // Use DocumentFragment for efficient DOM insertion
    const fragment = document.createDocumentFragment();

    results.forEach(({ urls, links, alt_description }) => {
      const img = document.createElement("img");
      img.src = urls.small;
      img.alt = alt_description || "Search result image";
      img.loading = "lazy";

      const imgLink = document.createElement("a");
      imgLink.href = links.html;
      imgLink.target = "_blank";
      imgLink.rel = "noopener noreferrer";
      imgLink.className = "image-link";
      imgLink.appendChild(img);

      fragment.appendChild(imgLink);
    });

    searchResults.appendChild(fragment);

    // Check if there are more results
    const currentTotal = page * CONFIG.perPage;
    hasMoreResults = currentTotal < total;
    showmoreBtn.style.display = hasMoreResults ? "block" : "none";

  } catch (error) {
    console.error("Search failed:", error);
    if (page === 1) {
      searchResults.innerHTML = "<p>Error loading images. Please try again.</p>";
    } else {
      alert("Failed to load more images. Please try again.");
    }
    showmoreBtn.style.display = "block";
  } finally {
    isLoading = false;
    showmoreBtn.disabled = false;
  }
}

// Event Listeners
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  hasMoreResults = true;
  searchImages();
});

showmoreBtn.addEventListener("click", () => {
  if (hasMoreResults && !isLoading) {
    page++;
    searchImages();
  }
});