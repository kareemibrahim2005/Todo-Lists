const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  id: Number,
  date: String,
  title: String,
  discription: String,
  completed: Boolean,
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer };
