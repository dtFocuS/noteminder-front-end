const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"
const REMINDERS_URL = "http://localhost:3000/api/v1/reminders"
let CURRENTNOTE = undefined;
let CURRENTFOLDER = undefined;
let NEWNOTE = false;
let CURRENTTITLE = undefined;
let REMOVEDFOLDER = 0;
let REMINDERID = 0;
let JUSTCREATED = false;
let ALLREMINDERS = undefined;
let PREVIOUSNOTE = undefined;
let PREVIOUSFOLDER = undefined;
let dateN = Date().split(" "); //["Thu", "Jun", "20", "2019", "09:57:00", "GMT-0700", "(Pacific", "Daylight", "Time)"]
let timeN = dateN[4].split(":")[0] + ":" + dateN[4].split(":")[1]; //"09:57"
let currentTime = dateN[1] + " " + dateN[2] + ", " + dateN[3] + " at " + timeN; //Jun 20, 2019 at 09:56
const timeAbove = document.getElementById("date-span");

document.addEventListener("DOMContentLoaded", () => {
  main()
})

function main() {
  createNewFolder();
  loadFolders();
  addNote();
  loadReminders();
  deleteNote();
  deleteFolder();
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
  if (JUSTCREATED) {
    console.log("just created");
    CURRENTFOLDER = folder;
    const noteSection = document.getElementById("note-detail");
    const noteArea = document.getElementById("note-area");
    CURRENTNOTE = undefined;
    timeAbove.textContent = "";
    noteArea.value = "";

    //const ogFolder = document.getElementById("og-folder");
    while (noteSection.lastChild) {
      noteSection.removeChild(noteSection.lastChild);
    }
    JUSTCREATED = false;
  } else {
    CURRENTFOLDER = undefined;
  }
  //folderList.appendChild(listItem);
  //console.log(listItem);
  listItem.addEventListener('click', (event) => {
    // if (PREVIOUSFOLDER === undefined && CURRENTFOLDER !== undefined) {
    //   PREVIOUSFOLDER = CURRENTFOLDER;
    //   const preFolder = folderList.querySelector(`li#folder-${PREVIOUSFOLDER.id}`);
    //   preFolder.style.color = "black";
    // } else {
    //   // const preFolder = folderList.querySelector(`lis#folder-${PREVIOUSFOLDER.id}`);
    //   // preNoteCard.style.color = "white";
    //   // PREVIOUSFOLDER = CURRENTFOLDER;
    // }
    // const curFolder = document.querySelector(`li#folder-${CURRENTFOLDER.id}`);
    // curFolder.style.color = "black";
    removeReminderButton();
    CURRENTFOLDER = folder;
    loadNotes(folder);
  })
  folderList.appendChild(listItem);
}

function deleteFolder() {
  const deleteFolder = document.getElementById("delete-folder");
  deleteFolder.addEventListener('click', (event) => {
    if (CURRENTFOLDER) {
      removeFolder(CURRENTFOLDER);
    }
  })
}

function removeFolder(folder) {
  const currentFolder = document.querySelector(`#folder-${folder.id}`);
  fetch(FOLDERS_URL + "/" + folder.id, {
    method: "DELETE"
  })
  .then(resp => resp.json())
  .then(json => {
    currentFolder.remove();
    afterFolderRemove()
  })
}

function afterFolderRemove() {
  REMOVEDFOLDER ++;
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  CURRENTNOTE = undefined;
  timeAbove.textContent = "";
  noteArea.value = "";

  //const ogFolder = document.getElementById("og-folder");
  while (noteSection.lastChild) {
    noteSection.removeChild(noteSection.lastChild);
  }
}


function loadNotes(folder) {
  fetch(NOTES_URL)
  .then(resp => resp.json())
  .then(json => displayNotes(json, folder))
}

function loadReminders() {
  fetch(REMINDERS_URL)
  .then(resp => resp.json())
  .then(reminders => {
    ALLREMINDERS = reminders;
  })
}


