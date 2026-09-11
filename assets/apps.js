var content = [
  {
    title: "Welcome",
    date: "06/28/2023",
    content: `
        <strong>Welcome to the Notes App</strong><br><br>
        This is a place to keep stuff, it's a note-taking app, you know the drill.<br><br>
        You can put your text here buddy bud bud!
    `
  },
  {
    title: "Sample Text",
    date: "06/28/2023",
    content: `Here's some sample text`
  }
];


function setNotesContent(index) {
  var notesContent = document.querySelector("#notesContent");
  if (!notesContent) return;

  // Inject current note contents
  notesContent.innerHTML = content[index].content;
  notesContent.dataset.noteIndex = index;

  // Clear previous highlighted notes and assign 'active' class to current selection
  var allItems = document.querySelectorAll(".note-preview-item");
  allItems.forEach(function(item) {
    item.classList.remove("active");
  });
  
  if (allItems[index]) {
    allItems[index].classList.add("active");
  }
}

function addToSidebar(index) {
  var sidebar = document.querySelector("#sidebar");
  var note = content[index];
  if (!sidebar) return;

  var newDiv = document.createElement("div");
  newDiv.className = "note-preview-item";

  newDiv.innerHTML = `
    <p style="margin: 0px; font-weight: bold; font-size: 13px; color: #fff;">
      ${note.title}
    </p>
    <p style="font-size: 10px; margin: 0px; color: #fff; opacity: 0.7;">
      ${note.date}
    </p>`;

  newDiv.addEventListener("click", function() {
    setNotesContent(index);
  });

  sidebar.appendChild(newDiv);
}

for (let i = 0; i < content.length; i++) {
  addToSidebar(i);
}
setNotesContent(0);


var notesContent = document.querySelector("#notesContent");
if (notesContent) {
  notesContent.addEventListener("blur", function() {
    var currentIndex = Number(notesContent.dataset.noteIndex);
    if (!isNaN(currentIndex) && content[currentIndex]) {
      content[currentIndex].content = notesContent.innerHTML;
    }
  });
}


var notesWindow = document.querySelector("#notes");
var notesCloseBtn = document.querySelector("#notesclose");
var notesShortcut = document.querySelector("#notesshortcut");

var welcomeWindow = document.querySelector("#welcome");
var welcomeCloseBtn = document.querySelector("#welcomeclose");
var welcomeOpenText = document.querySelector("#welcomeopen");
var toolbarOpenBtn = document.querySelector("#toolbaropen");

if (notesCloseBtn && notesWindow) {
  notesCloseBtn.addEventListener("click", function() {
    notesWindow.style.display = "none";
  });
}

if (notesShortcut && notesWindow) {
  notesShortcut.addEventListener("click", function() {
    notesWindow.style.display = "flex"; // Restores absolute flex structure layout
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
