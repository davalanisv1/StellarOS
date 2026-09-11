function updateSystemClock() {
  var timeDisplay = document.querySelector("#time");
  if (!timeDisplay) return;

  var now = new Date();
  
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');

  timeDisplay.innerHTML = `<b>${hours}:${minutes}:${seconds}</b>`;
}

updateSystemClock();
setInterval(updateSystemClock, 1000);


var cursorCircle = document.querySelector("#cursorIndicator");

if (cursorCircle) {
  window.addEventListener("mousemove", function(e) {
    
    if (!cursorCircle.classList.contains("visible")) {
      cursorCircle.classList.add("visible");
    }
    cursorCircle.style.left = e.clientX + "px";
    cursorCircle.style.top = e.clientY + "px";

    var isClickable = e.target.closest([
      'button',
      'a',
      'input',
      '[contenteditable="true"]',
      '.windowheader',
      '.closebutton',
      '.note-preview-item',
      '#notesshortcut',
      '#welcomeopen',
      '#toolbaropen',
      '#time'
    ].join(','));

    if (isClickable) {
      cursorCircle.classList.add("hovering");
    } else {
      cursorCircle.classList.remove("hovering");
    }
  });

  document.addEventListener("mouseleave", function() {
    cursorCircle.className = ""; 
  });

  window.addEventListener("mousedown", function() {
    cursorCircle.classList.add("clicked");
  });

  window.addEventListener("mouseup", function() {
    cursorCircle.classList.remove("clicked");
  });
}
