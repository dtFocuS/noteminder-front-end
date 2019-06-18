document.addEventListener("DOMContentLoaded", () => {
    main()

})

function main() {
    createNewFolder()
    addNote();
    addReminder()
}

function createNewFolder() {
    let newFolder = document.querySelector(".btn")

    newFolder.addEventListener('click', (ev)  => {
        ev.preventDefault()
        addANewFolder()
    })
}

function addANewFolder() {
    let ul = document.querySelector(".note-folders")
    let li = document.createElement('li')
    li.textContent = "Folder 2"
    li.setAttribute("href", "#")
    ul.appendChild(li)
}

function addNote() {
  const addButton = document.querySelector("#add-note");
  const notesSection = document.getElementById("note-detail");
  const content = document.querySelector("#note-area");
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

  span.addEventListener('click', () =>{
      modal.style.display = "none";
  })
  window.addEventListener('click', (ev) => {
    if (event.target == modal) {
         modal.style.display = "none";
  }
})

}
