document.addEventListener("DOMContentLoaded", () => {
    main()

})

function main() {
    createNewFolder()
    addNote();
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

function showNote(notesSection, textArea) {
  const note = document.createElement("div");

  console.log("hello");
}
