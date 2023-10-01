// Books is main div holding all of the books
const books = document.querySelector(".books");
// Add book button
const addBook = document.querySelector(".add-book");
// Add/edit book modal popup window
const modal = document.querySelector("#modal");
// Xbutton to close modal
const span = document.querySelector(".close");

// Event closes modal if user clicks off of it
window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
});

// XButton clicked-close modal
span.addEventListener("click", () => {
    modal.style.display="none";
});

// Button opens modal and sets modal title/button
addBook.addEventListener("click", () => {
    modal.style.display = "block";
    document.querySelector(".form-title").textContent = "Add Book";
    document.querySelector(".form-add-button").textContent = "Add";
});

// Requirement //the constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    // Create id on it, rounds down (integer) random number 0-999,999
    this.id = Math.floor(Math.random() * 1000000);
}

// Requirement; push adds new items to end of array
function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
    saveAndRenderBooks();
}

const addBookForm = document.querySelector(".add-book-form");

addBookForm.addEventListener("submit", (e) => {
    // If event isn't explicitly handled, default action should not be taken
    e.preventDefault();
    // Grab form attributes (inputs) and convert into object
    const data = new FormData(e.target);
    // Temp object
    let newBook = {};
    // Grab name and value of the value pair, destructure into the following:
    for (let [name, value] of data) {
        if(name === "book-read") {
            newBook["book-read"] = true;
         }  else {
            newBook[name] = value || "";
        }
    }
    if (!newBook["book-read"]) {
        newBook["book-read"] = false;
    }
    if (document.querySelector(".form-title").textContent === "Edit Book") {
      let id = e.target.id;
      // If editing book-set id and filter to where we have that id, grab 1st element
      let editBook = myLibrary.filter((book) => book.id == id)[0];
      editBook.title = newBook["book-title"];
      editBook.author = newBook["book-author"];
      editBook.pages = newBook["book-pages"];
      editBook.read = newBook["book-read"];
      saveAndRenderBooks();
    } else {
      addBookToLibrary (
        newBook["book-title"],
        newBook["book-author"],
        newBook["book-pages"],
        newBook["book-read"]
      );
    }
    addBookForm.reset();
    modal.style.display = "none";
  });
  
// Array of the books
let myLibrary = [];

// Link deleted book to local storage in key value pairs
// JSON parse converts JSON object in text format to JS object
// Key=library:(saving):myLibrary and stingifying it
function addLocalStorage() {
    myLibrary = JSON.parse(localStorage.getItem("library")) || [];
    saveAndRenderBooks();
}

// Create html elements, text content and classes
function createBookElement (el, content, className) {
    const element = document.createElement(el, content, className);
    element.textContent = content;
    element.setAttribute("class", className);
    return element;
}

// Create an input w/event listener if a book is read
function createReadElement(bookItem, book) {
    let read = document.createElement("div");
    // Assign value to html attributes
    read.setAttribute("class", "book-read");
    // Add new child element at end of parent element
    read.appendChild(createBookElement("h1", "Read?", "book-read-title"));
    let input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("click", (e) => {
        if (e.target.checked) {
            bookItem.setAttribute("class", "projects project book read-checked");
            book.read = true;
            saveAndRenderBooks();
        } else {
            bookItem.setAttribute("class", "projects project book read-unchecked");
            book.read = false;
            saveAndRenderBooks();
          }
        });
    if (book.read) {
        input.checked = true;
        bookItem.setAttribute("class", "project book read-checked");
    }
    read.appendChild(input);
    return read;
}

function fillOutEditForm(book) {
    modal.style.display = "block";
    document.querySelector(".form-title").textContent = "Edit Book";
    document.querySelector(".form-add-button").textContent = "Edit";
    document.querySelector(".add-book-form").setAttribute("id", book.id);
    document.querySelector("#book-title").value = book.title || "";
    document.querySelector("#book-author").value = book.author || "";
    document.querySelector("#book-pages").value = book.pages || "";
    document.querySelector("#book-read").checked = book.read; //will always be T  or F
}

// Icon create edit - pencil
function createEditIcon(book) {
    const editIcon =  document.createElement("img");
    editIcon.src = "../img/pencil.png";
    editIcon.setAttribute("class", "edit-icon");
    editIcon.addEventListener("click", () => {
        fillOutEditForm(book);
    });
    return editIcon;    
}

// Create other icons nonactive
function createIcons() {
    const div = createBookElement("div", "", "icons");
    const iconOne = document.createElement("img");
    iconOne.src = "../img/star.png";
    const iconTwo = document.createElement("img");
    iconTwo.src = "../img/eye.png";
    const iconThree = document.createElement("img");
    iconThree.src = "../img/branch.png";
    div.appendChild(iconOne);
    div.appendChild(iconTwo);
    div.appendChild(iconThree);
    return div;
}

// Delete book in 'Your Books'
function deleteBook(index) {
    // Starts and index and remove from 1 (index 1) from myLibrary
    myLibrary.splice(index, 1);
    saveAndRenderBooks();
}

// Create book content on the book dom projects project book
function createBookItem(book, index) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("id", index);
    bookItem.setAttribute("key", index);
    bookItem.setAttribute("class", "projects project book");
    bookItem.appendChild(
        createBookElement("h1", `Title: ${book.title}`, "book-title")
        );
    bookItem.appendChild(
        createBookElement("h1", `Author: ${book.author}`, "book-author")
        );
    bookItem.appendChild(
        createBookElement("h1", `Pages: ${book.pages}`, "book-pages")
        );
        // Have we read 
        bookItem.appendChild(createReadElement(bookItem, book));
        bookItem.appendChild(createBookElement("button", "X", "delete"));
        // Icons
        bookItem.appendChild(createIcons());
        bookItem.appendChild(createEditIcon(book));
        // Delete book in 'Your Books'
        bookItem.querySelector(".delete").addEventListener("click", () => {
            deleteBook(index)
        })
        // Just inside element before first child
        books.insertAdjacentElement("afterbegin", bookItem);
}

// Render books on all books to show
function renderBooks() {
    books.textContent = ""; // Clear page when render books instead of having many repeats
    // Map array-create book array onto myLibrary
    myLibrary.map((book, index) => {
        createBookItem(book, index);
    });
}

// Render books on page load
function saveAndRenderBooks() {
    // Conver JS value to JSON string
    localStorage.setItem("library", JSON.stringify(myLibrary));
    renderBooks();
}

addLocalStorage();