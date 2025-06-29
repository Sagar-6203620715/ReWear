const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: '',
    },
  },
  duration: {
    years: {
      type: Number,
      default: 0,
    },
    months: {
      type: Number,
      default: 0,
    },
  },
  affiliate_link: {
    type: String,
    default: '#',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews:{
    type:Number,
    default:0,
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  metaTitle:{
    type:String,
  },
  metaKeywords:{
    type:String,
  },
  dimensions:{
    length:Number,
    width:Number,
    height:Number,
  },
  weight:Number,
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Course', courseSchema);
