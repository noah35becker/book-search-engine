
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
    mutation (
        $bookId: String!,
        $title: Int!,
        $authors: [String]!,
        $description: String!,
        $image: String!,
        $link: String
    ){
        saveBook(
            bookId: $bookId,
            title: $title,
            authors: $authors,
            description: $description,
            image: $image,
            link: $link
        ){
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation ($bookId: String!){
        removeBook(bookId: $bookId){}
    }
`;