const overview = document.querySelector(".overview");
const username = "emilychuah";
const repoList = document.querySelector(".repo-list");
const allReposContainer = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const viewReposButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getUserInfo = async () => {
    const fetchUserInfo = await fetch(`https://api.github.com/users/${username}`);
    const userData = await fetchUserInfo.json();
    displayUserInfo(userData);
};

getUserInfo();

const displayUserInfo = (data) => {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
        `;
    overview.append(div);
    getRepos();
};

const getRepos = async () => {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    displayRepos(repoData);
};

const displayRepos = (repos) => {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", (e) => {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async (repoName) => {
    const fetchRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();
    
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }

    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = (repoInfo, languages) => {
    allReposContainer.classList.add("hide"); 
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    viewReposButton.classList.remove("hide");

    const div = document.createElement("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
        `;
    repoData.append(div);
};

viewReposButton.addEventListener("click", () => {
    repoData.classList.add("hide");
    viewReposButton.classList.add("hide");
    allReposContainer.classList.remove("hide");
});

filterInput.addEventListener("input", (e) => {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lowerSearchText = searchText.toLowerCase();
    
    for (const repo of repos) {
        const lowerRepoText = repo.innerText.toLowerCase();
        if (lowerRepoText.includes(lowerSearchText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});