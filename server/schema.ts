import { gql } from 'apollo-server-micro';

export const schema = gql`
  scalar Decimal

  type Product {
    productId: ID!
    name: String!
    type: String!
    stock: Int!
    price: Decimal!
  }

  type Book {
    productId: ID!
    name: String!
    type: String!
    authors: [String!]!
    publisher: String!
    language: String!
    stock: Int!
    price: Decimal!
  }

  type Query {
    getProducts: [Product]!
    getBooks: [Book]!
    findByProductId(productId: ID!): Product
  }

  type Mutation {
    addGenericProduct(productId: ID!, name: String!, stock: Int!, price: Decimal!): Product!
  }
`;