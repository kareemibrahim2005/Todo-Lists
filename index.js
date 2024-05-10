const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createCipheriv } = require("crypto");
const { Customer } = require("./models/customer");

const app = express();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// async function createCustomer() {
//   const customer = new Customer({
//     firstname: "node",
//     lastname: "boys",
//     email: "fxcg,jkjlnl/",
//   });

//   const result = await customer.save();
//   console.log(result);
// }

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/book/uncompleted", async (req, res) => {
  const customer = await Customer.find();
  const completedArray = [];

  for (let i = 0; i < customer.length; i++) {
    if (customer[i].completed === false) {
      completedArray.push(customer[i]);
    }
  }

  res.send(completedArray);
});

app.get("/api/book/completed", async (req, res) => {
  const customer = await Customer.find();
  const completedArray = [];

  for (let i = 0; i < customer.length; i++) {
    if (customer[i].completed === true) {
      completedArray.push(customer[i]);
    }
  }

  res.send(completedArray);
});

app.get("/api/books/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

app.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer)
    res.status(404).send(`The book with the given ID was not found`);
  res.send(customer);
});

app.post("/api/books/", async (req, res) => {
  const newCustomer = new Customer({ ...req.body });

  const customer = await newCustomer.save();

  console.log(customer);

  res.send(customer);
});

app.put("/api/books/:id", async (req, res) => {
  const newCustomer = new Customer({ ...req.body });
  const customer = await newCustomer.save();
  if (!newCustomer)
    res.status(404).send("The book with the given ID was not found");

  res.send(customer);
});

app.put("/api/books/completed/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndUpdate(id, { completed: true });

    const updatedCustomer = await Customer.findOne({ _id: id });
    res.json({
      message: "updated",
      updatedObject: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({ error: "Not Found" });
  }
});

app.put("/api/books/uncompleted/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndUpdate(id, { completed: false });

    const updatedCustomer = await Customer.findOne({ _id: id });
    res.json({
      message: "returned",
      updatedObject: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({ error: "Not Found" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCustomer = await Customer.findByIdAndDelete(id);
  return res.status(200).json(deleteCustomer);
});

app.delete("/api/books/delete/completed", async (req, res) => {
  try {
    const result = await Customer.deleteMany({ completed: true });
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ error: "Not Found" });
  }
});

const start = async () => {
  await mongoose.connect(
    "mongodb+srv://kareemibrahim5002:notpassword@cluster0.udun5ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("mongo bd connected");

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Listening on port ${port}...`));
};

start();
