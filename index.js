const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Inventory = require("./models/inventory");
const exp = require("constants");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/inventory-creator");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/inventories", async (req, res) => {
  const inventories = await Inventory.find({});
  res.render("inventories/index.ejs", { inventories });
});

app.get("/inventories/new", (req, res) => {
  res.render("inventories/new");
});

app.post("/inventories", async (req, res) => {
  const inventory = new Inventory(req.body.inventory);
  await inventory.save();
  res.redirect(`/inventories/${inventory._id}`);
});

app.get("/inventories/:id", async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);
  res.render("inventories/show", { inventory });
});

app.get("/inventories/:id/edit", async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);
  res.render("inventories/edit", { inventory });
});

app.put("/inventories/:id", async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findByIdAndUpdate(id, {
    ...req.body.inventory,
  });
  res.redirect(`/inventories/${inventory._id}`);
});

app.delete("/inventories/:id", async (req, res) => {
  const { id } = req.params;
  const deletedinventory = await Inventory.findByIdAndDelete(id);
  res.redirect("/inventories");
});

app.listen(3000, () => {
  console.log("On Port 3000");
});
