import mongoose, { Schema, model, models } from "mongoose";

// Schema for individual topping item
const toppingItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
});

// Schema for a topping group
const toppingSchema = new Schema({
  toppingTitle: {
    type: String,
    required: true,
  },
  selectionType: {
    type: String,
    enum: ["single", "multiple"],
    default: "single",
  },
  selectedItem:{
    type: String,
  },
  totalSelectedToppingPrice: {
    type: Number,
    default: 0,
  },
  items: [toppingItemSchema],
});

// Main bag item schema
const bagItemSchema = new Schema({
  userId: {
    type: String, // or ObjectId if you have a User collection
    required: true,
  },
  itemId: {
    type: String, // for QR table orders
    required: false,
  },
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  qty: {
    type: Number,
    default: 1,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
    default: "",
  },
  toppings: [toppingSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const BagItem = models.BagItem || model("BagItem", bagItemSchema);

export default BagItem;