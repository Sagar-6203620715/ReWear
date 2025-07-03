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
    required: true,
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
  // Revenue tracking fields
  clicks: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  lastClicked: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

// Add indexes for better performance
courseSchema.index({ domain: 1, section: 1 });
courseSchema.index({ name: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ price: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ clicks: -1 });
courseSchema.index({ revenue: -1 });
courseSchema.index({ name: 'text', metaTitle: 'text', metaKeywords: 'text' });

module.exports = mongoose.model('Course', courseSchema);
