const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"



document.addEventListener("DOMContentLoaded", () => {
  main()

})

function main() {
  createNewFolder()
  loadFolders();
  addNote();
  addReminder()
}

function loadFolders() {
  fetch(FOLDERS_URL)
    .then(resp => resp.json())
    .then(json => displayFolders(json))
}

function displayFolders(folders) {
  FOLDERCOUNT = folders.length;
  folders.forEach(folder => displayFolder(folder))
}

function displayFolder(folder) {
  const folderList = document.querySelector(".note-folders");
  const listItem = document.createElement("li");
  listItem.id = "folder-" + folder.id;
  listItem.textContent = folder.name;
  folderList.appendChild(listItem);
}

function createNewFolder() {
  let newFolder = document.getElementById("add-folder-button")
  let ul = document.querySelector(".note-folders")
  let li = document.createElement('li')


  newFolder.addEventListener('click', (ev) => {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    ul.appendChild(nameInput);
    nameInput.focus();
    nameInput.value = "New Folder " + (FOLDERCOUNT + 1);
    //addANewFolder('blur', nameInput, ul);
    addANewFolder('keypress', nameInput, ul);
  })
}

function addANewFolder(action, nameInput, ul) {
  let currentName = nameInput.value;
  nameInput.addEventListener(action, (event) => {
    console.log(event.which)
    if (event.which === 13 || event.which === 0) {
      if (nameInput.value === "") {
        //alert("Folder names can't be blank.");
        //if (event.which === 13) {
        nameInput.focus();
        nameInput.value = currentName;
      } else {
        const li = document.createElement("li");
        li.textContent = nameInput.value;
        nameInput.remove();
        ul.appendChild(li);
      }
    }
  })

}

function addNote() {
  const addButton = document.getElementById("add-note");
  const notesSection = document.getElementById("note-detail");
  const content = document.querySelector("add-note-ul");
  addButton.addEventListener('click', (event) => {
    content.focus();
    showNote(notesSection, content);
  })
}

function showNote(notesSection, content) {
  // const note = document.createElement("div");
  const noteStart = document.createElement("span")
  notesSection.appendChild(noteStart)
  content.addEventListener('keyup', () => {
    noteStart.textContent = content.value
  })

  console.log("hello");
}

function addReminder() {
  const addReminderBtn = document.getElementById("add-reminder")
  addReminderBtn.addEventListener('click', () => {
    setReminder()
  })
}

function setReminder() {
  const modal = document.getElementById("myModal");
  const span = document.getElementById("modal-span");

  modal.style.display = "block";

  span.addEventListener('click', () => {
    modal.style.display = "none";
  })
  window.addEventListener('click', (ev) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  })
}
