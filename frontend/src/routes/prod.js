const express = require("express");
const mongoose = require("mongoose");
const { Product } = require("../Models/products");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const productList = await Product.find();
    res.json(productList);
  } catch (error) {
    res.status(500).send("Error retrieving products: " + error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    res.json(product);
  } catch (error) {
    res.status(500).send("Error retrieving the product: " + error.message);
  }
});

router.post("/create", async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.data.title,
      description: req.body.data.description,
      price: req.body.data.price,
      discountPercentage: req.body.data.discountPercentage,
      rating: req.body.data.rating,
      stock: req.body.data.stock,
      brand: req.body.data.brand,
      category: req.body.data.category,
      thumbnail: req.body.data.thumbnail,
      images: req.body.data.images,
    });

    await newProduct.save();
    res.send("Product saved to the database!");
  } catch (error) {
    res.status(500).send("Error saving product: " + error.message);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        title: req.body.data.title,
        description: req.body.data.description,
        price: req.body.data.price,
        discountPercentage: req.body.data.discountPercentage,
        rating: req.body.data.rating,
        stock: req.body.data.stock,
        brand: req.body.data.brand,
        category: req.body.data.category,
        thumbnail: req.body.data.thumbnail,
        images: req.body.data.images,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found.");
    }

    res.send("Product updated successfully!");
  } catch (error) {
    res.status(500).send("Error updating product: " + error.message);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(product_id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found.");
    }

    res.send("Product deleted!");
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
});

module.exports = router;
