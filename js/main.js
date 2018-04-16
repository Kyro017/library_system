/* global Requests */

const libraryID = 156;
const req = new Requests(libraryID);

async function getLibraryName() {
  let library = await req.getLibrary();
  $('.jumbotron h1').text(library.name);
}

getLibraryName();

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
