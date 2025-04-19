
// Books JSON data
let books = [
  {
    "id": 1,
    "title": "Book 1",
    "author": "Author 1",
    "year": 2001,
    "genre": "Fiction"
  },
  {
    "id": 2,
    "title": "Book 2",
    "author": "Author 2",
    "year": 2012,
    "genre": "Science Fiction"
  },
  {
    "id": 3,
    "title": "Book 3",
    "author": "Author 3",
    "year": 1999,
    "genre": "Detective"
  }
]

// Function to display books in the table
const displayBooks = (books) => {
  // Selecting the table body
  const tableBody = document.querySelector('#book-table tbody');
  if (tableBody) {
    tableBody.innerHTML = ''; // Clear existing rows
    // Loop through each book and create a row with control buttons
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.year}</td>
        <td>${book.genre}</td>
        <td>
          <button class="update-btn" data-id="${book.id}">Update</button> 
          <button class="delete-btn" data-id="${book.id}">Delete</button>
        </td>
      `;
      // Add the row to the table
      tableBody.appendChild(row);
    });
  }
}

// Function to refresh the book list and re-attach event listeners
const refresh = () => {
  displayBooks(books)
  btnListeners()
}

// Function to validate the year input
const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year > 0 && year <= currentYear;
}

// Function to create a form for adding or updating books
const createForm = (initialData = {}) => {
  // Selecting the form container
  const formContainer = document.querySelector('.form-container');
  formContainer.innerHTML = ''; // Clear existing form
  // Create a new form element
  const form = document.createElement('form');
  // Setting the form inputs with initial data if available
  form.innerHTML = `
    <input type="text" name="title" placeholder="Title" value="${initialData.title || ''}" required>
    <input type="text" name="author" placeholder="Author" value="${initialData.author || ''}" required>
    <input type="number" name="year" placeholder="Year" value="${initialData.year || ''}" required>
    <input type="text" name="genre" placeholder="Genre" value="${initialData.genre || ''}" required>
    <button type="submit">Submit</button>
    <button type="button">Cancel</button>
    <span class="error-text"></span>
  `;
  formContainer.appendChild(form);
  // Error text element to display validation messages
  const errorText = form.querySelector('.error-text');
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    errorText.innerHTML = ''; // Clear previous error messages
    // Getting the data from inputs
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const year = parseInt(data.year, 10);
    // Validating the year input
    if (!validateYear(year)) {
      errorText.innerHTML = 'Please enter a valid year.'
      return;
    }
    // If record exists, update the record
    if (initialData.id) {
      books = books.map(book => book.id === initialData.id ?  {...data, id: initialData.id}: book)
    } else { // Else, create new record
      const newBook = { id: Date.now(), ...data };
      books.push(newBook);
    }
    formContainer.innerHTML = ''; // Clear the form after submission
    refresh()
  })

  // Cancel btn for removing the form
  const cancelBtn = form.querySelector('button[type="button"]');
  cancelBtn.addEventListener('click', () => {
    formContainer.innerHTML = ''; // Clear the form on cancel
  })
}

// Function for creating button listeners
const btnListeners = () => {
  const updateButtons = document.querySelectorAll('.update-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  // Listen to "Update" button click
  updateButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Get the record id
      const bookId = e.target.dataset.id;
      // Get the record based on the id
      const book = books.find(book => book.id == bookId);
      // Create an update form with the current record's data
      createForm(book);
    });
  });

  // Listen to "Delete" button click
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Get the record id
      const bookId = e.target.dataset.id;
      // Delete the record from data
      books = books.filter(book => book.id != bookId);
      // Rerender the table
      refresh()
    });
  });
}

// Init function for initializing the app
const init = () => {
  // Display the available records
  displayBooks(books)
  // Create btn listeners
  btnListeners()

  // Select and listen to "Add book" btn
  const addButton = document.querySelector('#add-book');
  addButton.addEventListener('click', () => {
    // Create form for adding record
    createForm()
  })
}

init()

