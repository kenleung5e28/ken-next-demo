import { Decimal } from 'decimal.js';
import { Connection } from 'mongoose';
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import productModel, { Product } from './models/product';

export type ResolverFunc<TParent, TArgs, TReturn> = (parent: TParent, args: TArgs, context: { db: Connection }, info: GraphQLResolveInfo) => Promise<TReturn>;

export type Resolvers = {
  Decimal: GraphQLScalarType,
  Query: {
    getProducts: ResolverFunc<{}, {}, Product[]>,
    findByProductId: ResolverFunc<{}, { productId: string }, Product | null>,
  },
  Mutation: {
    addGenericProduct: ResolverFunc<{}, Product, Product>,
  },
}

export const resolvers: Resolvers = {
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
    getProducts: async (_parent, _args, { db }, _info) => {
      const products = productModel(db);
      const allProducts = await products.find().exec();
      return allProducts;
    },
    findByProductId: async (_parent, { productId }, { db }, _info) => {
      const products = productModel(db);
      const product = await products.findOne({ productId }).exec();
      return product;
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