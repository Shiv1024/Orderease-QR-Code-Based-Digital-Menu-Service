const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true }
});

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;
