import "./styles.css";
import bgImage from "./images/restaurant-background1.jpg";
import arrowSvg from "./icons/arrow-right.svg"
import { renderMenu } from "./menu.js";

const header = document.querySelector("header");
const slideShowContainer = document.querySelector(".js-slideshow-container");
const overlay = slideShowContainer.querySelector(".js-overlay");
const buttons = document.querySelectorAll("nav button");
const content = document.getElementById("content");

// set background via JS so we fully own it (not CSS)
slideShowContainer.style.backgroundImage = `url(${bgImage})`;
slideShowContainer.style.backgroundSize = "cover";
slideShowContainer.style.backgroundPosition = "center";

// screen templates 

function showHome() {
  // restore background
  slideShowContainer.style.visibility = "visible";
  overlay.style.background = "rgba(0, 0, 0, 0.45)";
  header.classList.remove("utils-header");

  content.innerHTML = `
    <div class="home-screen">
      <div class="title">
        <h1>Where Every Bite Tells a Story</h1>
        <div class="description">Hand-crafted recipes passed down through generations.</div>
      </div>
      <button id="grab-menu-btn">
        Grab the menu
        <img src="${arrowSvg}">
      </button>
    </div>
  `;

  document.getElementById("grab-menu-btn").addEventListener("click", () => {
    activateButton(document.getElementById("menu"));
    showMenu();
  });
}

function showMenu() {
  slideShowContainer.style.visibility = "hidden";
  overlay.style.background = "transparent";
  header.classList.add("utils-header");
  renderMenu();
}

function showAbout() {
  slideShowContainer.style.visibility = "hidden";
  overlay.style.background = "transparent";
  header.classList.add("utils-header");

  content.innerHTML = `
    <div class="about-screen">
      <h2>About Us</h2>
      <p>Coming soon.</p>
    </div>
  `;
}

// nav wiring

function activateButton(activeBtn) {
  buttons.forEach(btn => btn.classList.remove("active-mode"));
  activeBtn.classList.add("active-mode");
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    activateButton(button);
    const id = button.id;
    if (id === "home")  showHome();
    if (id === "menu")  showMenu();
    if (id === "about") showAbout();
  });
});

// initial render
showHome();