import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient } from 'mongodb';

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    type: String!
    stock: Int!
    price: Float!
  }

  type Query {
    products: [Product]!
  }
`;

const resolvers = {
  Query: {
    products(parent, args, context, info) {
      return context.db
      .collection('products')
      .find().toArray()
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

let db = null;

const apolloServer = new ApolloServer({ 
  schema,
  context: async () => {
    if (!db) {
      try {
        const client = new MongoClient(process.env.MONGO_CONNECT_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        if (!client.isConnected()) {
          await client.connect();
        }
        db = client.db(process.env.MONGO_NAME);
      } catch (e) {
        console.log('Error while connecting with GraphQL context', e);
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