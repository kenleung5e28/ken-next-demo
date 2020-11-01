import { Connection, Document, Model, Schema } from 'mongoose';
import { Decimal } from 'decimal.js';

export interface Product extends Document {
  productId: string;
  name: string;
  type: string;
  stock: number;
  price: Decimal;
}

const schema = new Schema({
  productId: Schema.Types.String,
  name: Schema.Types.String,
  type: Schema.Types.String,
  stock: Schema.Types.Number,
  price: Schema.Types.Decimal128,
});

export default function productModel(conn: Connection): Model<Product> {
  return conn.model('products', schema);
}