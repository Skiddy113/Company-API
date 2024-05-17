const mongoose = require("mongoose");
const express = require("express");
const app = express();
const EmployeeRoutes = require("./empindex.js");
const DesignationRoutes = require("./desgindex.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/employees", EmployeeRoutes);
app.use("/designation", DesignationRoutes);

// Connecting with MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:nodeAPI1@backend.ybcklkj.mongodb.net/Company?retryWrites=true&w=majority&appName=Backend"
  )
  .then(() => {
    console.log("Connected to DB");
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Running on port ${port}...`));
  })
  .catch((error) => {
    console.error("Connection Failed", error);
  });
