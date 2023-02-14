// Keyboard Accessibility
const enterKey = 13;

// SVG Inline Rendering
document.querySelectorAll("img.svg").forEach(image => {
  const imgID = image.getAttribute("id");
  const imgClass = image.getAttribute("class");
  const imgURL = image.getAttribute("src");

  fetch(imgURL).
  then(data => data.text()).
  then(response => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response, "text/html");
    let svg = xmlDoc.querySelector("svg");

    if (typeof imgID !== "undefined") {
      svg.setAttribute("id", imgID);
    }

    if (typeof imgClass !== "undefined") {
      svg.setAttribute("class", imgClass + " svg__replaced");
    }

    svg.removeAttribute("xmlns:a");

    image.parentNode.replaceChild(svg, image);
  });
});

// Theme Toggle
const toggleSwitch = document.querySelector('[data-value="toggle"]');
const toggleLabel = toggleSwitch.firstElementChild;
const toggleIcon = toggleSwitch.lastElementChild;
const storedLabel = localStorage.getItem("text");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

function switchTheme() {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let targetTheme = "light";

  if (currentTheme === "light") {
    targetTheme = "dark";
    toggleLabel.innerHTML = currentTheme;
    toggleIcon.lastElementChild.firstElementChild.setAttribute(
    "d",
    "M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z");

  }

  if (currentTheme === "dark") {
    toggleLabel.innerHTML = currentTheme;
    toggleIcon.lastElementChild.firstElementChild.setAttribute(
    "d",
    "M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z");

  }

  document.documentElement.setAttribute("data-theme", targetTheme);
  localStorage.setItem("text", targetTheme);
  localStorage.setItem("theme", targetTheme);
}

toggleSwitch.addEventListener("click", switchTheme);

// Detect Prefers-Color-Scheme
const scheme = window.matchMedia("(prefers-color-scheme: dark)");

scheme.addEventListener("change", switchTheme);

// Form Submission
const text = document.getElementById("text");
const submit = document.getElementById("submit");
const empty = text.nextElementSibling;

text.addEventListener("focusin", clearParameter);
submit.addEventListener("click", initParameter);
text.addEventListener("keydown", e => {
  if (e.keyCode === enterKey) {
    initParameter();
  }
});

function clearParameter() {
  text.setAttribute("placeholder", "Search Github username...");
  text.classList.remove("is-active");
  text.value = "";
}

// Parameter Initialization
function initParameter() {
  const username = text.value;

  if (username == "") {
    text.setAttribute("placeholder", "Kullanıcı adı girilmedi");
    text.classList.add("is-active");
  } else {
    text.classList.remove("is-active");
    fetchData(username);
  }
}

// Page Load Default
window.addEventListener("load", fetchData("arjenxyz"));

// API Call Request
function fetchData(username) {
  fetch(`https://api.github.com/users/${username}`, { cache: "no-cache" }).
  then(response => response.json()).
  then(data => {
    // console.log(JSON.stringify(data));
    mapData(data);
  });
}

// API Data Mapping
function mapData(data) {
  const record = document.querySelector('[data-value="record"]');
  const recordValidation = document.querySelector('[data-value="validate"]');
  if (data.id != undefined) {
    record.classList.remove("is-disabled");
    recordValidation.classList.remove("is-active");
  } else {
    record.classList.add("is-disabled");
    recordValidation.classList.add("is-active");
  }

  const avatar = document.querySelector('[data-value="avatar"]');
  avatar.setAttribute("src", data.avatar_url);
  avatar.setAttribute("alt", "avatar");
  avatar.innerText = "";

  const name = document.querySelector('[data-value="name"]');
  name.innerText = data.name;

  const html = document.querySelector('[data-value="html"]');
  html.setAttribute("href", data.html_url);
  html.setAttribute("target", "_blank");
  html.setAttribute("rel", "noreferrer noopener");
  html.innerText = "@" + data.login;

  const created = document.querySelector('[data-value="created"]');
  const createDate = new Date(data.created_at),
  day = createDate.getDate(),
  month = createDate.toLocaleString("en-US", {
    month: "short" }),

  year = createDate.getFullYear();
  created.innerText = `Kullanıcı şu tarihte katıldı : ${day} ${month} ${year}`;

  const bio = document.querySelector('[data-value="bio"]');
  if (data.bio != null && data.bio != "") {
    bio.innerText = data.bio;
  } else {
    bio.innerText = "Bu profilin biyografisi yok.";
  }

  const repos = document.querySelector('[data-value="repos"]');
  repos.innerText = data.public_repos;

  const followers = document.querySelector('[data-value="followers"]');
  followers.innerText = data.followers;

  const following = document.querySelector('[data-value="following"]');
  following.innerText = data.following;

  const location = document.querySelector('[data-value="location"]');
  if (data.location != null && data.location != "") {
    location.innerText = data.location;
    location.parentNode.classList.remove("is-disabled");
  } else {
    location.innerText = "Müsait değil";
    location.parentNode.classList.add("is-disabled");
  }

  const blog = document.querySelector('[data-value="blog"]');
  if (data.blog != null && data.blog != "") {
    blog.setAttribute("href", data.blog);
    blog.setAttribute("target", "_blank");
    blog.setAttribute("rel", "noreferrer noopener");
    blog.innerText = data.blog;
    blog.parentNode.classList.remove("is-disabled");
  } else {
    blog.innerHTML = "Müsait Değil";
    blog.parentNode.classList.add("is-disabled");
  }

  const twitter = document.querySelector('[data-value="twitter"]');
  if (data.twitter_username != null && data.twitter_username != "") {
    twitter.setAttribute(
    "href",
    `https://twitter.com/${data.twitter_username}`);

    twitter.setAttribute("target", "_blank");
    twitter.setAttribute("rel", "noreferrer noopener");
    twitter.innerText = data.twitter_username;
    twitter.parentNode.classList.remove("is-disabled");
  } else {
    twitter.innerHTML = "Müsait Değil";
    twitter.parentNode.classList.add("is-disabled");
  }

  const company = document.querySelector('[data-value="company"]');
  if (data.company != null && data.company != "") {
    company.innerText = data.company;
    company.parentNode.classList.remove("is-disabled");
  } else {
    company.innerText = "Müsait Değil";
    company.parentNode.classList.add("is-disabled");
  }

  // console.log("Data Output =>", data);
}