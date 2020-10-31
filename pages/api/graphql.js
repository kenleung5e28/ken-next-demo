import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient } from 'mongodb';
import { Decimal } from 'decimal.js';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const typeDefs = gql`
  scalar Decimal

  type Product {
    id: ID!
    name: String!
    type: String!
    stock: Int!
    price: Decimal!
  }

  type Query {
    products: [Product]!
  }
`;

const resolvers = {
  Decimal: new GraphQLScalarType({
    name: 'Decimal',
    description: 'Decimal custom data type',
    serialize(value) {
      return value.toString();
    },
    parseValue(value) {
      return new Decimal(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.STRING) {
        return new Decimal(ast.value);
      }
      return null;
    },
  }),
  Query: {
    async products(parent, args, context, info) {
      const results = await context.db
        .collection('products')
        .find().toArray();
      return results.map(({ id, name, type, stock, price }) => ({
        id,
        name,
        type,
        stock,
        price: new Decimal(price.toString()),
      }));
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