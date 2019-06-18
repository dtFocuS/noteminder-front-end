const FOLDERS_URL = "http://localhost:3000/api/v1/folders"
const NOTES_URL = "http://localhost:3000/api/v1/notes"

document.addEventListener("DOMContentLoaded", () => {
    main()

})

function main() {
    createNewFolder()
    loadFolders();
    addNote();
}

function loadFolders() {
  fetch(FOLDERS_URL)
  .then(resp => resp.json())
  .then(json => displayFolders(json))
}

function displayFolders(folders) {
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
    let newFolder = document.getElementById('add-folder-button')
    const name = document.createElement("input");
    let ul = document.querySelector(".note-folders")
    let li = document.createElement('li')
    name.type = "text";

    newFolder.addEventListener('click', (ev)  => {
      ev.preventDefault()
        ul.appendChild(name)
        name.focus();
        name.value = "New Folder"
        addANewFolder(name)
    })
}

function addANewFolder(name) {



    //li.textContent = "Folder 2"
    //li.setAttribute("href", "#")

}

function addNote() {
  const addButton = document.getElementById("add-note");
  const notesSection = document.getElementById("note-detail");
  const content = document.querySelector("add-note-ul");
  addButton.addEventListener('click', (event) => {
    event.preventDefault()
    content.focus();
    showNote(notesSection, content);
  })
}

function showNote(notesSection, textArea) {
  const note = document.createElement("li");
  const noteDiv = document.createElement('div')

  console.log("hello"); 
}
