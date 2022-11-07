
const LOCAL_STORAGE_NAME = 'book_search_engine_saved_books';

export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem(LOCAL_STORAGE_NAME)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_NAME);
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem(LOCAL_STORAGE_NAME)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(updatedSavedBookIds));

  return true;
};