
// IMPORT
import {gql} from "@apollo/client";


// EXPORT
export const GET_ME = gql`
    query{
        me{
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