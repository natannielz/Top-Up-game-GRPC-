import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  image: String,
  author: String,
  isPublished: Boolean
}, { timestamps: true, collection: 'news' });

const News = mongoose.model('News', schema);
export default News;
