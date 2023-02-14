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
const toggleSwitch = document.querySelector(
'.switch__toggle input[type="checkbox"]');

const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

// toggleSwitch.addEventListener("change", switchTheme, false);

// Form Submission
const text = document.getElementById("text");
let textEntered = {
  type: null,
  value: text };

const submit = document.getElementById("submit");

text.addEventListener("focusin", clearParameter);
submit.addEventListener("click", validateData);
text.addEventListener("keydown", e => {
  if (e.keyCode === enterKey) {
    validateData();
  }
});

function clearParameter() {
  text.setAttribute("placeholder", "Herhangi bir IP adresi veya website  alan adı arayın");
  text.classList.remove("is-active");
  text.value = "";

  recordValidation.classList.remove("is-active");
  validateData();
}

// Page Load Default
window.addEventListener("load", function () {
  validateData();
});

// Parameter Initialization
const record = document.querySelector('[data-value="record"]');
const recordValidation = document.querySelector('[data-value="validate"]');

// "at_buolCeBWmSm37OCUs5M7VfDn6RD38", "at_LluZaWTFBybtezVOvix1Qa20F8BDz", "at_bh3Db2d8ZjVtqvxPWJrhVpbdOEvMA"
const key = "at_LluZaWTFBybtezVOvix1Qa20F8BDz";
const url = `https://geo.ipify.org/api/v1/?&apiKey=${key}`;
let valid, resource;

// function initParameter() {
//   const string = text.value;

//   if (string == "") {
//     text.setAttribute("placeholder", "No ip address or domain entered");
//     text.classList.add("is-active");
//   } else {
//     text.classList.remove("is-active");
//     validateData();
//   }
// }

// Validate Entered Text
function validateData() {
  if (text.value !== "") {
    textEntered.value = text.value;
    if (textEntered.value.match(/\d*\.\d*\.\d*\.\d*/)) {
      textEntered.type = "ipAddress";
      valid = "true";
      fetchData(valid);
    } else if (textEntered.value.match(/[a-zA-Z0-9]+[\-\.][a-zA-Z]{2,6}/)) {
      textEntered.type = "domain";
      valid = "true";
      fetchData(valid);
    } else {
      dataError();
    }
  } else {
    valid = "false";
    fetchData(valid);
  }
}

// Error Handling
function dataError() {
  if (textEntered.value == "") {
    record.classList.add("is-active");
    recordValidation.classList.remove("is-active");
  } else {
    record.classList.remove("is-active");
    recordValidation.classList.add("is-active");
  }
}

// API Call Request
function fetchData(valid) {
  if (valid === "true") {
    resource = url + `&${textEntered.type}=${textEntered.value}`;
  } else {
    resource = url;
  }
  displayLoader();
  fetch(`${resource}`, { cache: "no-cache" }).
  then(response => response.json()).
  then(data => {
    // console.log(data);
    hideLoader();
    mapData(data);
  }).
  catch(error => {
    record.classList.remove("is-active");
    recordValidation.classList.add("is-active");
    recordValidation.innerHTML = "No record found";
  });
}

// API Data Mapping
function mapData(data) {
  if (data.isp === "") {
    record.classList.remove("is-active");
    recordValidation.classList.add("is-active");
    recordValidation.innerHTML = "No record found";
  } else {
    record.classList.add("is-active");
  }

  const ip = document.querySelector('[data-value="ip"]');
  ip.innerText = data.ip;

  const location = document.querySelector('[data-value="location"]');
  location.innerText = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;

  const timezone = document.querySelector('[data-value="timezone"]');
  timezone.innerText = `UTC ${data.location.timezone}`;

  const isp = document.querySelector('[data-value="isp"]');
  isp.innerText = data.isp;

  const coordinates = {
    lat: data.location.lat,
    lng: data.location.lng };


  displayMap(coordinates);
}

// Leaflet JS
function displayMap(coordinates) {
  // Get Latest Map Tile
  const tile = L.DomUtil.get("map");
  if (tile !== null) {
    tile._leaflet_id = null;
  }

  const map = L.map("map", {
    zoomControl: true });

  map.setView(coordinates, 14);
  map.zoomControl.setPosition("bottomright");

  // Switch map
  const openStreetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 16,
    attribution:
    '<a href="https://www.openstreetmap.org/about" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>' });



  const mapBox = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3dlZW5lanAiLCJhIjoiY2t0aHB6d3k3MHU0MjMxbXZtMnBjdnRqZSJ9.CAZHA9NWRWytRhDCtDAHGw",
  {
    maxZoom: 16,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "your.mapbox.access.token",
    attribution:
    '<a href="https://www.mapbox.com/about/maps" target="_blank" rel="noopener noreferrer">© Mapbox</a>' });



  mapBox.addTo(map);

  const markerIcon = L.icon({
    iconUrl:
    "https://raw.githubusercontent.com/frontendmentorio/ip-address-tracker/e03e4f0e715ac9bd7226e16a5d3e83b4bea7b242/images/icon-location.svg",
    iconSize: [36, 46] });


  const marker = L.marker(
  [coordinates.lat, coordinates.lng],
  { icon: markerIcon },
  { alt: "Location Marker" }).

  addTo(map).
  bindPopup("Your IP address or domain is located here");

  const mapSwitch = document.getElementById("option");
  mapSwitch.addEventListener("click", function () {
    if (map.hasLayer(openStreetMap)) {
      map.addLayer(mapBox);
      map.removeLayer(openStreetMap);
    } else {
      map.addLayer(openStreetMap);
      map.removeLayer(mapBox);
    }
  });
}

// Loader
const loader = document.querySelector(".loader");

function displayLoader() {
  loader.classList.add("is-active");
  record.classList.remove("is-active");
  setTimeout(event => {
    loader.classList.remove("is-active");
  }, 5000);
}

function hideLoader() {
  loader.classList.remove("is-active");
}