import { gql } from 'apollo-server-micro';

export const schema = gql`
  scalar Decimal

  type Query {
    getProducts: [Product]!
    getBooks: [Book]!
    findProductsByManufacturer(manufacturer: String!): [Product]!
    findProductById(productId: ID!): Product
  }

  type Mutation {
    addGenericProduct(productId: ID!, name: String!, manufacturer: String!, description: String, stock: Int!, price: Decimal!): Product!
  }
`;