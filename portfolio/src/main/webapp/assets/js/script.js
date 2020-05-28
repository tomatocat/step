// Fullpage api
new fullpage('#fullpage', {
  // options here
  anchors: ['home', 'software', 'photography', 'contact'],
  menu: '#navbar',
  licenseKey: ''
});

//methods

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
    navbar.classList.add("colored");
  } else {
    navbar.classList.remove("colored");
  }
}

// When the user scrolls the page, execute myFunction
// window.onscroll = function() {stickNav()};