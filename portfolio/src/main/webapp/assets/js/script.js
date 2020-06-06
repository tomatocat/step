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

/** Submits comment without image attached. Currently unused function. */
function submitComment() {
  $.ajax({
    url:'/data',
    type:'POST',
    data:$('#comment-form').serialize(),
    success: function() {
      doGet();
    }
  });
  $('#comment-form')[0].reset();
  return false;
}

/** Generate blobstore URL, get the comments, and check for user authentication
 *  when the window loads.
 */
window.onload = function() {
  fetchBlobstore();
  doGet();
  loginCheck();
};

