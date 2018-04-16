/* global Requests */

const libraryID = 156;
const req = new Requests(libraryID);

async function getLibraryName() {
  let library = await req.getLibrary();
  $('.jumbotron h1').text(library.name);
}

let bookTemplate = $('#templates .bookRow');
let bookTable = $('#bookTableBody');

function addBookToPage(book) {
  let newBook =  bookTemplate.clone(true, true);
  newBook.attr('data-id', book.id);
  newBook.find('.bookImg').attr('src', book.image_url);
  newBook.find('.bookTitle').text(book.title);
  newBook.find('.bookDesc').text(book.description);
  bookTable.append(newBook);
}

getLibraryName();

async function getBooks() {
  let books = await req.getBooks();
  books.forEach((book) => {
    addBookToPage(book);
  });
}

async function testAPI(){
  let book1 = await req.createBook({
    title: "Maul Lockdown",
    description: "Starwars Book about my favorite Sith ",
    image_url: "https://vignette.wikia.nocookie.net/starwars/images/d/dc/MaulLockdownCover.jpg/revision/latest?cb=20130427064638"
  });

  console.log("After Book Creation");
  console.log(book1);

  console.log("Now we'll request all the books from the library");

  let books = await req.getBooks();

  console.log("After the get all the books request comes back");
  console.log(books);
}
