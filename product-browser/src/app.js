const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Product Browser API is running 🚀",
    productsEndpoint: "/products"
  });
});

// Products API
app.use("/products", productsRouter);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});