function displayNotes(notes, folder) {
  const noteSection = document.getElementById("note-detail");
  const noteArea = document.getElementById("note-area");
  //const ogFolder = document.getElementById("og-folder");
  let count = 0;
  let firstNote = true;
  while (noteSection.lastChild) {
    noteSection.removeChild(noteSection.lastChild);
  }

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

  //const setReminderButton = document.querySelector('.add-reminder');
  const noteArea = document.getElementById("note-area");
  const noteCard = document.createElement("div");
  const noteTitle = document.createElement("p");
  const timeSpan = document.createElement("span");
  const folderName = document.createElement("p");
  //setReminderButton.id = note.id
  folderName.id = "folder-note-" + note.id;
  timeSpan.className = "time-created";
  noteCard.id = "note-" + note.id;
  noteTitle.textContent = note.content.substring(0, 27);
  ALLREMINDERS.forEach(reminder => {
    if (reminder.note_id === note.id) {
      noteTitle.style.color = "red";
    }
  })
  timeSpan.textContent = note.time;
  timeAbove.textContent = CURRENTNOTE.time;
  folderName.textContent = folder.name;
  noteCard.appendChild(noteTitle);
  noteCard.appendChild(timeSpan);
  noteCard.appendChild(folderName);
  noteSection.appendChild(noteCard);
  noteCard.addEventListener('click', (event) => {
    // const div3 = document.querySelector(".div3");
    // if (div3.querySelector("button")) {
    //   div3.querySelector("button").remove();
    // }

    CURRENTNOTE = note;
    // if (PREVIOUSNOTE === undefined) {
    //   PREVIOUSNOTE = CURRENTNOTE;
    //   const preNoteCard = noteSection.querySelector(`div#note-${PREVIOUSNOTE.id}`);
    //   preNoteCard.style.background = "#EDD1B0";
    // } else {
    //   const preNoteCard = noteSection.querySelector(`div#note-${PREVIOUSNOTE.id}`);
    //   preNoteCard.style.background = "lightgoldenrodyellow";
    //   PREVIOUSNOTE = CURRENTNOTE;
    // }
    // const curNoteCard = noteSection.querySelector(`div#note-${CURRENTNOTE.id}`);
    // curNoteCard.style.background = "#EDD1B0";
    NEWNOTE = false;
    timeAbove.textContent = CURRENTNOTE.time;
    fetchSingleNote(note, noteArea);
  })

  UpdateNoteContent(folder, note);
  folderName.style.borderBottom = "1px solid #D1D0D0"
}

function deleteNote() {
  const deleteNoteButton = document.getElementById("remove-note");
  deleteNoteButton.addEventListener('click', (event) => {
      if (CURRENTNOTE) {
        const noteSection = document.getElementById("note-detail");
        //console.log(CURRENTNOTE);

        removeNote(CURRENTNOTE, noteSection);

      }
  })
}

function setCNoteAfterRemove(noteSection) {
  //console.log(CURRENTNOTE);
  const noteArea = document.getElementById("note-area");
  const notes = noteSection.querySelectorAll('div');
  if (notes.length > 0) {
    //console.log(notes[0].id.split("-")[1]);
    //console.log(notes);
    fetchSingleNote({id: notes[0].id.split("-")[1]}, noteArea)

    //timeAbove.textContent = CURRENTNOTE.time;
    //noteArea.value = CURRENTNOTE.content;
  } else {
    CURRENTNOTE = undefined;
    timeAbove.textContent = "";
    noteArea.value = "";
  }

}

function removeNote(note, noteSection) {
  const noteCard = document.querySelector(`div#note-${note.id}`);
  fetch(NOTES_URL + `/${note.id}`, {
    method: 'DELETE'
  })
  .then(resp => resp.json())
  .then(json => {
    noteCard.remove()
    setCNoteAfterRemove(noteSection)
  })
  .catch(err => console.log(err))
}

function fetchSingleNote(note, noteArea) {
  fetch(NOTES_URL + "/" + note.id)
  .then(resp => resp.json())
  .then(json => {
    CURRENTNOTE = json
    noteArea.value = json.content
    timeAbove.textContent = CURRENTNOTE.time;
    removeReminderButton();
  })
}

function UpdateNoteContent(folder, note) {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  noteArea.addEventListener('input', () => {
    let curTime = timeN;
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
    getFolderCount();
    nameInput.focus();
    nameInput.value = "New Folder " + (FOLDERCOUNT + 1);
    //addANewFolder('blur', nameInput, ul);
    addANewFolder('keypress', nameInput, ul);
  })
}

