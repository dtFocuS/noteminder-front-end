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
  listItem.addEventListener('click', (event) => {
    loadNotes(folder);
  })
  folderList.appendChild(listItem);
}

function loadNotes(folder) {
  fetch(NOTES_URL)
  .then(resp => resp.json())
  .then(json => displayNotes(json, folder))
}

function displayNotes(notes, folder) {
  const noteSection = document.getElementById("note-detail");
  while (noteSection.lastChild) {
    noteSection.removeChild(noteSection.lastChild);
  }
  notes.forEach(note => {
    if (note.folder_id === folder.id) {
      displayNote(note, noteSection, folder);
    }
  })
}

function displayNote(note, noteSection, folder) {
  //console.log(note);
  const noteCard = document.createElement("div");
  const noteTitle = document.createElement("p");
  const time = document.createElement("span");
  const folderName = document.createElement("p");
  time.className = "time-created";
  noteCard.id = "note-" + note.id;
  noteTitle.textContent = note.content;
  time.textContent = note.created_at;
  folderName.textContent = folder.name;
  noteCard.appendChild(noteTitle);
  noteCard.appendChild(time);
  noteCard.appendChild(folderName);
  noteSection.appendChild(noteCard);
  noteCard.addEventListener('click', (event) => {
    displayNoteContent(note, noteTitle);
  })
}

function displayNoteContent(note, noteTitle) {
  const noteArea = document.getElementById("note-area");
  noteArea.value = note.content;
  noteArea.focus();
  noteArea.addEventListener('input', () => {
    if (noteArea.value.length < 27) {
      noteTitle.textContent = noteArea.value;
    }
    noteArea.addEventListener('blur', (event) => {
      
      updateNote(event, noteArea, note);
    })
  })

}

function updateNote(event, noteArea, note) {
  fetch(NOTES_URL + `/${note.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: {content: noteArea.value}})
  })

}

function newNote(json) {

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
        createFolder(ul, li);
        //ul.appendChild(li);
      }
    }
  })
}

function createFolder(ul, li) {
  fetch(FOLDERS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({folder: {name: li.textContent, user_id: 1}})
  })
  .then(resp => resp.json())
  .then(json => displayFolder(json))
}

function addNote() {
  const addButton = document.getElementById("add-note");
  const notesSection = document.getElementById("note-detail");
  const content = document.getElementById("note-area");
  // const content = document.querySelector("add-note-ul");
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
    console.log("hello");
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
