import dotenv from 'dotenv';

dotenv.config();

import auth_resolvers from '../routes/api/user_routes';
import user_resolvers from '../routes/api/auth_routes';

const resolvers = {
    Query: {
        ...auth_resolvers.Query,
        ...user_resolvers.Query
},
Mutation: {
    ...auth_resolvers.Mutation,
    ...user_resolvers.Mutation
}
};

export default resolvers;