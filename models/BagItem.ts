import mongoose, { Schema, model, models } from "mongoose";

// ------------------ Topping Item Schema ------------------
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

// ------------------ Topping Group Schema ------------------
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
  selectedItem: {
    type: String, // stores selected single topping title
    default: "",
  },
  totalSelectedToppingPrice: {
    type: Number,
    default: 0,
  },
  items: {
    type: [toppingItemSchema],
    default: [],
  },
});

// ------------------ Bag Item Schema ------------------
const bagItemSchema = new Schema({
  userId: {
    type: String, // can be ObjectId if you reference a User collection
    required: true,
  },
  itemId: {
    type: String, // optional if ordering from table QR
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
  toppings: {
    type: [toppingSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ------------------ Create Model ------------------
const BagItem = models.BagItem || model("BagItem", bagItemSchema);

export default BagItem;