const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"
let CURRENTNOTE = undefined;
let CURRENTFOLDER = undefined;
let NEWNOTE = false;


document.addEventListener("DOMContentLoaded", () => {
  main()
  setInterval(interval(), 1000)
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
    CURRENTFOLDER = folder;
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
  console.log(CURRENTNOTE);
  if (notes.length === 0) {
    CURRENTNOTE = undefined;
    noteArea.placeholder = "";
  } else {
    noteArea.value = CURRENTNOTE.content;
  }

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
    // console.log(CURRENTNOTE);
    // noteArea.value = CURRENTNOTE.content;
    fetchSingleNote(note, noteArea);
    //displayNoteContent(note, noteTitle);
  })
  UpdateNoteContent(folder);
}

function fetchSingleNote(note, noteArea) {
  fetch(NOTES_URL + "/" + note.id)
  .then(resp => resp.json())
  .then(json => {
    noteArea.value = json.content;
  })

}

function UpdateNoteContent(folder) {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  //console.log(noteTitle);
  //noteArea.value = note.content;
  //noteArea.focus();

  noteArea.addEventListener('input', () => {
    //console.log(CURRENTNOTE);
    if (NEWNOTE === false) {
      const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
      const noteTitle = curNoteCard.querySelector("p");
      if (noteArea.value.length < 27) {
        noteTitle.textContent = noteArea.value;
      }
    }

  })

  noteArea.addEventListener('blur', (event) => {
    if (NEWNOTE === false) {
      updateNote(event, noteArea, CURRENTNOTE, folder);
    }

  })



}

function updateNote(event, noteArea, note, folder) {
  fetch(NOTES_URL + `/${note.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: {content: noteArea.value}})
  })
  .then(resp => resp.json())
  .then(json => {})


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
        //CURRENTNOTE = undefined;
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
  //const notesSection = document.getElementById("note-detail");
  const content = document.getElementById("note-area");
  // const content = document.querySelector("add-note-ul");
  addButton.addEventListener('click', () => {
    // let folderId = null;
    // if (CURRENTNOTE) {
    //   folderId = CURRENTNOTE.folder_id;
    // }
    CURRENTNOTE = undefined;
    NEWNOTE = true;
    buildNote();
  })
}

function buildNote() {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  const newCard = document.createElement("div");
  const newContent = document.createElement("p");
  const time = document.createElement("span");
  const folderName = document.createElement("p");
  time.className = "time-created";
  //newCard.id = "note-" + note.id;
  newContent.textContent = "New Note";
  time.textContent = `${new Date().getHours()}:${new Date().getMinutes()}`;
  if (CURRENTFOLDER) {
    folderName.textContent = `${CURRENTFOLDER.name}`;
  } else {
    folderName.textContent = "OG Folder";
  }
  //folderName.textContent = `${CURRENTNOTE.folder.name}`;
  newCard.appendChild(newContent);
  newCard.appendChild(time);
  newCard.appendChild(folderName);
  if (noteSection.lastChild) {
    noteSection.insertBefore(newCard, noteSection.childNodes[0]);
  } else {
    noteSection.appendChild(newCard);
  }
  noteArea.value = "";
  noteArea.focus();
  postNote(noteArea, newCard);

}

function postNote(noteArea, newCard) {

  console.log(CURRENTNOTE);
  noteArea.addEventListener('input', () => {
    //const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
    if (NEWNOTE === true) {
      const noteTitle = newCard.querySelector("p");
      if (noteArea.value.length < 27) {
        noteTitle.textContent = noteArea.value;
      }
    }

  })

  noteArea.addEventListener('blur', (event) => {
    if (NEWNOTE === true) {
      let folderId = null;
      if (noteArea.value !== "" && noteArea.value != null) {
        if (CURRENTFOLDER) {
          folderId = CURRENTFOLDER.id;
        }
        createNote(event, noteArea, folderId);
      } else {
        newCard.remove();
        NEWNOTE = false;
      }
    }

  })
}

function createNote(event, noteArea, folderId) {
  fetch(NOTES_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: {content: noteArea.value, folder_id: folderId}})
  })
  .then(resp => resp.json())
  .then(json => {
    NEWNOTE = false;
  })
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
  let clearButton = document.getElementById('clear-modal')

  modal.style.display = "block";

  clearButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    clearModal();
  })

  span.addEventListener('click', () => {
    modal.style.display = "none";
  })

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    Myinterval = setInterval(setReminder, 1000, ev)
  })
}

function clearModal() {
  let audio = document.getElementById('audio');

  clearInterval(Myinterval);

  document.getElementById('dateSelection').disabled = false;
  document.getElementById('priority').disabled = false;
  document.getElementById('alarmHrs').disabled = false;
  document.getElementById('alarmMins').disabled = false;
  audio.pause();
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

function setReminder(ev) {
  console.log(ev)

  const modal = document.getElementById("myModal");

  let date = document.getElementById("dateSelection");
  let hour = document.getElementById("alarmHrs");
  let minute = document.getElementById("alarmMins");

  let selectedDate = ev.target.elements.dateSelection.value;
  console.log(selectedDate)
  let selectedHour = ev.target.elements.alarmHrs.value;
  let selectedMinute = ev.target.elements.alarmMins.value;
  let selectedPriority = ev.target.elements.priority.value;

  let alarmTime = selectedHour + ":" + addZero(selectedMinute);
  console.log(alarmTime)

  document.getElementById('alarmHrs').disabled = true;
  document.getElementById('alarmMins').disabled = true;
  document.getElementById('priority').disabled = true;
  document.getElementById('dateSelection').disabled = true;

  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  let currentDay = currentDate.getDate();

  let currentActualDate = currentYear + "-" + "0" + (currentMonth + 1) + "-" + currentDay
  console.log(currentActualDate)

  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();

  let actualTime = currentHour + ":" + addZero(currentMinute);
  console.log(actualTime)

  let audio = document.getElementById('audio');

  if(actualTime === alarmTime && currentActualDate === selectedDate) {
    audio.play();
    window.alert("ALARM!!!!!!!");
    clearInterval(Myinterval);
    clearModal();
    modal.style.display = "none";
  }
}

function addZero(i) {
  if (i < 10) { i = "0" + i };
  return i;
} 