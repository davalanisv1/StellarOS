var welcomeWindow = document.querySelector("#welcome");
var welcomeCloseBtn = document.querySelector("#welcomeclose");
var welcomeOpenText = document.querySelector("#welcomeopen");
var toolbarOpenBtn = document.querySelector("#toolbaropen");


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

if (welcomeCloseBtn && welcomeWindow) {
  welcomeCloseBtn.addEventListener("click", function() {
    welcomeWindow.style.display = "none";
  });
}

function openWelcomeScreen() {
  if (welcomeWindow) {
    welcomeWindow.style.display = "flex";
  }
}

if (welcomeOpenText) welcomeOpenText.addEventListener("click", openWelcomeScreen);
if (toolbarOpenBtn) toolbarOpenBtn.addEventListener("click", openWelcomeScreen);

document.querySelectorAll(".window").forEach(function(windowElement) {
  var expandButton = windowElement.querySelector(".expandbutton");
  if (!expandButton) return;

  expandButton.addEventListener("click", function() {
    var isExpanded = windowElement.classList.toggle("window-expanded");
    expandButton.setAttribute("aria-label", (isExpanded ? "Restore " : "Expand ") + windowElement.id + " window");
    expandButton.setAttribute("title", isExpanded ? "Restore window" : "Expand window");
  });
});

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;

    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = moveWindow;
  }

  function moveWindow(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

window.dragElement = dragElement;

document.querySelectorAll(".window").forEach(function(windowElement) {
  dragElement(windowElement);
});
