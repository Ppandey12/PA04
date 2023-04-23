
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var transSchema = Schema({
  description: String,
  categoty: String,
  amount: Number,
  date: Date,
  userId: { type: ObjectId, ref: 'user' }
});

module.exports = mongoose.model('transactionItem', transSchema);
