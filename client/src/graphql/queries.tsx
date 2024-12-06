import { gql } from "@apollo/client"

// Auth

export const GET_USER = gql`
    query GetUser {
        getUser {
            user {
                _id
                username
            }
        }
    }
`;


// User
export const GET_USER_BOOKS = gql`
    query GetUserBooks{
        getUserBooks {
            googleBookId
            authors
            image
        }
    }
`;
