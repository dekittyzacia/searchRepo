const searchInput = document.querySelector('.search-input');
const dropList = document.querySelector('.drop');
const savedList = document.querySelector('.saved')

const debounce = (fn) => {
  let delay;
  return function() {
    const callFn = () => {fn.apply(this, arguments)};
    clearTimeout(delay);
    delay = setTimeout(callFn, 300)
  }
};

// Creating cards functions

// General function for a list items
function createRepo (list, className, value) {
  let listElem = document.createElement('li');
    listElem.classList.add(className);
    listElem.textContent = value;
    list.append(listElem);
    return listElem;
}

// Creating dropcards function
function createDropRepo(list, className, value, repo) {
    let dropElem = createRepo(list, className, value);
    dropElem.addEventListener('click', () => {
      saveRepo(repo);
      searchInput.value = '';
      clearDropList();
    })
} 

// Creating saved cards function
function createSavedRepo (repoName, username, stars) {
    let text = `Repo: ${repoName};\nUser: ${username};\nStars: ${stars}`

    let savedElem = createRepo(savedList, 'saved__card', text);
    let closeButton = document.createElement('button');
    closeButton.classList.add('saved__button');
    savedElem.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
      savedElem.remove();
    })
} // Repo: reponame, User: username, Stars: stars

// Request function
async function requestGitHub (value) {
  if (searchInput.value !== '') {
    return await fetch(`https://api.github.com/search/repositories?q=${value}+in:name&sort=stars`)
      .then(response => response.json())
      .then(data => (data.items).slice(0, 5))
      .catch(e => console.log('Request error: ' + e))
  }
}

// Create drop list based on request result
async function createDropList (value) {
  let list = await requestGitHub(value);
  if (searchInput.value !== '' && list && list.length === 0) {
    createDropRepo(dropList, 'drop__card', 'Sorry, there is no repos with that name, change your request, please')
  } else if (list && list.length !== 0) {
    for (let item of list) {
      createDropRepo(dropList, 'drop__card', item.name, item);
    }
  }
}

createDropList = debounce(createDropList);

function saveRepo (repo) {
  createSavedRepo(repo.name, repo.owner.login, repo.stargazers_count)
}

function clearDropList () {
  let listElements = document.querySelectorAll('.drop__card');
  for (let item of listElements) {
    item.remove();
  }
}

searchInput.addEventListener('keyup', () => {
  clearDropList();
  createDropList(searchInput.value);
})


