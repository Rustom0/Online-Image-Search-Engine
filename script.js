const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResults = document.getElementById("search-result");
const showmoreBtn = document.getElementById("show-more-button");
const accessKey = "iGA2OZMxOqKkEI30hGfNivFkORRbB6nP-vu0EqixtSA";
let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value;
    const apiKey =`https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
    const response = await fetch(apiKey);
    const data = await response.json();
    if (page === 1) {
        searchResults.innerHTML = "";
    }
    const results = data.results;
    results.map((result) =>{
        const img = document.createElement("img");
        img.src = result.urls.small;
        const imgLink = document.createElement("a");
        imgLink.href = result.links.html;
        imgLink.target = "_blank";
        imgLink.appendChild(img);
        searchResults.appendChild(imgLink);

    });
    showmoreBtn.style.display = "block";

};

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});
showmoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
    showmoreBtn.style.display = "none";
});