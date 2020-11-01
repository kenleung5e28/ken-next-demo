import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { Connection, createConnection } from 'mongoose';
import { schema as typeDefs } from '../../server/schema';
import { resolvers } from '../../server/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

let db: Connection | null = null;

const apolloServer = new ApolloServer({ 
  schema,
  context: async () => {
    if (!db) {
      try {
        db = await createConnection(process.env.MONGO_CONNECT_STRING as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        });
      } catch (e) {
        console.log('Error while connecting with GraphQL context: ', e);
      }
    }
    return { db };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });