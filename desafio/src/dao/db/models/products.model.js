import mongoose from 'mongoose';

const productCollection = 'Product';

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  code:String,
  stock:String
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;