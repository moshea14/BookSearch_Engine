import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { getUserBooks, saveBook, searchGoogleBooks } from '../utils/API';
import { Book, GoogleAPIBook } from '../interfaces/index.d';
import { useStore } from '../store';

const SearchBooks = () => {
  const {state} = useStore()!;
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    if (!state.loading && state.user) {
      getUserBooks()
        .then((res) => {
          // Store just the googleBookId's from the user's books to the savedBooks array
          setSavedBookIds([
            ...res.data.map((book: Book) => book.googleBookId)
          ]);
        });
    }
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const res = await searchGoogleBooks(searchInput);

      const bookData = res.data.items.map((book: GoogleAPIBook) => ({
        googleBookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (book: Book) => {
    try {
      await saveBook(book);

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, book.googleBookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <section className='d-grid gap-4 book-grid'>
          {searchedBooks.map((book) => {
            return (
              <Card border='dark' key={book.googleBookId}>
                {book.image ? (
                  <Card.Img className='result-image' src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small flex-fill'>Authors: {book.authors}</p>
                  <details className='mb-3'>
                    <summary>Description</summary>
                    <Card.Text className='p-2'>{book.description}</Card.Text>
                  </details>
                  {state.user && (
                    <Button
                      disabled={savedBookIds?.includes(book.googleBookId)}
                      className='btn-block btn-success'
                      onClick={() => handleSaveBook(book)}>
                      {savedBookIds?.includes(book.googleBookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </section>
      </Container>
    </>
  );
};

export default SearchBooks;
