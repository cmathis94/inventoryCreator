const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  serial: String,
  username: String,
  make: String,
  model: String,
  warranty: String,
});

module.exports = mongoose.model("Inventory", InventorySchema);
