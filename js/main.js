/* global Requests */

const libraryID = 156;
const req = new Requests(libraryID);

let bookTemplate = $('#templates .bookRow');
let bookTable = $('#bookTableBody');
let borrowerOptionTemplate = $('#templates > .borrowerOption');
let borrowerTemplate = $('#templates .borrowerRow');
let borrowerTable = $('#borrowerTableBody');



async function getLibraryName() {
  let library = await req.getLibrary();
  $('.jumbotron h1').text(library.name);
}

getLibraryName();

////////////////////////////////////////////////////////////////////////////////
////////////////////   THIS GETS ALL THE DATA ON THE PAGE   ////////////////////
////////////////////////////////////////////////////////////////////////////////

async function getData() {

  let borrowers = await req.getBorrowers();
  borrowers.forEach((borrowers) => {
    addBorrowerToPage(borrowers);
  });

  let books = await req.getBooks();
  books.forEach((book) => {
    addBookToPage(book);
  });
}

getData();


////////////////////////////////////////////////////////////////////////////////
////////////////////         THIS IS FOR THE BOOKS          ////////////////////
////////////////////////////////////////////////////////////////////////////////


function addBookToPage(book) {
  let newBook =  bookTemplate.clone(true, true);
  newBook.attr('data-id', book.id);
  newBook.find('.book-img').attr('src', book.image_url);
  newBook.find('.bookTitle').text(book.title);
  newBook.find('.bookDesc').text(book.description);
  if (book.borrower_id) {
    newBook.find('.bookBorrower').val(book.borrower_id);
  }
  bookTable.append(newBook);
}




async function deleteBook(bookRow) {
  let bookID = bookRow.attr('data-id');
  await req.deleteBook({id: bookID});
  bookRow.fadeOut(700, () => bookRow.remove());
}

function deleteAllBooks() {
  $('.bookRow').each(function () {
    deleteBook($(this));
  });
}

$('.deleteBook').click(async function() {
  let bookRow = $(this).parents('.bookRow');
  deleteBook(bookRow);
});

$('#addBookForm').on('submit', async function(event) {
  event.preventDefault();

  // Grabs book data and creates a new book object
  let newBook = {
    title: event.target.addBookTitle.value,
    description: event.target.addBookDescription.value,
    image_url: event.target.addBookImageUrl.value,
  };

  // Create the book on the server
  newBook = await req.createBook(newBook);

  // Add Book to our table
  addBookToPage(newBook);

  // Resets the input field
  event.target.reset();

  // closes out the Modal
  $('#addBookModal').modal('hide');

});

// async function testAPI(){
//   let book1 = await req.createBook({
//     title: "Maul Lockdown",
//     description: "Starwars Book about my favorite Sith ",
//     image_url: "https://vignette.wikia.nocookie.net/starwars/images/d/dc/MaulLockdownCover.jpg/revision/latest?cb=20130427064638"
//   });
//
//   console.log("After Book Creation");
//   console.log(book1);
//
//   console.log("Now we'll request all the books from the library");
//
//   let books = await req.getBooks();
//
//   console.log("After the get all the books request comes back");
//   console.log(books);
// }


////////////////////////////////////////////////////////////////////////////////
////////////////////         THIS IS FOR THE BORROWERS      ////////////////////
////////////////////////////////////////////////////////////////////////////////



function addBorrowerToPage(borrower) {
  // Adds Borrowers to the table
  let newBorrower =  borrowerTemplate.clone(true, true);
  newBorrower.attr('data-id', borrower.id);
  newBorrower.find('.borrowerFirstName').text(borrower.firstname);
  newBorrower.find('.borrowerLastName').text(borrower.lastname);
  borrowerTable.append(newBorrower);

  // Now we are populating the select dropdown with our borrowers
  let newOption = borrowerOptionTemplate.clone(true, true);
  newOption.attr('value', borrower.id);
  newOption.text(`${borrower.firstname} ${borrower.lastname}`);
  $('.bookBorrower').append(newOption);
}





async function deleteBorrower(borrowerRow) {
  let borrowerID = borrowerRow.attr('data-id');
  await req.deleteBorrower({id: borrowerID});
  borrowerRow.fadeOut(700, () => borrowerRow.remove());
}

function deleteAllBorrowers() {
  $('.borrowerRow').each(function () {
    deleteBorrower($(this));
  });
}

$('.deleteBorrower').click(async function() {
  let borrowerRow = $(this).parents('.borrowerRow');
  deleteBorrower(borrowerRow);
});

$('#addBorrowerForm').on('submit', async function(event) {
  event.preventDefault();

  // Grabs borrower data and creates a new borrower object
  let newBorrower = {
    firstname: event.target.addBorrowerFirstName.value,
    lastname: event.target.addBorrowerLastName.value,
  };

  // Create the borrower on the server
  newBorrower = await req.createBorrower(newBorrower);

  // Add Borrower to our table
  addBorrowerToPage(newBorrower);

  // Resets the input field
  event.target.reset();

  // closes out the Modal
  $('#addBorrowerModal').modal('hide');

});

$('.bookBorrower').on('change', async function (event) {
  let borrowerID = event.target.value;
  let bookID = $(event.target).parents('.bookRow').attr('data-id');
  let response = await req.updateBook({id: bookID, borrower_id: borrowerID});
  console.log(response);
});
