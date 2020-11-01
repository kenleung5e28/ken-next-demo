import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { Connection, createConnection } from 'mongoose';
import { Decimal } from 'decimal.js';
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import productModel, { Product } from '../../models/product';

type Resolvers {
  Decimal: GraphQLScalarType,
  Query: {
    getProducts: (parent: {}, args: {}, context: { db: Connection }, info: GraphQLResolveInfo) => Promise<Product[]>,
  },
  Mutation: {
    addGenericProduct: (parent: {}, args: Product, context: { db: Connection }, info: GraphQLResolveInfo) => Promise<Product>,
  },
}

const typeDefs = gql`
  scalar Decimal

  type Product {
    productId: ID!
    name: String!
    type: String!
    stock: Int!
    price: Decimal!
  }

  type Query {
    getProducts: [Product]!
  }

  type Mutation {
    addGenericProduct(productId: ID!, name: String!, stock: Int!, price: Decimal!): Product!
  }
`;

const resolvers: Resolvers = {
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
    async getProducts(_parent, _args, { db }, _info): Promise<Product[]> {
      const products = productModel(db);
      const allProducts = await products.find().exec();
      return allProducts;
    },
  },
  Mutation: {
    async addGenericProduct(_parent, { productId, name, stock, price }, { db }, _info): Promise<Product> {
      const products = productModel(db);
      const newProduct = await products.create({ productId, name, type: 'generic', stock, price });
      return newProduct;
    },
  },
};

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