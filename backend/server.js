import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";

dotenv.config();

const app = express();

app.use(express.json()); // allows us to accept JSON data in the req.body

app.get("/", (req, res) => {
  res.send("Welcome to the Product Listing API");
});

app.post("/api/products", async (req, res) => {
  const product = req.body; // user will send this data

  if (!product.name || !product.image || !product.price) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error saving product", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);
  process.exit(1);
});
