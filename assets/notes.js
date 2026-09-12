var content = [
  {
    title: "Welcome",
    date: "09/12/2026",
    content: `
        <strong>Welcome to the Notes App</strong><br><br>
        This is a place to keep stuff, it's a note-taking app, you know the drill.<br><br>
        You can put your text here buddy bud bud!
    `
  },
  {
    title: "Alana",
    date: "08/31/2026",
    content: `Alana was my dog, she was a husky mixed with something else, we never figured out what she was mixed it, but whatever it was it made her small.
    She was very beautiful, sadly, due to health issues, we had to put her down on August 31st, 2026.<br><br> She will forever live in my heart, may she rest in peace"`
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
