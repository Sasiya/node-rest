const mongoose = require("mongoose");

const orderScema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderScema);
