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

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/** When the screen size is small enough,
 *  change the navbar to collapse into a hamburger menu.
 */
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

/** Add the sticky class to the navbar when you reach its scroll position.
 *  Remove "sticky" when you leave the scroll position
 */
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

/** Fetches comment data from servlet. */
function doGet() {
  let numCom = document.getElementById('num-comments').value;
  $("#servlet").empty();
  fetch('/data?numCom='+ numCom)
    .then(response => response.json())
    .then((comments) => {
      const commentBox = document.getElementById('servlet');
      comments.forEach((comment) => {
        commentBox.appendChild(createComment(comment));
      })
    });
}

/** Creates an element that represents a comment. */
function createComment(comment) {
  const taskElement = document.createElement('div');

  const image = document.createElement('img');
  image.src = comment.img;

  const commentBody = document.createElement('p');
  commentBody.innerText = comment.body;

  taskElement.appendChild(image);
  taskElement.appendChild(commentBody);
  return taskElement;
}

/** Delete all comments on the page. */
function doDel() {
  fetch('/delete-comment', {method: 'POST'})
      .then(response => doGet());
}

/** Check if the user is authenticated through the auth servlet. */
function loginCheck() {
  let authCheck = document.getElementById('auth-check');
  let commentSection = document.getElementById('comment-section');
  fetch('auth')
      .then(response => response.json())
      .then((json) => {
        if (json.isAuth && commentSection.classList.contains("hidden")) {
          commentSection.classList.remove("hidden");
        } else {
          commentSection.classList.add("hidden");
        }
        authCheck.innerHTML = json.bodyText;
      });

}

/** Create blobstore url and make the form submit redirect to it. */
function fetchBlobstore() {
  fetch('/blobstore-upload-url')
      .then((response) => response.text())
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('comment-form');
        messageForm.onsubmit = submitUpload(imageUploadUrl);
      });
}

/** Submits comment with optional image upload on attached blobstore URL. */
function submitUpload (url) {
  return function () {
    const form = new FormData(document.getElementById('comment-form'));
    $.ajax({
      url: url,
      type:'POST',
      data: form,
      enctype: 'multipart/form-data',
      processData:false,
      contentType:false,
      cache: false,
      success: function() {
        doGet();
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
    $('#comment-form')[0].reset();
    return false;
  }
}

/** Creates a chart and adds it to the page. */
function drawChart() {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Animal');
  data.addColumn('number', 'Count');
  data.addRows([
    ['Lions', 10],
    ['Tigers', 5],
    ['Bears', 15]
  ]);

  const options = {
    'title': 'Zoo Animals',
    'width':500,
    'height':400
  };

  const chart = new google.visualization.PieChart(
      document.getElementById('chart-container'));
  chart.draw(data, options);
}

/** Initialize Google Map api in stylized dark mode*/
var map;
function initMap() {
  var uluru = {lat: -25.344, lng: 131.036};
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'h.. hewwo?'
  });
  var marker = new google.maps.Marker({position: uluru, map: map, animation: google.maps.Animation.BOUNCE,
                icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'});
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

/** Generate blobstore URL, get the comments, and check for user authentication
 *  when the window loads.
 */
window.onload = function() {
  fetchBlobstore();
  doGet();
  loginCheck();
};

