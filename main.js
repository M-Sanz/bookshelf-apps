let listBuku = [];
const RENDER_EVENT = 'render-buku';

document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem("bookList")){
        listBuku = JSON.parse(localStorage.getItem("bookList"))
    }

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        console.log("Di submit");

        let title = document.getElementById("inputBookTitle").value;
        let author = document.getElementById("inputBookTitle").value;
        let year = document.getElementById("inputBookYear").value;
        let isComplete = document.getElementById("inputBookIsComplete").checked;

        let buku = {
            title,
            author,
            year,
            isComplete
        }

        masukkanBukuKeRak(buku);
    })

    document.dispatchEvent(new Event(RENDER_EVENT));
})

function generateId() {
    return +new Date();
}

function masukkanBukuKeRak(buku){
    const generatedID = generateId();
    buku.id = generatedID
    
    console.log(buku);
    listBuku.push(buku);

    localStorage.setItem("bookList", JSON.stringify(listBuku));
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    // clearing list item
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
  
    for (const buku of listBuku) {
      const bookElement = makeBukuElement(buku);
      if (buku.isComplete) {
        completeBookshelfList.append(bookElement);
      } else {
        incompleteBookshelfList.append(bookElement);
      }
    }
  });

function makeBukuElement(buku){
    var articleElement = document.createElement('article');
    articleElement.className = 'book_item';

    var h3Element = document.createElement('h3');
    h3Element.textContent = buku.judulBuku;
    articleElement.appendChild(h3Element);

    var authorParagraph = document.createElement('p');
    authorParagraph.textContent = 'Penulis: ' + buku.author;
    articleElement.appendChild(authorParagraph);

    var yearParagraph = document.createElement('p');
    yearParagraph.textContent = 'Tahun: ' + buku.year;
    articleElement.appendChild(yearParagraph);

    var actionDiv = document.createElement('div');
    actionDiv.className = 'action';

    var greenButton = document.createElement('button');
    greenButton.className = 'green';
    greenButton.textContent = buku.isComplete ? 'Belum selesai di Baca' : "Selesai Dibaca";
    greenButton.addEventListener('click', function(){
        changeBookStatus(buku.id);
    });
    actionDiv.appendChild(greenButton);

    var redButton = document.createElement('button');
    redButton.className = 'red';
    redButton.textContent = 'Hapus buku';
    redButton.addEventListener('click', function(){
        deleteBook(buku.id);
    })
    actionDiv.appendChild(redButton);

    articleElement.appendChild(actionDiv);
    return articleElement;
}

function changeBookStatus(id){
    console.log("Book Status Changed")
    const book = findBookById(id)

    console.log({book})
    if (book == null) return;

    book.isComplete = book.isComplete ? false : true;
    localStorage.setItem("bookList", JSON.stringify(listBuku));
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(bookId){
    console.log("Deleting Book")
    const bookIndex = findBookIndex(bookId);

    if (bookIndex === -1) return;

    console.log(bookIndex)
    
    listBuku.splice(bookIndex, 1);
    localStorage.setItem("bookList", JSON.stringify(listBuku));

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function findBookIndex(bookId){
    for (const index in listBuku) {
        if (listBuku[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function findBookById(bookId) {
    for (const book of listBuku) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
}