function getFolderCount() {
  fetch(FOLDERS_URL)
  .then(resp => resp.json())
  .then(json => {
    FOLDERCOUNT = json.length;
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
        getFolderCount();
        //ul.appendChild(li);
        //CURRENTNOTE = undefined;
      }
    }
  })
}

function createFolder(ul, li) {
  JUSTCREATED = true;
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
  const content = document.getElementById("note-area");
  addButton.addEventListener('click', (event) => {
    //let div = document.querySelector('.div3')
    //let addReminderButton = document.createElement('button');
    removeReminderButton();
    CURRENTNOTE = undefined;
    NEWNOTE = true;
    console.log(CURRENTFOLDER);
    //addButton.style.pointerEvents = "none";
    buildNote();
  })
}

function removeReminderButton() {
  const reminderButton = document.getElementById('add-reminder-button');
  if (reminderButton) {
    reminderButton.remove();
  }
}

function buildNote() {
  const noteArea = document.getElementById("note-area");
  const noteSection = document.getElementById("note-detail");
  const newCard = document.createElement("div");
  const newContent = document.createElement("p");
  const timeLabel = document.createElement("span");
  const folderName = document.createElement("p");

  CURRENTTITLE = newContent;
  folderName.className = "og-folder";
  console.log(currentTime);
  timeLabel.className = "time-created";
  //newCard.id = "note-" + note.id;
  newContent.textContent = "New Note";
  timeLabel.textContent = timeN;
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
  folderName.style.borderBottom = "1px solid #D1D0D0";
}

function postNote(noteArea, noteSection, newCard) {

  //console.log(CURRENTNOTE);
  noteArea.addEventListener('input', (event) => {
    //const curNoteCard = document.querySelector(`div#note-${CURRENTNOTE.id}`);
    if (NEWNOTE === true) {
      const noteTitle = newCard.querySelector("p");
      if (noteArea.value.length < 27) {
        CURRENTTITLE.textContent = noteArea.value;
      }
      timeAbove.textContent = currentTime;
    }
  })

  noteArea.addEventListener('blur', function a(event) {
    if (NEWNOTE === true) {
      let div = document.querySelector('.div3')
      let folderId = null;
      if (noteArea.value !== "" && noteArea.value != null) {
        if (CURRENTFOLDER) {
          folderId = CURRENTFOLDER.id;
        }
        //removing add reminder button without when creating note without adding reminder
        // if (div.querySelector("button")) {
        //   div.querySelector("button").remove();
        // }
        createNote(event, noteArea, folderId, newCard);
      } else {
        noteSection.children[0].remove();
        NEWNOTE = false;
        //console.log(CURRENTNOTE);
        //setCNoteAfterRemove(noteSection);
      }
    }
    noteArea.removeEventListener('blur', a);
  })
}

function createNote(event, noteArea, folderId, newCard) {

  let div = document.querySelector('.div3')
  let addReminderButton = document.createElement('button');
  addReminderButton.id = "add-reminder-button";
  //addReminderButton.id = newCard.id
  addReminderButton.className = "add-reminder"
  addReminderButton.textContent = "Set Reminder"


//   div.appendChild(addReminderButton)
//   addReminderButton.style.position = 'absolute';
//   addReminderButton.style.top = '0';
//   addReminderButton.style.left = '60%';

//   addReminderButton.addEventListener('click', () => {
//     showModal()
//     startTime()
//     hoursMenu()
//     minutesMenu()
//   })


  //div.appendChild(addReminderButton)
  addReminderButton.style.display = 'block';
  div.insertBefore(addReminderButton, div.childNodes[0]);
  //addReminderButton.style.position = 'absolute';
  addReminderButton.style.margin = 'auto';
  //addReminderButton.style.right = '40%';

  // addReminderButton.addEventListener('click', () => {
  //   showModal()
  //   startTime()
  //   hoursMenu()
  //   minutesMenu()
  // })

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
    newCard.id = "note-" + note.id
    REMINDERID = note.id;
    newCard.addEventListener('click', (event) => {
      //console.log(newCard.id);
      fetchSingleNote(note, noteArea)
    })
    console.log(REMINDERID);
    addReminderButton.addEventListener('click', () => {
      showModal(addReminderButton, newCard);
      startTime()
      hoursMenu()
      minutesMenu()
    })
  })

}

