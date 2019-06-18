document.addEventListener("DOMContentLoaded", () => {
    main()
})

function main() {
    createNewFolder()
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
  addButton.addEventListener('click', (event) => {
    showNote(notesSection);
  })
}

function showNote(notesSection) {
  const note = document.createElement("div");
  
}
