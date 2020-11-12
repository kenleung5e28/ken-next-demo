import { Connection, Model, Schema } from 'mongoose';
import { gql } from 'apollo-server-micro';
import { Product } from './product';

export interface Book extends Product {
  authors: string[];
  language: string;
}

export const typeDef = gql`
  type Book {
    productId: ID!
    name: String!
    type: String!
    manufacturer: String!
    description: String
    stock: Int!
    price: Decimal!
    authors: [String!]!
    language: String!
  }
`;

const schema = new Schema({
  productId: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String, required: true },
  type: { type: Schema.Types.String, required: true },
  manufacturer: { type: Schema.Types.String, required: true },
  description: {type: Schema.Types.String, default: null },
  stock: { type: Schema.Types.Number, required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  authors: { type: [Schema.Types.String], required: true },
  language: { type: Schema.Types.String, required: true },
});

export default function bookModel(conn: Connection): Model<Book> {
  return conn.model('products', schema);
}