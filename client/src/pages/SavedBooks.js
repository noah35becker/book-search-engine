
// IMPORTS
import React from 'react';
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

  const [removeBook] = useMutation(REMOVE_BOOK, {
    update: (cache, {data: {removeBook}}) => {
        cache.writeQuery({
          query: GET_ME,
          data: {me: {...removeBook}}
        });
    }
  });


  if (!Auth.loggedIn())
    return <Navigate to='/' />


  const handleRemoveBook = async bookId => {
    try{
      await removeBook({
        variables: {bookId}
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  const bookCount = userData?.me.bookCount || 0;
  const savedBooks = userData?.me.savedBooks || [];

  if (loading)
    return <h2>LOADING...</h2>;

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
                <p className='small'>
                  {book.authors.length === 0 ?
                      'No author information available'
                    :
                      `Author${book.authors.length === 1 ? '' : 's'}: ${book.authors.join(', ')}`
                  }  
                </p>
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