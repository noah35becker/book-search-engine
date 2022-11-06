
// IMPORT
const {gql} = require('apollo-server-express');



// TypeDefs
const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book{
        bookId: String
        title: Int
        authors: [String]
        description: String
        image: String
        link: String
    }

    type Auth{
        token: ID!
        user: User
    }


    input BookInput{
        bookId: String
        title: Int
        authors: [String]
        description: String
        image: String
        link: String
    }


    type Query{
        me: User
    }

    type Mutation{
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;



// EXPORT
module.exports = typeDefs;