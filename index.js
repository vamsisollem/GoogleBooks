var url = new URL('https://www.googleapis.com/books/v1/volumes'); // main API
var urlParams = new URLSearchParams(); // Initialization of URL prams
urlParams.set('q', ''); // setting default query
urlParams.set('maxResults', 10); // max results
urlParams.set('startIndex', 0); // start index / page start  index
const reqTime = new Date().getTime();


// function to search 
function search(index = 0) {
    document.getElementById('results').innerHTML = ''; // before result cleaning up previous results
    const queryString = document.getElementById('inputValue').value; //getting search string 
    urlParams.set('q', queryString); //setting search string
    urlParams.set('startIndex', index); // setting start Index
    // console.log(url + '?' + urlParams); 
    //adding url with configs
    // var url = url + '?' + urlParams
    fetch(url + '?' + urlParams) 
        .then(Result => Result.json())
        .then(data => { displayResults(data); })
        .catch(error => console.error('Error:', error));
}
function displayResults(Bookdata) {
    const resultsPerPage = urlParams.get('maxResults'); //results per page
    const totalPages = Bookdata.totalItems / resultsPerPage; // calculating total pages
    let activepage = parseInt(urlParams.get('startIndex')) ?? 0; // active page
    let countOfPages = activepage;
    if(activepage === 0){
       var startIndex = 0;
       countOfPages = 1;
    }
    else if(activepage === 1){
        var startIndex = 0;
    }
    else if(activepage === 2){
        var startIndex = 1;
    }
    else{
        var startIndex = parseInt(urlParams.get('startIndex')) - 3;
    }
    //let startIndex = activepage == 0 ? 0: parseInt(urlParams.get('startIndex')) - 1 ;
    let displayMaxPages = countOfPages + 3 >  totalPages ? totalPages : countOfPages + 3; //displaying max pages based on the calculations    
    const pageContainer = document.getElementById('pagination'); //pagination wrapper/container
    pageContainer.classList.add('buttonStyle');
    pageContainer.innerHTML = ''; //clearing old paginations before displaying new one
    for (let i = startIndex; i <= displayMaxPages; i++) { //for loop for Pagination UI with event listenres
        const pagination = document.createElement('button'); //creating btn element for pagination
        if(i == activepage){
            pagination.classList.add('active');
        }
        pagination.innerHTML = i+1; //Adding btn value
        pagination.setAttribute('index',i); //setting attribute index for btns
        pagination.classList.add('pagination-btn'); // adding class to btn
        pagination.addEventListener('click', (e) => { //adding event listner to btn
            //code for removing any active pagination btn
            var elements = document.getElementsByClassName('pagination-btn'); //targeting all pagination btn 
            for (var i = 0; i < elements.length; i++) { //removing active for all the buttons
                elements[i].classList.remove('active');
            }
            search(e.target.getAttribute('index')); //getting the click paged information
        })
    
        pageContainer.appendChild(pagination); //appending the paginations
    }
    const results = document.getElementById('results'); 
    const numberOfResults = document.createElement('h3');
    numberOfResults.innerHTML = `Number of Results: ${Bookdata.totalItems}`;
    const endTime = new Date().getTime();
    const elapsedTime = endTime - reqTime;
    // Display server response time
    const serverResponseTime = document.createElement('h5');
    serverResponseTime.innerHTML = `Server Response Time: ${elapsedTime} ms`;
    results.appendChild(serverResponseTime);
    const allAuthors = Bookdata.items.flatMap(book => book.volumeInfo.authors || []);
            const commonAuthor = findMostFrequent(allAuthors);
        
            // Display common author
            const commonAuthorElement = document.createElement('h5');
            commonAuthorElement.innerHTML = `Common Author: ${commonAuthor}`;
            results.appendChild(commonAuthorElement);
    //const serverresponse = document.createElement('h5');
    //serverresponse.innerHTML = `Server Response Time: ' + ${elapsedTime} + ms`;
    results.appendChild(numberOfResults);
    const bookItems = Bookdata.items;
    if (Bookdata && Bookdata.totalItems > 0) {
        bookItems.forEach(book => {
            const title = book.volumeInfo.title;
            const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unkown Author';
            const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
            const description = book.volumeInfo.description || 'No description available.';
            const publishDate = book.volumeInfo.publishedDate || 'No Published Date.';
            const bookContainer = document.createElement('div');
            bookContainer.classList.add('bookDisplay');

            const bookThumbnail = document.createElement('img');
            bookThumbnail.src = thumbnail;
            bookThumbnail.alt = thumbnail ? 'Book Cover' : 'No Image';

            const bookTitle = document.createElement('h4');
            bookTitle.innerHTML = title;

            const bookAuthors = document.createElement('h6');
            bookAuthors.innerHTML = authors;

            const publishedDates = document.createElement('h5');
            publishedDates.innerHTML = publishDate;

            const bookDescription = document.createElement('p');
            bookDescription.innerHTML = description;
            bookDescription.style.display = 'none';

            bookThumbnail.addEventListener('click', () => displayDescription(bookDescription));

            
        
            // Extracting common author from all books
            

            bookContainer.appendChild(bookThumbnail);
            bookContainer.appendChild(bookTitle);
            bookContainer.appendChild(bookAuthors);
            bookContainer.appendChild(publishedDates);
            bookContainer.appendChild(bookDescription);
            results.appendChild(bookContainer);

        });

    }
    else {
        const errorContainer = document.createElement('p');
        errorContainer.innerHtml = 'Sorry, we couldn\'t find any books with that title.';
    }
}

function displayDescription(bookDescription) {
    if (bookDescription.style.display === 'none') {
        bookDescription.style.display = 'block';
    }
    else {
        bookDescription.style.display = 'none';
    }
}
function findMostFrequent(arr) {
    if (arr.length === 0) return 'Unknown';
    const counts = {};
    let maxCount = 0;
    let frequentAuthor = arr[0];
    for (const element of arr) {
        counts[element] = (counts[element] || 0) + 1;
        if (counts[element] > maxCount) {
            maxCount = counts[element];
            frequentAuthor = element;
        }
    }
    return frequentAuthor;
}