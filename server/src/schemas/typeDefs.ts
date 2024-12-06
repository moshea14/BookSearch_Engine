const gql = String.raw;

const typeDefs = gql`
    type Book {
        googleBookId: ID
        authors: [String]
        image: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Response {
        user: User
        message: String
    }

    input BookInput {
        googleBookId: ID
        authors: [String]
        image: String
    }

    type Query {
        getUser: Response
        getUserBooks: [Book]
    }

    type Mutation {
        registerUser(username: String, email: String, password, String): Response
        login(email: String, password: String): Response
        saveBooks(book: BookInput): Response
        deleteBook(googleBookId: ID): Response
    }
`;

export default typeDefs;