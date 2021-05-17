const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        product: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);

      console.log({ response });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const products = {
    name: req.body.name,
    price: req.body.price,
  };
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log({ result });
      res.status(200).json({
        message: "Product Created Successfully",
        product: {
          name: result.name,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log({ doc });
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No data related to the given information",
        });
      }
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: err });
    });
});

router.put("/:productId", (req, res, next) => {
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Product.updateOne(
    { _id: req.params.productId },
    { $set: { name: req.body.name, price: req.body.price } },
    { upsert: true }
  )
    .exec()
    .then((result) => {
      console.log(result.nModified);
      if (result.nModified === 0) {
        res.status(422).json({ Error: "No Change" });
      } else {
        res.status(200).json({ message: "Updated Successfully" });
      }
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  Product.remove({ _id: req.params.productId })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
