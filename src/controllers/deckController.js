const controller = {};
const mongoose = require('mongoose');
const deckModel = require('../models/deck.model');

controller.get = async (req, res, next) => {
  try {
    let response = await deckModel.find();
    return res.send({ success: true, data: response });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.getDeck = async (req, res, next) => {
  try {
    let { id } = req.body;

    let response = await deckModel.find({ _id: id });
    return res.send({ success: true, data: response });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.create = async (req, res, next) => {
  try {
    let { name } = req.body;
    let { id } = req.session.user;

    let newDeck = new deckModel({
      name: name,
      user: mongoose.Types.ObjectId(id),
    });

    await newDeck.save();
    return res.send({ success: true, message: 'succeeded operation' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.edit = async (req, res, next) => {
  try {
    let { id, name } = req.body;

    let response = await deckModel.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
        },
      }
    );

    return res.send({ success: true, message: 'succeeded operation' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.delete = async (req, res, next) => {
  try {
    let { id } = req.params;

    await deckModel.deleteOne({ _id: id });
    return res.send({ success: true, message: 'succeeded operation' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.createCard = async (req, res, next) => {
  try {
    let { idDeck, question, answer } = req.body;

    let response = await deckModel.updateOne(
      { _id: idDeck },
      {
        $push: {
          cards: {
            question: question,
            answer: answer,
          },
        },
      }
    );

    console.log(response);

    return res.send({ success: true, message: 'succeeded operatiosn' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.editCard = async (req, res, next) => {
  try {
    let { idDeck, idCard, question, answer } = req.body;

    let response = await deckModel.updateOne(
      { _id: idDeck, 'cards._id': idCard },
      {
        $set: {
          'cards.$.question': question,
          'cards.$.answer': answer,
        },
      }
    );

    return res.send({ success: true, message: 'succeeded operation' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

controller.deleteCard = async (req, res, next) => {
  try {
    let { idDeck, idCard } = req.params;

    let response = await deckModel.updateOne(
      { _id: idDeck },
      {
        $pull: {
          cards: {
            _id: idCard,
          },
        },
      }
    );

    console.log(response);

    return res.send({ success: true, message: 'succeeded operation' });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: 'failed operation' });
  }
};

module.exports = controller;
