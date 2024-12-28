import { Product } from './Models/product';
const order = require("./Routes/orders");
app.use("/order", order);
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//Create 
app.post("/create", async (req, res) => {
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      stock: req.body.stock,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    });
  
    await Product.create(newProduct);
    res.send("Product saved to the database!");
  });
  //Get all 
  app.get("/read", async (req, res) => {
    const productList = await Product.find();
    res.send(JSON.stringify(productList));
  });
  //Update  based on the id
  app.put("/update/:id", async (req, res) => {
    const product_id = req.params.id;
    await Product.findByIdAndUpdate(product_id, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      stock: req.body.stock,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    });
  
    res.send("Product updated successfully!");
  });
  //Delete  based on the id
  app.delete("/delete/:id", async (req, res) => {
    const product_id = req.params.id;
    await Product.findByIdAndDelete(product_id);
    res.send("Product deleted!");
  });
  app.post("/create", async (req, res) => {
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
  
    await Product.create(newProduct);
    res.send("Product saved to the database!");
  });