// function openModal() {
//   const addReminderBtn = document.querySelector(".add-reminder")
//   addReminderBtn.addEventListener('click', () => {
//     showModal()
//     startTime()
//     hoursMenu()
//     minutesMenu()
//   })
// }

function showModal(addReminderButton, newCard) {
  const modal = document.getElementById("myModal");
  const span = document.getElementById("modal-span");
  let form = document.getElementById('modal-form')
  let clearButton = document.getElementById('clear-modal')

  modal.style.display = "block";
  console.log(modal);
  clearButton.addEventListener('click', (ev) => {
    clearModal(addReminderButton);
  })

  span.addEventListener('click', () => {
    modal.style.display = "none";
  })

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let selectedDate = ev.target.elements.dateSelection.value;
    console.log(selectedDate)
    let selectedHour = ev.target.elements.alarmHrs.value;
    let selectedMinute = ev.target.elements.alarmMins.value;
    let selectedPriority = ev.target.elements.priority.value;
    addReminder(selectedDate, selectedHour, selectedMinute, selectedPriority, newCard);
    clearModal(addReminderButton);
    Myinterval = setInterval(setReminder, 1000, ev, newCard);
  })
}

// function clearModal() {
    //Myinterval = setInterval(setReminder, 1000, ev)
//     let selectedDate = ev.target.elements.dateSelection.value;
//     console.log(selectedDate)
//     let selectedHour = ev.target.elements.alarmHrs.value;
//     let selectedMinute = ev.target.elements.alarmMins.value;
//     let selectedPriority = ev.target.elements.priority.value;
//     addReminder(selectedDate, selectedHour, selectedMinute, selectedPriority, newCard);
//     clearModal(addReminderButton);
//     Myinterval = setInterval(setReminder, 1000, ev, newCard);


//   document.getElementById('dateSelection').disabled = false;
//   document.getElementById('dateSelection').value = "";
//   document.getElementById('priority').disabled = false;
//   document.getElementById('priority').value = "";
//   document.getElementById('alarmHrs').disabled = false;
//   document.getElementById('alarmHrs').value = "";
//   document.getElementById('alarmMins').disabled = false;
//   document.getElementById('alarmMins').value = "";

//   let audio = document.getElementById('audio');
//   audio.pause();


function clearModal(addReminderButton) {
  //let audio = document.getElementById('audio');
  const modal = document.getElementById("myModal");
  //clearInterval(Myinterval);
  modal.style.display = "none";
  addReminderButton.remove();
  // document.getElementById('dateSelection').disabled = false;
  // document.getElementById('priority').disabled = false;
  // document.getElementById('alarmHrs').disabled = false;
  // document.getElementById('alarmMins').disabled = false;
  //audio.pause();
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

function setReminder(ev, newCard) {
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
  //addReminder(selectedDate, selectedHour, selectedMinute, selectedPriority);
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

  if(actualTime == alarmTime && currentActualDate == selectedDate) {
    audio.play();
    // window.alert("ALARM!!!!!!!");
    // clearInterval(Myinterval);
    //clearModal();
    endReminder(newCard);

    //modal.style.display = "none";
  }
}

function endReminder(newCard) {
  let audio = document.getElementById('audio');
  //clearInterval(Myinterval);
  const cardPs = newCard.querySelectorAll("p");
  window.alert("Reminder: " + cardPs[0].textContent + " - " + cardPs[1].textContent);
  clearInterval(Myinterval);
  audio.pause();
}


function addReminder(selectedDate, selectedHour, selectedMinute, selectedPriority, newCard) {
  console.log(CURRENTNOTE);
  console.log("in reminder");
  fetch(REMINDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({reminder: {date: selectedDate, time: selectedHour + ":" + selectedMinute, priority: selectedPriority, note_id: REMINDERID}})
  })
  .then(resp => resp.json())
  .then(json => showReminder(newCard))
}

function showReminder(newCard) {
  const cardTitle = newCard.querySelector("p");
  cardTitle.style.color = "red";

}

function addZero(i) {
  if (i < 10) { i = "0" + i };
  return i;
}
