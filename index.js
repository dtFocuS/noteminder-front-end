const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"
let CURRENTNOTE = undefined;


document.addEventListener("DOMContentLoaded", () => {
  main()

})

function main() {
  createNewFolder();
  loadFolders();
  addNote();
  openModal();
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
  const noteArea = document.getElementById("note-area");
  let firstNote = true;
  while (noteSection.lastChild) {
    noteSection.removeChild(noteSection.lastChild);
  }
  notes.forEach(note => {
    if (note.folder_id === folder.id) {
      if (firstNote) {
        CURRENTNOTE = note;
        firstNote = false;
      }
      displayNote(note, noteSection, folder);
    }
  })
  //child = noteSection.children[0].id.split("-")[1];
  //console.log(CURRENTNOTE);
  noteArea.value = CURRENTNOTE.content;
}

function displayNote(note, noteSection, folder) {
  //console.log(note);
  const noteArea = document.getElementById("note-area");
  const noteCard = document.createElement("div");
  const noteTitle = document.createElement("p");
  const time = document.createElement("span");
  const folderName = document.createElement("p");
  time.className = "time-created";
  noteCard.id = "note-" + note.id;
  noteTitle.textContent = note.content.substring(0, 27);
  time.textContent = note.created_at;
  folderName.textContent = folder.name;
  noteCard.appendChild(noteTitle);
  noteCard.appendChild(time);
  noteCard.appendChild(folderName);
  noteSection.appendChild(noteCard);
  noteCard.addEventListener('click', (event) => {
    CURRENTNOTE = note;
    console.log(CURRENTNOTE);
    noteArea.value = CURRENTNOTE.content;
    //displayNoteContent(note, noteTitle);
  })
  UpdateNoteContent(folder);
}

function UpdateNoteContent(folder) {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  let temp = "";
  //console.log(noteTitle);
  //noteArea.value = note.content;
  //noteArea.focus();
  noteArea.addEventListener('input', () => {
    //console.log(CURRENTNOTE);
    const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
    const noteTitle = curNoteCard.querySelector("p");
    if (noteArea.value.length < 27) {
      noteTitle.textContent = noteArea.value;
    }
  })

  noteArea.addEventListener('blur', (event) => {
    updateNote(event, noteArea, CURRENTNOTE, folder);
  })
  //CURRENTNOTE = undefined;
  //loadNotes(folder);
}

function updateNote(event, noteArea, note, folder) {
  fetch(NOTES_URL + `/${note.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: {content: noteArea.value}})
  })
  //.then(resp => resp.json())
  //.then(json => loadNotes(folder))


}

function newNote(json) {
  const addNote = document.getElementById("add-note");
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

function openModal() {
  const addReminderBtn = document.getElementById("add-reminder")
  addReminderBtn.addEventListener('click', () => {
    showModal()
    startTime()
    hoursMenu()
    minutesMenu()
  })
}

function showModal() {
  const modal = document.getElementById("myModal");
  const span = document.getElementById("modal-span");
  let form = document.getElementById('modal-form')

  modal.style.display = "block";

  span.addEventListener('click', () => {
    modal.style.display = "none";
  })
  window.addEventListener('click', (ev) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  })

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    setReminder(ev);
    // buildAudio()
  })
}

function startTime() {
  let today = new Date();
  let hour = today.getHours();
  let minute = today.getMinutes();
  let time = checkZero(hour) + ":" + checkZero(minute)
  document.getElementById("current_time").innerHTML = time;

  let t = setTimeout(startTime, 500)
}

function checkZero(i) {
  if (i < 10) {
    i = "0" + i
  }
  return i;
}

function hoursMenu(hour) {
  let select = document.getElementById('alarmHrs');
  const hours = 23;

  for (let i = 0; i <= hours; i++) {
    select.options[select.options.length] = new Option(i < 10 ? i : i, i);
  }
}

function minutesMenu(minute) {
  let select = document.getElementById('alarmMins');
  const mins = 60;

  for ( let i = 0; i < mins; i++) {
    select.options[select.options.length] = new Option(i < 10 ?"0" + i : i, i);
  }
}

// function buildAudio() {
//   let priority = document.getElementById('priority')
//   let myAudio = document.createElement

//   myAudio.src = "https://www.freespecialeffects.co.uk/pages/various.html";
//   myAudio.id = "myAudio"
//   priority.appendChild(myAudio)
// }

function setReminder(ev) {
  console.log(ev)

  let date = document.getElementById("dateSelection");
  let hour = document.getElementById("alarmHrs");
  let minute = document.getElementById("alarmMins");

  let selectedDate = ev.target.elements.dateSelection.value;
  let selectedHour = ev.target.elements.alarmHrs.value;
  let selectedMinute = ev.target.elements.alarmMins.value;
  let selectedPriority = ev.target.elements.priority.value;

  let alarmTime = selectedHour + ":" + addZero(selectedMinute);
  console.log(alarmTime)

  // document.getElementById('alarmHrs').disabled = true;
  // document.getElementById('alarmMins').disabled = true;
  // span.disabled = true;
}

function addZero(i) {
  if (i < 10) { i = "0" + i };
  return i;
} 