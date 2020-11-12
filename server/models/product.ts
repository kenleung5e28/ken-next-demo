import { Connection, Document, Model, Schema } from 'mongoose';
import { Decimal } from 'decimal.js';
import { gql } from 'apollo-server-micro';

export interface Product extends Document {
  productId: string;
  name: string;
  type: string;
  manufacturer: string;
  description: string | null;
  stock: number;
  price: Decimal;
}

export const typeDef = gql`
  type Product {
    productId: ID!
    name: String!
    type: String!
    manufacturer: String!
    description: String
    stock: Int!
    price: Decimal!
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
});

export default function productModel(conn: Connection): Model<Product> {
  return conn.model('products', schema);
}