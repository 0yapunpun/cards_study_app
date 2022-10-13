const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const deckSchema = new Schema(
  {
    user: mongoose.ObjectId,
    name: String,
    session: Number,
    cards: [
      new Schema({
        question: String,
        answer: String,
      }),
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Deck', deckSchema);
``;
