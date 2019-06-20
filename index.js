const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"
let CURRENTNOTE = undefined;
let CURRENTFOLDER = undefined;
let NEWNOTE = false;
let date = Date().split(" "); //["Thu", "Jun", "20", "2019", "09:57:00", "GMT-0700", "(Pacific", "Daylight", "Time)"]
let time = date[4].split(":")[0] + ":" + date[4].split(":")[1]; //"09:57"
let currentTime = date[1] + " " + date[2] + ", " + date[3] + " at " + time; //Jun 20, 2019 at 09:56
const timeAbove = document.getElementById("date-span");

document.addEventListener("DOMContentLoaded", () => {
  main()

})

function main() {
  createNewFolder();
  loadFolders();
  addNote();
  openModal();
  deleteNote();
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
  let count = 0;
  let firstNote = true;
  while (noteSection.lastChild) {
    noteSection.removeChild(noteSection.lastChild);
  }
  //console.log(notes.length);

  for (let i = notes.length - 1; i >= 0; i--) {
    if (notes[i].folder_id === folder.id) {
      if (firstNote) {
        CURRENTNOTE = notes[i];
        firstNote = false;
      }
      count++;
      displayNote(notes[i], noteSection, folder);
    }
  }
  // notes.forEach(note => {
  //   if (note.folder_id === folder.id) {
  //     if (firstNote) {
  //       CURRENTNOTE = note;
  //       firstNote = false;
  //     }
  //     count++;
  //     displayNote(note, noteSection, folder);
  //   }
  // })
  if (count === 0) {
    CURRENTNOTE = undefined;
    noteArea.value = "";
    timeAbove.textContent = "";
  } else {
    noteArea.value = CURRENTNOTE.content;
  }

}

function displayNote(note, noteSection, folder) {
  //console.log(note);
  const noteArea = document.getElementById("note-area");
  const noteCard = document.createElement("div");
  const noteTitle = document.createElement("p");
  const timeSpan = document.createElement("span");
  const folderName = document.createElement("p");

  folderName.id = "folder-note-" + note.id;
  timeSpan.className = "time-created";
  noteCard.id = "note-" + note.id;
  noteTitle.textContent = note.content.substring(0, 27);
  timeSpan.textContent = note.time;
  timeAbove.textContent = CURRENTNOTE.time;
  folderName.textContent = folder.name;
  noteCard.appendChild(noteTitle);
  noteCard.appendChild(timeSpan);
  noteCard.appendChild(folderName);
  noteSection.appendChild(noteCard);
  noteCard.addEventListener('click', (event) => {
    CURRENTNOTE = note;
    NEWNOTE = false;
    timeAbove.textContent = CURRENTNOTE.time;
    fetchSingleNote(note, noteArea);
  })

  UpdateNoteContent(folder, note);
}

function deleteNote() {
  const deleteNoteButton = document.getElementById("remove-note");

  // if (CURRENTNOTE !== undefined) {
  //   deleteNoteButton.addEventListener('click', (event) => {
  //     console.log("hey");
  //     removeNote(CURRENTNOTE)
  //   })
  // }
  deleteNoteButton.addEventListener('click', (event) => {
      if (CURRENTNOTE) {
        const noteSection = document.getElementById("note-detail");

        const noteArea = document.getElementById("note-area");

        removeNote(CURRENTNOTE, noteSection);
        console.log(CURRENTNOTE);
        const notes = noteSection.querySelectorAll('div');
        if (notes.length > 0) {
          //console.log(notes[0].id.split("-")[1]);
          console.log(notes);
          fetchSingleNote({id: notes[0].id.split("-")[1]}, noteArea)

          timeAbove.textContent = CURRENTNOTE.time;
          //noteArea.value = CURRENTNOTE.content;
        } else {
          CURRENTNOTE = undefined;
          timeAbove.textContent = "";
          noteArea.value = "";
        }
      }

  })

}

function removeNote(note, noteSection) {
  const noteCard = document.querySelector(`div#note-${note.id}`);
  fetch(NOTES_URL + `/${note.id}`, {
    method: 'DELETE'
  })
  .then(resp => resp.json())
  .then(json => {
    noteCard.remove()
  })
}

function fetchSingleNote(note, noteArea) {
  fetch(NOTES_URL + "/" + note.id)
  .then(resp => resp.json())
  .then(json => {
    CURRENTNOTE = json
    noteArea.value = json.content

  })

}

function UpdateNoteContent(folder, note) {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  noteArea.addEventListener('input', () => {
    let curTime = time;
    if (NEWNOTE === false) {

      const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
      const noteTitle = curNoteCard.querySelector("p");
      const noteTime = curNoteCard.querySelector("span");
      if (noteArea.value.length < 27) {
        noteTitle.textContent = noteArea.value;
        //noteTime.textContent = curTime;
      }
      if (noteArea.value != note.content) {
        noteTime.textContent = curTime;
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
    body: JSON.stringify({note: {content: noteArea.value, time: currentTime}})
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
  addButton.addEventListener('click', (event) => {

    CURRENTNOTE = undefined;
    NEWNOTE = true;
    console.log(NEWNOTE);
    //addButton.style.pointerEvents = "none";
    buildNote();
  })
}

function buildNote() {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  const newCard = document.createElement("div");
  const newContent = document.createElement("p");
  const timeLabel = document.createElement("span");
  const folderName = document.createElement("p");
  folderName.className = "og-folder";
  console.log(currentTime);
  timeLabel.className = "time-created";
  //newCard.id = "note-" + note.id;
  newContent.textContent = "New Note";
  timeLabel.textContent = time;
  //`${new Date().getHours()}:${new Date().getMinutes()}`;
  if (CURRENTFOLDER) {
    folderName.textContent = `${CURRENTFOLDER.name}`;
  } else {
    folderName.textContent = "OG Folder";
  }
  //folderName.textContent = `${CURRENTNOTE.folder.name}`;
  newCard.appendChild(newContent);
  newCard.appendChild(timeLabel);
  newCard.appendChild(folderName);
  if (noteSection.lastChild) {
    noteSection.insertBefore(newCard, noteSection.childNodes[0]);
  } else {
    noteSection.appendChild(newCard);
  }
  noteArea.value = "";
  noteArea.focus();
  postNote(noteArea, noteSection, newCard);

}

function postNote(noteArea, noteSection, newCard) {

  //console.log(CURRENTNOTE);
  noteArea.addEventListener('input', (event) => {
    //const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
    if (NEWNOTE === true) {
      const noteTitle = newCard.querySelector("p");
      if (noteArea.value.length < 27) {
        noteTitle.textContent = noteArea.value;
      }
    }
  })

  noteArea.addEventListener('blur', function a(event) {
    if (NEWNOTE === true) {
      let folderId = null;
      if (noteArea.value !== "" && noteArea.value != null) {
        if (CURRENTFOLDER) {
          folderId = CURRENTFOLDER.id;
        }
        createNote(event, noteArea, folderId, newCard);
      } else {
        noteSection.children[0].remove();
        NEWNOTE = false;
        console.log(NEWNOTE);
      }
    }
    noteArea.removeEventListener('blur', a);
  })
}

function createNote(event, noteArea, folderId, newCard) {
  fetch(NOTES_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({note: {content: noteArea.value, time: currentTime, folder_id: folderId}})
  })
  .then(resp => resp.json())
  .then(note => {
    CURRENTNOTE = note
    newCard.addEventListener('click', (event) => {

      newCard.id = "note-" + note.id
      //console.log(newCard.id);
      fetchSingleNote(note, noteArea)
    })
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
