import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs'; 
import resolvers from './schemas/resolvers';

// Adjust the import path as needed

dotenv.config();

import db from './config/connection.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Give routes access to req.cookies
app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use('/graphql', expressMiddleware(server));

app.use(routes);

// if we're in production, serve client/build as static assets and ensure the index.html file is served for the React Router to handle UI views
if (process.env.PORT) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}`);
  });
});