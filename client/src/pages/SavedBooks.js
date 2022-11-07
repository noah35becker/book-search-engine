
// IMPORTS
import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';

import {Jumbotron, Container, CardColumns, Card, Button} from 'react-bootstrap';

import Auth from '../utils/auth';
import {removeBookId} from '../utils/localStorage';

import {useQuery} from '@apollo/client';
  import {GET_ME} from '../utils/queries';
import {useMutation} from '@apollo/client';
  import {REMOVE_BOOK} from '../utils/mutations';



// COMPONENT  
export default function SavedBooks(){
  const {loading, data: userData} = useQuery(GET_ME);

  const [removeBook] = useMutation(REMOVE_BOOK);

  let [bookCount, setBookCount] = useState(userData?.me.bookCount);
  let [savedBooks, setSavedBooks] = useState(userData?.me.savedBooks);

  console.log(bookCount);


  if (!Auth.loggedIn())
    return <Navigate to='/' />


  const handleRemoveBook = async bookId => {
    try{
      const {data: updatedUserData} = await removeBook({
        variables: {bookId}
      });

      removeBookId(bookId);

      setBookCount(updatedUserData.removeBook.bookCount);
      setSavedBooks(updatedUserData.removeBook.savedBooks);
    } catch (err) {
      console.error(err);
    }
  };


  if (loading)
    return <h2>LOADING...</h2>;
  else{
    bookCount = userData?.me.bookCount;
    savedBooks = userData?.me.savedBooks;
  }


  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {bookCount
            ? `Viewing ${bookCount} saved book${bookCount === 1 ? '' : 's'}:`
            : 'You have no saved books!'
          }
        </h2>
        <CardColumns>
          {savedBooks.map(book => (
            <Card key={book.bookId} border='dark'>
              {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className='btn-block btn-danger' onClick={event => handleRemoveBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </Container>
    </>
  );
};