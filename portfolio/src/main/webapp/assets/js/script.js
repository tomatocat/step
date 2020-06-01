// Fullpage api
let fp = new fullpage('#fullpage', {
  // options here
  anchors: ['home', 'software', 'photography', 'contact'],
  menu: '#navbar',
  responsiveWidth: 640,
  scrollOverflow: true,
  afterRender: function() {
    initPhotoSwipeFromDOM('.my-gallery');
  },
  onLeave: function(origin, destination, direction) {
    if (origin.index === 2 && typeof window.pswp != "undefined") {
      window.pswp.close();
    }
  },
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

window.onload = function () { fetch('/data').then(response => response.text()).then((quote) => {
  document.getElementById('servlet').innerText = quote;}) };

// When the user scrolls the page, execute myFunction
// window.onscroll = function() {stickNav()};
