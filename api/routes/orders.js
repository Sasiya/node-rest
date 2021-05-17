const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id product qty")
    .exec()
    .then((results) => {
      res.status(200).json({ count: results.length, orders: results });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  console.log({ req });
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    qty: req.body.qty,
    product: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      console.log({ result });
      res.status(201).json({ message: "Order Created" });
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  res.status(201).json({
    message: `Order Details of order ${req.params.orderId}`,
    orderId: req.params.orderId,
  });
});

module.exports = router;
