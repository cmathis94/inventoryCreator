const mongoose = require("mongoose");
const Inventory = require("../models/inventory.js");
const computers = require("./computers");

mongoose.connect("mongodb://localhost:27017/inventory-creator", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Inventory.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const invent = new Inventory({
      username: `${computers[i].username}`,
      serial: `${computers[i].serial}`,
      make: `${computers[i].make}`,
      model: `${computers[i].model}`,
    });
    await invent.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
