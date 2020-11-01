import { Connection, Model, Schema } from 'mongoose';
import { Product } from './product';

export interface Book extends Product {
  authors: string[];
  publisher: string;
  language: string;
}

const schema = new Schema({
  productId: Schema.Types.String,
  name: Schema.Types.String,
  type: Schema.Types.String,
  authors: [Schema.Types.String],
  publisher: Schema.Types.String,
  language: Schema.Types.String,
  stock: Schema.Types.Number,
  price: Schema.Types.Decimal128,
});

export default function bookModel(conn: Connection): Model<Book> {
  return conn.model('products', schema);
}