
// IMPORT
import {gql} from "@apollo/client";


// EXPORT
export const ADD_USER = gql`
    mutation ($username: String!, $email: String!, $password: String!){
        addUser(username: $username, email: $email, password: $password){
            token
            user{
                _id
                username
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation ($email: String!, $password: String!){
        login(email: $email, password: $password){
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation ($bookInput: BookInput!){
        saveBook(input: $bookInput){
            bookCount
            savedBooks{
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation ($bookId: String!){
        removeBook(bookId: $bookId){
            bookCount
            savedBooks{
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;