const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const deckSchema = new Schema(
  {
    user: mongoose.ObjectId,
    name: String,
    session: Number,
    cards: [
      {
        id: mongoose.Schema.Types.ObjectId,
        question: String,
        answer: String,
        state: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Deck', deckSchema);
