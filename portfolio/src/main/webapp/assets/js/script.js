// Remove lines separating navbar and rest of page body
function removeLines() {
  var topline = document.getElementById("nav-separator");
  var botline = document.getElementById("nav-separator-bottom");
  topline.classList.remove("active");
  botline.classList.remove("active");
  topline.classList.add("fade");
  botline.classList.add("fade");
}

// Add lines separating navbar and rest of page body
function addLines() {
  var topline = document.getElementById("nav-separator");
  var botline = document.getElementById("nav-separator-bottom");
  topline.classList.remove("fade");
  botline.classList.remove("fade");
  topline.classList.add("active");
  botline.classList.add("active");  
}

// When the screen size is small enough, change the navbar to collapse into a hamburger menu
function responsiveNav() {
  var navbar = document.getElementById("navbar");
  var navmenu = document.getElementById("navmenu");

  if (!(navbar.classList.contains("responsive"))) {
    navmenu.className = "fa fa-times";
    removeLines();
    navbar.classList.add("responsive");
    navbar.classList.add("colored");
  } else {
    navbar.classList.remove("responsive");
    navmenu.className = "fa fa-bars";
    addLines();
    stickNav();
  }
}

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickNav() {
  // Get the navbar
  var navbar = document.getElementById("navbar");
  // Get the offset position of the navbar
  var sticky = navbar.offsetTop;
  if ((window.pageYOffset > sticky) || (navbar.classList.contains("responsive"))) {
    removeLines();
    navbar.classList.add("colored");
  } else {
    addLines();
    navbar.classList.remove("colored");
  }
}

// When the user scrolls the page, execute myFunction
window.onscroll = function() {stickNav()};