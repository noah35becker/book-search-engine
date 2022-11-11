
// IMPORTS
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {localStorageTokenName} from './utils/auth';

import Navbar from './components/Navbar';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';


// MIDDLEWARE
const httpLink = createHttpLink({uri: '/graphql'});  // Only the development server will prefix all relative paths with the `proxy` value in package.json; for the production server, normal relative paths will work fine

const authLink = setContext((_, {headers}) => { 
    const token = localStorage.getItem(localStorageTokenName);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});


// APP
export default function App(){
  return (
    <ApolloProvider client={client}>
      <Router>
          <Navbar />
          
          <Routes>
            <Route path='/' element={<SearchBooks />} />
            <Route path='/saved' element={<SavedBooks />} />
            <Route path='*' render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
      </Router>
    </ApolloProvider>
  );
}