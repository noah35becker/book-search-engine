
// IMPORTS
import React, {useState, useEffect} from 'react';
import {Jumbotron, Container, Col, Form, Button, Card, CardColumns} from 'react-bootstrap';

import Auth from '../utils/auth';
import {saveBookIds, getSavedBookIds} from '../utils/localStorage';

import {searchGoogleBooks} from '../utils/API';

import {useMutation} from '@apollo/client';
  import {SAVE_BOOK} from '../utils/mutations';

import {GET_ME} from '../utils/queries'



// COMPONENT
export default function SearchBooks(){
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK, {
    update: (cache, {data: {saveBook}}) => {
      cache.writeQuery({
        query: GET_ME,
        data: {me: {...saveBook}}
      });
    }
  });

  useEffect(
    () => saveBookIds(savedBookIds)
  , [savedBookIds]);


  const handleFormSubmit = async event => {
    event.preventDefault();

    if (!searchInput)
      return;

    try{
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok)
        throw new Error('Something went wrong with the Google Books API');

      const {items} = await response.json();

      const booksData = items.map(book => ({
          bookId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || ['No author to display'],
          description: book.volumeInfo.description,
          image: book.volumeInfo.imageLinks?.thumbnail || '',
          link: book.volumeInfo.previewLink
      }));

      setSearchedBooks(booksData);
      setSearchInput('');
    }catch (err){
      console.error(err);
    }
  };


  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find(bookData => bookData.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token){
      console.error('No user is logged in right now');
      return false;
    }

    try{
      await saveBook({
        variables: {bookInput: bookToSave}
      });
  
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    }catch (err){
      console.error(err);
    }
  };


  return <>
    <Jumbotron fluid className='text-light bg-dark'>
      <Container>
        <h1>Search for Books!</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs={12} md={8}>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                type='text'
                size='lg'
                placeholder='Search for a book'
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type='submit' variant='success' size='lg'>
                Submit Search
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    </Jumbotron>

    <Container>
      <h2>
        {searchedBooks.length
          ? `Viewing ${searchedBooks.length} results:`
          : 'Search for a book to begin'}
      </h2>
      <CardColumns>
        {searchedBooks.map(book => (
          <Card key={book.bookId} border='dark'>
            {book.image ? (
              <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
            ) : null}
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <p className='small'>Authors: {book.authors}</p>
              <Card.Text>{book.description}</Card.Text>
              {Auth.loggedIn() && (
                <Button
                  disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                  className='btn-block btn-info'
                  onClick={() => handleSaveBook(book.bookId)}>
                  {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                    ? 'This book has already been saved!'
                    : 'Save this book!'}
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </CardColumns>
    </Container>
  </>;
};