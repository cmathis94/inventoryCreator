const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const inventory = require('./models/inventory');
const exp = require('constants');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/inventorys', async (req, res) => {
    const inventorys = await inventory.find({});
    res.render('inventorys/index.ejs', { inventorys });
});

app.get('/inventorys/new', (req, res) => {
    res.render('inventorys/new');
});

app.post('/inventorys', async (req, res) => {
    const inventory = new inventory(req.body.inventory);
    await inventory.save()
    res.redirect(`/inventorys/${inventory._id}`);
});

app.get('/inventorys/:id', async (req, res) => {
    const inventory = await inventory.findById(req.params.id);
    res.render('inventorys/show', { inventory });
});

app.get('/inventorys/:id/edit', async (req, res) => {
    const inventory = await inventory.findById(req.params.id);
    res.render('inventorys/edit', { inventory });
});

app.put('/inventorys/:id', async (req, res) => {
    const { id } = req.params;
    const inventory = await inventory.findByIdAndUpdate(id, { ...req.body.inventory });
    res.redirect(`/inventorys/${inventory._id}`);
});

app.delete('/inventorys/:id', async (req, res) => {
    const { id } = req.params;
    const deletedinventory = await inventory.findByIdAndDelete(id);
    res.redirect('/inventorys');
})

app.listen(3000, () => {
    console.log('On Port 3000');
});