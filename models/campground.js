const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    url: String,
    filename: String,
  }
);

imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('upload/', 'upload/w_300/');
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
}, opts);

campgroundSchema.virtual('properties.popupMarkup').get(function(){
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
          <P>${this.description.substring(0, 20)}...</P>`
});

campgroundSchema.post('findOneAndDelete', async function(doc) {
  if(doc){
    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);