// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("notes"));

document.getElementById("welcomeclose").addEventListener("click", function () {
  document.getElementById("welcome").style.display = "none";
});

document.getElementById("toolbaropen").addEventListener("click", function () {
  document.getElementById("welcome").style.display = "flex";
});

document.getElementById("notesclose").addEventListener("click", function () {
  document.getElementById("notes").style.display = "none";
});

document.getElementById("notesicon").addEventListener("click", function () {
  this.classList.add("selected");
  document.getElementById("notes").style.display = "flex";
});

var notesIcon = document.getElementById("notesicon");
var cursorIndicator = document.getElementById("cursorIndicator");
var cursorResetTimer;

notesIcon.addEventListener("mouseenter", function () {
  cursorIndicator.classList.add("visible");
});

notesIcon.addEventListener("mousemove", function (event) {
  cursorIndicator.style.left = event.clientX + "px";
  cursorIndicator.style.top = event.clientY + "px";
});

notesIcon.addEventListener("mouseleave", function () {
  cursorIndicator.classList.remove("visible");
});

notesIcon.addEventListener("click", function () {
  cursorIndicator.classList.add("clicked");
  clearTimeout(cursorResetTimer);
  cursorResetTimer = setTimeout(function () {
    cursorIndicator.classList.remove("clicked");
  }, 140);
});

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var pointerOffsetX = 0;
  var pointerOffsetY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Keep the pointer at the same point inside the window when dragging starts.
    var windowBounds = element.getBoundingClientRect();
    pointerOffsetX = e.clientX - windowBounds.left;
    pointerOffsetY = e.clientY - windowBounds.top;
    element.style.transform = "none";
    element.style.left = windowBounds.left + "px";
    element.style.top = windowBounds.top + "px";
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    var maximumLeft = window.innerWidth - element.offsetWidth;
    var maximumTop = window.innerHeight - element.offsetHeight;
    var nextLeft = e.clientX - pointerOffsetX;
    var nextTop = e.clientY - pointerOffsetY;

    element.style.left = Math.max(0, Math.min(nextLeft, maximumLeft)) + "px";
    element.style.top = Math.max(0, Math.min(nextTop, maximumTop)) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


    function updateTime() {
        var currentTime = new Date().toLocaleString();
        var timeText = document.querySelector("#time");
        timeText.innerHTML = currentTime;
    }
    setInterval(updateTime, 1000);

var selectedIcon = undefined

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined
} 

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element)
    openWindow(window)
  } else {
    selectIcon(element)
  }
}